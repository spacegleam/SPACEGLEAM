// Apply ONLY the new hero to the production partner.html (origin/main). Nothing else from the demo.
const fs = require('fs');
const F = require('path').resolve(__dirname, '../../partner.html');
let s = fs.readFileSync(F, 'utf8');
const crlf = s.includes('\r\n');
s = s.replace(/\r\n/g, '\n');
const must = (a, b, label) => { if (s.split(a).length !== 2) throw new Error('anchor not unique/missing: ' + label); s = s.replace(a, () => b); };
if (s.includes('data-partner-hero')) throw new Error('hero already applied');

// 1) background photo (white interior, Pexels 13181674) – replaces the plant/vase image
must('<link rel="preload" as="image" href="assets/partner_hero_bg_nobooks-opt.jpg" fetchpriority="high">',
  '<link rel="preload" as="image" href="assets/partner-hero-pexels-13181674.jpg" fetchpriority="high">', 'preload');
must('<img src="assets/partner_hero_bg_nobooks-opt.jpg" data-fallback-src="assets/partner_hero_bg_nobooks.png" alt="植物のある明るいワークスペース" class="partner-hero-v3-bg-img" width="1024" height="1024" fetchpriority="high" decoding="async">',
  '<img src="assets/partner-hero-pexels-13181674.jpg" alt="白い壁と黒い窓枠が印象的な、明るいオフィスの階段まわり" class="partner-hero-v3-bg-img" width="1920" height="1280" fetchpriority="high" decoding="async">', 'bg img');

// 2) eyebrow: program name + who it is for (plain text, no pill / divider)
must(`<span class="partner-badge-pill">AI開発パートナー制度</span>
                        <span class="tag-divider">|</span>
                        <span class="partner-tag-sub">Web制作会社・広告代理店・コンサルティング会社向け</span>`,
  `<span class="partner-eyebrow"><span class="partner-eyebrow__label">AI開発パートナー制度</span><span class="partner-eyebrow__text">Web制作会社・広告代理店・コンサル会社の方へ</span></span>`, 'eyebrow');

// 3) headline + sub-text
must(`<span class="hero-line-phrase">AIエンジニアを採用せず、</span><br class="pc-only">
                        <span class="hero-line-phrase">自社の提案メニューに</span><br class="pc-only">
                        <span class="hero-line-phrase">「<span class="text-blue">AI開発</span>」を追加。</span>`,
  `<span class="hero-line-phrase">AI案件を、採用なしで受けられる。</span><br class="pc-only">
                        <span class="hero-line-phrase">紹介だけでも、<span class="text-blue">手数料</span>が入る。</span>`, 'h1');
must(`<span class="hero-line-phrase">要件整理から開発・納品まで、</span><br class="pc-only">
                        <span class="hero-line-phrase">外部開発チームとしてワンストップで支援します。</span>`,
  `<span class="hero-line-phrase">Web制作会社・広告代理店・コンサルティング会社の</span><br class="pc-only">
                        <span class="hero-line-phrase">外部AI開発チームとして、要件整理から納品まで支援します。</span>`, 'sub');

// 4) the three facts: shorter descriptions; "万全" (no basis) -> concrete promise
must('<div class="feature-desc">はじめる費用は一切かかりません</div>', '<div class="feature-desc">初期費用もかかりません</div>', 'desc1');
must('<div class="feature-desc">ご自身のペースでご提案いただけます</div>', '<div class="feature-desc">自分のペースで提案できます</div>', 'desc2');
must(`<div class="feature-title">情報セキュリティ</div>
                                <div class="feature-val">万全</div>
                                <div class="feature-desc">厳格なセキュリティ体制で対応</div>`,
  `<div class="feature-title">直接営業</div>
                                <div class="feature-val">なし</div>
                                <div class="feature-desc">NDAにも対応します</div>`, 'stat3');

// 5) CTA: one button to the existing contact form, tagged as a partner inquiry (script.js already understands from=partner&cta=hero)
must(`<a href="contact.html" class="partner-hero-cta-btn">
                            パートナー制度について相談する <span class="arrow">→</span>
                        </a>
                        <span class="partner-cta-note">無理な営業は一切ありません。お気軽にご相談ください。</span>`,
  `<a href="contact.html?from=partner&amp;cta=hero" class="partner-hero-cta-btn">
                            30分で相談する（無料） <span class="arrow">→</span>
                        </a>
                        <span class="partner-cta-note">1〜2営業日以内にご連絡します。具体的な案件がなくてもご相談いただけます。</span>`, 'cta');

