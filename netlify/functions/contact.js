'use strict';

const RESEND_API_URL = 'https://api.resend.com/emails';
const TO_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'contact@spacegleam.co.jp';
const FROM_EMAIL = process.env.MAIL_FROM || 'noreply@send.spacegleam.co.jp';
const BASIC_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ALLOWED_ORIGINS = ['https://spacegleam.co.jp', 'https://www.spacegleam.co.jp'];
const MAX_BODY_BYTES = 24 * 1024;

function allowedOrigins() {
    const configured = String(process.env.CONTACT_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '')
        .split(',')
        .map((value) => value.trim().replace(/\/$/, ''))
        .filter(Boolean);
    return new Set(configured.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function requestOrigin(event) {
    return clean(event.headers?.origin || event.headers?.Origin, 300).replace(/\/$/, '');
}

function json(statusCode, body, origin = '') {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        Vary: 'Origin'
    };
    if (origin && allowedOrigins().has(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    };
}

function clean(value, maxLength) {
    return String(value || '')
        .replace(/\0/g, '')
        .replace(/\r\n/g, '\n')
        .trim()
        .slice(0, maxLength);
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function safeHttpUrl(value) {
    try {
        const url = new URL(String(value || ''));
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
    } catch (_) {
        return '';
    }
}

async function verifyRecaptcha(token) {
    const secret = clean(process.env.RECAPTCHA_SECRET_KEY, 240);
    if (!secret) return true;
    if (!token) return false;

    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    if (!response.ok) return false;
    const result = await response.json();
    return Boolean(
        result.success
        && (typeof result.score !== 'number' || result.score >= 0.5)
        && (!result.action || result.action === 'contact')
    );
}

exports.handler = async (event) => {
    const origin = requestOrigin(event);
    const originAllowed = origin && allowedOrigins().has(origin);

    if (event.httpMethod === 'OPTIONS') {
        return originAllowed
            ? json(204, {}, origin)
            : json(403, { success: false, message: 'Forbidden' });
    }

    if (event.httpMethod !== 'POST') {
        return json(405, { success: false, message: 'Method Not Allowed' }, origin);
    }

    if (!originAllowed) {
        return json(403, { success: false, message: 'この送信元からは受け付けられません。' });
    }

    const contentType = clean(event.headers?.['content-type'] || event.headers?.['Content-Type'], 100).toLowerCase();
    if (!contentType.startsWith('application/json')) {
        return json(415, { success: false, message: 'Unsupported Media Type' }, origin);
    }

    if (Buffer.byteLength(event.body || '', 'utf8') > MAX_BODY_BYTES) {
        return json(413, { success: false, message: '送信内容が大きすぎます。' }, origin);
    }

    try {
        const body = JSON.parse(event.body || '{}');

        if (clean(body.website, 120)) {
            return json(200, { success: true }, origin);
        }

        const company = clean(body.company, 120);
        const name = clean(body.name, 80);
        const email = clean(body.email, 160).toLowerCase();
        const category = clean(body.category || 'AI MVP開発・無料相談', 80);
        const subject = clean(body.subject || 'SPACE GLEAM 無料相談', 160);
        const message = clean(body.message, 3000);
        const budget = clean(body.budget, 80);
        const deadline = clean(body.deadline, 80);
        const meeting = clean(body.meeting, 120);
        const bookingUrl = clean(body.bookingUrl, 500);
        const referrer = clean(body.referrer, 120);
        const partnerWebsite = clean(body.partnerWebsite, 300);
        const partnerModel = clean(body.partnerModel, 120);
        const partnerStatus = clean(body.partnerStatus, 120);
        const recaptchaToken = clean(body.recaptchaToken, 4096);
        const source = clean(body.source || 'spacegleam-corp', 40);
        const entryPoint = clean(body.entryPoint || '通常お問い合わせページ', 160);
        const consentConfirmed = body.consentConfirmed === true;
        const safePartnerWebsite = safeHttpUrl(partnerWebsite);
        const safeBookingUrl = safeHttpUrl(bookingUrl);

        const errors = {};
        if (!company) errors.company = '会社名を入力してください。';
        if (!name) errors.name = 'お名前を入力してください。';
        if (!BASIC_EMAIL_RE.test(email)) errors.email = 'メールアドレスを正しく入力してください。';
        if (message.length < 5) errors.message = '相談内容を5文字以上で入力してください。';
        if (!consentConfirmed) errors.privacy = 'プライバシーポリシーへの同意が必要です。';

        if (Object.keys(errors).length) {
            return json(400, { success: false, message: '入力内容を確認してください。', errors }, origin);
        }

        if (!(await verifyRecaptcha(recaptchaToken))) {
            return json(400, { success: false, message: 'スパム判定により送信できませんでした。時間をおいて再度お試しください。' }, origin);
        }

        const apiKey = clean(process.env.RESEND_API_KEY, 240);
        if (!apiKey) {
            return json(500, { success: false, message: 'メール送信設定が未完了です。時間をおいて再度お試しください。' }, origin);
        }

        const isPartner = source === 'partner-page' || category.includes('パートナー');

        const text = [
            isPartner ? 'SPACE GLEAM コーポレートサイトから【AI開発パートナー相談】が届きました。' : 'SPACE GLEAM コーポレートサイトから無料相談が届きました。',
            '',
            `会社名: ${company}`,
            `お名前: ${name}`,
            `メール: ${email}`,
            `種別: ${category}`,
            `件名: ${subject}`,
            partnerWebsite ? `WebサイトURL: ${partnerWebsite}` : null,
            partnerModel ? `希望する連携方法: ${partnerModel}` : null,
            partnerStatus ? `現在AI関連の相談: ${partnerStatus}` : null,
            !isPartner ? `予算感: ${budget || '未選択'}` : null,
            !isPartner ? `希望納期: ${deadline || '未選択'}` : null,
            !isPartner ? `商談予約: ${meeting || '未選択'}${bookingUrl ? ` (日程調整URL: ${bookingUrl})` : ''}` : null,
            !isPartner ? `認知経路: ${referrer || '未選択'}` : null,
            `流入CTA: ${entryPoint}`,
            `送信元: ${source}`,
            '',
            '相談内容:',
            message || '未入力'
        ].filter(Boolean).join('\n');

        const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:'Noto Sans JP','Inter','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;color:#06163b;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f5f7fb;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #dbe6f5;border-radius:14px;overflow:hidden;">
<tr><td style="background:#050509;color:#fff;padding:20px 28px;font-weight:800;font-size:18px;">${escapeHtml(isPartner ? 'SPACE GLEAM AI開発パートナー相談' : 'SPACE GLEAM 無料相談')}</td></tr>
<tr><td style="padding:28px;">
<p><strong>会社名:</strong> ${escapeHtml(company)}</p>
<p><strong>お名前:</strong> ${escapeHtml(name)}</p>
<p><strong>メール:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p><strong>種別:</strong> ${escapeHtml(category)}</p>
<p><strong>件名:</strong> ${escapeHtml(subject)}</p>
${partnerWebsite ? `<p><strong>WebサイトURL:</strong> ${safePartnerWebsite ? `<a href="${escapeHtml(safePartnerWebsite)}" target="_blank" rel="noopener noreferrer">${escapeHtml(partnerWebsite)}</a>` : escapeHtml(partnerWebsite)}</p>` : ''}
${partnerModel ? `<p><strong>希望する連携方法:</strong> ${escapeHtml(partnerModel)}</p>` : ''}
${partnerStatus ? `<p><strong>現在AI関連の相談:</strong> ${escapeHtml(partnerStatus)}</p>` : ''}
${!isPartner ? `<p><strong>予算感:</strong> ${escapeHtml(budget || '未選択')}</p>` : ''}
${!isPartner ? `<p><strong>希望納期:</strong> ${escapeHtml(deadline || '未選択')}</p>` : ''}
${!isPartner ? `<p><strong>商談予約:</strong> ${escapeHtml(meeting || '未選択')}${safeBookingUrl ? ` (<a href="${escapeHtml(safeBookingUrl)}" target="_blank" rel="noopener noreferrer" style="color: #4f6df5; font-weight: bold;">日程調整カレンダー</a>)` : ''}</p>` : ''}
${!isPartner ? `<p><strong>認知経路:</strong> ${escapeHtml(referrer || '未選択')}</p>` : ''}
<p><strong>流入CTA:</strong> ${escapeHtml(entryPoint)}</p>
<div style="margin-top:22px;padding:18px;border-radius:12px;background:#f8fbff;border:1px solid #e1ebf8;white-space:pre-wrap;line-height:1.8;">${escapeHtml(message || '未入力')}</div>
</td></tr></table></td></tr></table></body></html>`;

        const resendResponse = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [TO_EMAIL],
                reply_to: email,
                subject: `【SPACE GLEAM】無料相談: ${subject}`,
                html,
                text
            })
        });

        const resendResult = await resendResponse.json().catch(() => null);
        if (!resendResponse.ok || resendResult?.error) {
            return json(500, { success: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }, origin);
        }

        return json(200, { success: true, message: 'お問い合わせを受け付けました。確認のうえご連絡します。' }, origin);
    } catch (error) {
        const isSyntaxError = error instanceof SyntaxError;
        return json(isSyntaxError ? 400 : 500, {
            success: false,
            message: isSyntaxError ? 'JSON形式が正しくありません。' : '送信に失敗しました。時間をおいて再度お試しください。'
        }, origin);
    }
};

// Netlify's edge-enforced limiter is shared across function instances and is
// therefore reliable even when the serverless runtime scales horizontally.
exports.config = {
    path: '/.netlify/functions/contact',
    rateLimit: {
        windowLimit: 5,
        windowSize: 180,
        aggregateBy: ['ip', 'domain']
    }
};