// 6) page-scoped CSS (hero only)
const H = '.partner-hero-v3 ';
const CSS = `    <style data-partner-hero>
        /* Partner hero (2026-11). Scoped to .partner-hero-v3 so nothing else on the page or site changes. */
        ${H}{min-height:0 !important;align-items:flex-start !important;padding-top:48px !important;padding-bottom:72px !important}
        ${H}.partner-hero-v3-bg-img{width:100% !important;height:100% !important;object-fit:cover;object-position:center 66% !important;opacity:1 !important;filter:contrast(1.15) saturate(1.05)}
        ${H}.partner-hero-v3-overlay{background:linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 54%,rgba(255,255,255,.78) 64%,rgba(255,255,255,.28) 78%,rgba(255,255,255,0) 92%) !important}
        ${H}.partner-eyebrow{display:block;line-height:1.6}
        ${H}.partner-eyebrow__label{display:inline;color:#0f172a;font-size:.95rem;font-weight:800;letter-spacing:.04em}
        ${H}.partner-eyebrow__text{display:inline;padding:0 0 0 1.4em;font-size:.95rem;font-weight:500;color:#475569}
        ${H}.partner-hero-features-row{display:grid !important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 !important;width:min(100%,720px) !important;background:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;border:0 !important;border-top:1px solid #cfd6df !important;border-bottom:1px solid #cfd6df !important;border-radius:0 !important;box-shadow:none !important;padding:0 !important;margin-bottom:36px !important}
        ${H}.feature-vertical-divider,${H}.feature-icon-circle{display:none !important}
        ${H}.partner-feature-col{display:block !important;padding:18px 24px 18px 0}
        ${H}.partner-feature-col ~ .partner-feature-col{border-left:1px solid #cfd6df;padding-left:24px}
        ${H}.feature-title{font-size:.8rem !important;font-weight:700 !important;color:#475569 !important;letter-spacing:.02em}
        ${H}.feature-val{font-size:2.1rem !important;font-weight:800 !important;color:#0f172a !important;line-height:1.15 !important;margin:4px 0 6px !important}
        ${H}.val-unit{font-size:1rem !important;font-weight:700 !important;margin-left:2px}
        ${H}.feature-desc{font-size:.8rem !important;color:#475569 !important;line-height:1.55 !important;word-break:auto-phrase;line-break:strict}
        ${H}.partner-hero-cta-row{gap:0 !important;flex-wrap:wrap;align-items:center}
        ${H}.partner-hero-cta-btn{border-radius:2px !important;box-shadow:none !important;min-height:56px;padding:0 32px !important;font-size:1rem !important;background:#0f172a !important}
        ${H}.partner-hero-cta-btn:hover{transform:none !important;box-shadow:none !important;background:#000 !important}
        ${H}.partner-hero-cta-btn .arrow{margin-left:12px}
        ${H}.partner-cta-note{flex-basis:100%;margin-top:14px;font-size:.85rem !important;font-weight:500 !important;color:#475569 !important}
        @media (max-width:860px){
            ${H}.partner-hero-v3-overlay{background:rgba(255,255,255,.86) !important}
            ${H}.partner-hero-cta-btn{width:100%}
            ${H}.partner-hero-v3-content{display:flex;flex-direction:column}
            ${H}.partner-hero-v3-content>*{order:1}
            ${H}.partner-hero-v3-content>.partner-hero-features-row{order:2;margin-top:22px}
            ${H}.partner-hero-cta-row{margin-top:20px}
        }
        @media (max-width:640px){
            ${H}{padding-top:24px !important;padding-bottom:48px !important}
            ${H}.partner-eyebrow__label,${H}.partner-eyebrow__text{display:block;padding:0}
            ${H}.partner-eyebrow__text{margin-top:2px;font-size:.8rem;white-space:nowrap}
            ${H}.partner-hero-features-row{grid-template-columns:1fr !important}
            ${H}.partner-feature-col{padding:12px 0 !important}
            ${H}.partner-feature-col ~ .partner-feature-col{border-left:0;padding-left:0;border-top:1px solid #cfd6df}
            ${H}.feature-body{display:grid !important;grid-template-columns:1fr auto;column-gap:12px;align-items:center}
            ${H}.feature-title{grid-column:1;grid-row:1}
            ${H}.feature-desc{grid-column:1;grid-row:2}
            ${H}.feature-val{grid-column:2;grid-row:1 / span 2;margin:0 !important;font-size:1.7rem !important}
        }
    </style>
`;
must('</head>', CSS + '</head>', 'head close');

fs.writeFileSync(F, crlf ? s.replace(/\n/g, '\r\n') : s, 'utf8');
console.log('hero applied to partner.html (' + (crlf ? 'CRLF' : 'LF') + ')');
