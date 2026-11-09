// Build partner-demo.html (repo root) from tools/partner-redesign/partner.base.html = the partner.html as it was BEFORE the hero deploy (41410ade). Demo only; nothing is deployed.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const BASE = path.join(__dirname, 'partner.base.html');
let s = fs.readFileSync(BASE, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
s = s.replace(/\r\n/g, '\n');

const must = (a, b, label) => { if (s.split(a).length !== 2) throw new Error('anchor not unique/missing: ' + label); s = s.replace(a, () => b); };
const mustAll = (a, b, n, label) => { const c = s.split(a).length - 1; if (c !== n) throw new Error(`${label}: expected ${n}, found ${c}`); s = s.split(a).join(b); };

// ---- head: demo flags -------------------------------------------------------------
must('<title>AI開発パートナー｜Web制作会社・広告代理店向け｜SPACE GLEAM</title>', '<title>【DEMO】AI開発パートナー｜Web制作会社・広告代理店向け｜SPACE GLEAM</title>\n    <meta name="robots" content="noindex,nofollow">', 'title');
must('<link rel="canonical" href="https://spacegleam.co.jp/partner">', '', 'canonical');

// ---- header CTA: tag with from=partner so inquiries are classified as partner inquiries
must("<a class='header-cta' href='contact.html'>", "<a class='header-cta' href='contact.html?from=partner&amp;cta=header'>", 'header cta');

// ---- hero: copy, trust chip, two-step CTA -----------------------------------------
must(`<span class="hero-line-phrase">AIエンジニアを採用せず、</span><br class="pc-only">
                        <span class="hero-line-phrase">自社の提案メニューに</span><br class="pc-only">
                        <span class="hero-line-phrase">「<span class="text-blue">AI開発</span>」を追加。</span>`,
`<span class="hero-line-phrase">AI案件を、採用なしで受けられる。</span><br class="pc-only">
                        <span class="hero-line-phrase">紹介だけでも、<span class="text-blue">手数料</span>が入る。</span>`, 'h1');
must(`<span class="hero-line-phrase">要件整理から開発・納品まで、</span><br class="pc-only">
                        <span class="hero-line-phrase">外部開発チームとしてワンストップで支援します。</span>`,
`<span class="hero-line-phrase">Web制作会社・広告代理店・コンサルティング会社の</span><br class="pc-only">
                        <span class="hero-line-phrase">外部AI開発チームとして、要件整理から納品まで支援します。</span>`, 'sub');
// hero background photo: free stock (Pexels, Mart Production). Replaces the plant/vase image.
must('<link rel="preload" as="image" href="assets/partner_hero_bg_nobooks-opt.jpg" fetchpriority="high">', '<link rel="preload" as="image" href="assets/partner-hero-pexels-13181674.jpg" fetchpriority="high">', 'preload');
must('<img src="assets/partner_hero_bg_nobooks-opt.jpg" data-fallback-src="assets/partner_hero_bg_nobooks.png" alt="植物のある明るいワークスペース" class="partner-hero-v3-bg-img" width="1024" height="1024" fetchpriority="high" decoding="async">',
  '<img src="assets/partner-hero-pexels-13181674.jpg" alt="白い壁と黒い窓枠が印象的な、明るいオフィスの階段まわり" class="partner-hero-v3-bg-img" width="1920" height="1280" fetchpriority="high" decoding="async">', 'hero img');
// eyebrow row: program name + who this is for, as one capsule addressed to the reader
must(`<span class="partner-badge-pill">AI開発パートナー制度</span>
                        <span class="tag-divider">|</span>
                        <span class="partner-tag-sub">Web制作会社・広告代理店・コンサルティング会社向け</span>`,
`<span class="pd-eyebrow"><span class="pd-eyebrow__label">AI開発パートナー制度</span><span class="pd-eyebrow__text">Web制作会社・広告代理店・コンサル会社の方へ</span></span>`, 'eyebrow');
// shorter descriptions so they do not wrap mid-phrase
must('<div class="feature-desc">はじめる費用は一切かかりません</div>', '<div class="feature-desc">初期費用もかかりません</div>', 'desc1');
must('<div class="feature-desc">ご自身のペースでご提案いただけます</div>', '<div class="feature-desc">自分のペースで提案できます</div>', 'desc2');
// third stat: "万全" (unsupported) -> concrete promise
must(`<div class="feature-title">情報セキュリティ</div>
                                <div class="feature-val">万全</div>
                                <div class="feature-desc">厳格なセキュリティ体制で対応</div>`,
`<div class="feature-title">直接営業</div>
                                <div class="feature-val">なし</div>
                                <div class="feature-desc">NDAにも対応します</div>`, 'stat3');
must(`<a href="contact.html" class="partner-hero-cta-btn">
                            パートナー制度について相談する <span class="arrow">→</span>
                        </a>
                        <span class="partner-cta-note">無理な営業は一切ありません。お気軽にご相談ください。</span>`,
`<a href="#partner-form" class="partner-hero-cta-btn" data-pd-cta="hero" data-pd-type="まだ迷っている">
                            30分で相談する（無料） <span class="arrow">→</span>
                        </a>
                        <a href="#partner-form" class="pd-ghost-btn" data-pd-cta="hero-doc" data-pd-type="まだ迷っている" data-pd-doc="1">説明資料をもらう</a>
                        <span class="partner-cta-note">1〜2営業日以内にご連絡します。具体的な案件がなくてもご相談いただけます。</span>`, 'hero cta');

// ---- model cards, case/process links, footer, mobile bar: tag every link --------------
must('href="contact.html?from=partner&amp;cta=referral-model" class="btn btn-secondary model-cta-btn"', 'href="#partner-form" class="btn btn-secondary model-cta-btn" data-pd-cta="referral-model" data-pd-type="紹介したい"', 'model1');
must('href="contact.html?from=partner&amp;cta=development-model" class="btn btn-primary model-cta-btn"', 'href="#partner-form" class="btn btn-primary model-cta-btn" data-pd-cta="development-model" data-pd-type="開発を任せたい"', 'model2');
must('<a href="contact.html" class="case-consult-link">', '<a href="#partner-form" class="case-consult-link" data-pd-cta="case-studies" data-pd-type="まだ迷っている">', 'case link');
must('<a href="contact.html" class="process-cta-link">', '<a href="#partner-form" class="process-cta-link" data-pd-cta="process" data-pd-type="まだ迷っている">', 'process link');
must('<a href="contact.html" class="mobile-fixed-cta">自社顧客へのAI提案について相談する →</a>', '<a href="#partner-form" class="mobile-fixed-cta" data-pd-cta="mobile-fixed" data-pd-type="まだ迷っている">無料で相談する（1〜2営業日で返信） →</a>', 'mobile bar');
must('<li><a href="contact.html">お問い合わせ</a></li>', '<li><a href="contact.html?from=partner&amp;cta=footer">お問い合わせ</a></li>', 'footer link');
must('<a href="contact.html" class="works-cta-btn-v2">', '<a href="contact.html?from=partner&amp;cta=footer" class="works-cta-btn-v2">', 'footer cta');

// ---- new sections right after the hero: economics + proof -------------------------------
const NEW_SECTIONS = `
        <!-- DEMO: economics -->
        <section id="partner-economics" class="section pd-econ">
            <div class="container">
                <div class="section-header text-center reveal">
                    <p class="eyebrow">REVENUE</p>
                    <h2 class="section-title">パートナーの収益は、こうなります</h2>
                    <p class="section-desc">どちらの連携方法でも、案件ごとに条件を書面でご提示します。数字はイメージです。</p>
                </div>
                <div class="pd-econ-grid">
                    <article class="pd-econ-card reveal">
                        <div class="pd-econ-head"><span class="pd-chip">01 紹介パートナー</span><span class="pd-demo-badge">DEMO・仮の数字</span></div>
                        <h3>紹介するだけで、成約時に手数料</h3>
                        <p>提案・見積・契約・開発は、すべてSPACE GLEAMが担当します。</p>
                        <dl class="pd-calc">
                            <div><dt>成約した契約金額</dt><dd>300<small>万円</small></dd></div>
                            <div class="pd-op">×</div>
                            <div><dt>紹介手数料</dt><dd>10<small>%</small></dd></div>
                            <div class="pd-op">＝</div>
                            <div class="pd-total"><dt>貴社の収益</dt><dd>30<small>万円</small></dd></div>
                        </dl>
                        <a href="#partner-form" class="pd-link" data-pd-cta="economics-referral" data-pd-type="紹介したい">紹介の条件を聞いてみる <span aria-hidden="true">→</span></a>
                    </article>
                    <article class="pd-econ-card pd-econ-card--hi reveal">
                        <div class="pd-econ-head"><span class="pd-chip pd-chip--hi">02 開発パートナー</span><span class="pd-demo-badge">DEMO・仮の数字</span></div>
                        <h3>貴社の価格で売り、差額が収益</h3>
                        <p>貴社が顧客窓口になり、実装はSPACE GLEAMが担当します。販売価格は貴社で決められます。</p>
                        <dl class="pd-calc">
                            <div><dt>顧客への販売価格</dt><dd>300<small>万円</small></dd></div>
                            <div class="pd-op">−</div>
                            <div><dt>SPACE GLEAMの開発費</dt><dd>200<small>万円</small></dd></div>
                            <div class="pd-op">＝</div>
                            <div class="pd-total"><dt>貴社の収益</dt><dd>100<small>万円</small></dd></div>
                        </dl>
                        <a href="#partner-form" class="pd-link" data-pd-cta="economics-development" data-pd-type="開発を任せたい">開発費の目安を聞いてみる <span aria-hidden="true">→</span></a>
                    </article>
                </div>
                <p class="pd-fine">※ 料率・金額は案件の内容により変わります。上記は考え方を示す例で、金額をお約束するものではありません。加盟金・月額費用・更新料はありません。</p>
            </div>
        </section>

        <!-- DEMO: proof -->
        <section id="partner-proof" class="section pd-proof">
            <div class="container">
                <div class="section-header text-center reveal">
                    <p class="eyebrow">TRACK RECORD</p>
                    <h2 class="section-title">自社プロダクトを、自分たちで運用しています</h2>
                    <p class="section-desc">受託だけでなく、企画から運用まで自社で回してきた開発チームです。</p>
                </div>
                <div class="pd-proof-grid">
                    <a class="pd-proof-card reveal" href="works.html">
                        <b>DIFFsense</b>
                        <span>契約書AI</span>
                        <p>契約書の差分比較・要約・リスク整理から、電子署名・期限管理・契約台帳までをつなぐサービス。</p>
                    </a>
                    <a class="pd-proof-card reveal" href="works.html">
                        <b>MERKI</b>
                        <span>制度変更・期限管理</span>
                        <p>情報収集、ルール設定、チーム共有、通知までを、一つの運用にまとめたサービス。</p>
                    </a>
                    <a class="pd-proof-card reveal" href="blog/omiotsuke-android-app-release/">
                        <b>御御御付</b>
                        <span>AI味噌汁提案アプリ</span>
                        <p>食材や気分から今日の一杯を診断。Web版とAndroidアプリで公開しています。</p>
                    </a>
                </div>
                <ul class="pd-facts reveal">
                    <li><b>2018年</b>設立</li>
                    <li><b>東京・港区</b>拠点</li>
                    <li><b>最短2〜4週間</b>MVP公開の目安</li>
                    <li><b>1〜2営業日</b>ご相談への返信</li>
                </ul>
            </div>
        </section>
`;
// insert after the hero section (the line that opens the pain-points section)
must('        <!-- Section 2: Pain Points Section (Matches Reference Image Exactly) -->', NEW_SECTIONS + '\n        <!-- Section 2: Pain Points Section (Matches Reference Image Exactly) -->', 'insert after hero');

// ---- FAQ: add "手数料はいくら?" as Q1 and renumber ------------------------------------
const faqNew = `                    <div class="faq-item">
                        <button type="button" class="faq-trigger" aria-expanded="false">
                            <span class="faq-q-box">
                                <span class="faq-num">Q1.</span>
                                <span class="faq-divider"></span>
                                <span class="faq-question">紹介手数料や、パートナーの収益はどのくらいですか？</span>
                            </span>
                            <span class="faq-icon-wrapper" aria-hidden="true">
                                <span class="faq-icon-line h"></span><span class="faq-icon-line v"></span>
                            </span>
                        </button>
                        <div class="faq-content">
                            <div class="faq-answer">案件の規模や連携方法によって異なります。紹介パートナーは成約金額に応じた紹介手数料、開発パートナーは販売価格と開発費の差額が収益になります。初回ミーティングで、条件を書面でご提示します。</div>
                        </div>
                    </div>

`;
must('                <div class="faq-list reveal">\n                    <div class="faq-item">', '                <div class="faq-list reveal">\n' + faqNew + '                    <div class="faq-item">', 'faq insert');
// renumber the original Q1..Q7 -> Q2..Q8 (descending to avoid double replacement)
for (let n = 7; n >= 1; n--) {
  const from = `<span class="faq-num">Q${n}.</span>\n                                <span class="faq-divider"></span>\n                                <span class="faq-question">`;
  const to = `<span class="faq-num">Q${n + 1}.</span>\n                                <span class="faq-divider"></span>\n                                <span class="faq-question">`;
  const parts = s.split(from);
  // the new Q1 we inserted also matches Q1 pattern; skip the first occurrence for n=1
  if (n === 1) { s = parts[0] + from + parts[1] + parts.slice(2).map((p, i) => (i === 0 ? to : from) + p).join(''); }
  else { if (parts.length !== 2) throw new Error('faq Q' + n + ' count ' + (parts.length - 1)); s = parts.join(to); }
}

// ---- final CTA -> on-page form ----------------------------------------------------------
const a = s.indexOf('<section id="partner-final-cta"');
const b = s.indexOf('</section>', a) + '</section>'.length;
if (a < 0) throw new Error('final cta not found');
const FORM = `<section id="partner-form" class="section pd-form-section" aria-labelledby="pd-form-title">
            <div class="container pd-form-inner">
                <div class="pd-form-copy reveal">
                    <p class="eyebrow">CONSULTATION</p>
                    <h2 id="pd-form-title">案件が決まる前から、<br>相談できます。</h2>
                    <p>提案前の壁打ちから商談同席、開発・納品まで。貴社の進め方に合わせてご一緒します。</p>
                    <ul class="pd-form-points">
                        <li>具体的な案件がなくても大丈夫です</li>
                        <li>1〜2営業日以内にご連絡します</li>
                        <li>加盟金・月額費用はかかりません</li>
                        <li>NDAにも対応します</li>
                    </ul>
                </div>
                <form class="pd-form reveal" id="pd-form" novalidate>
                    <p class="pd-form-title">パートナー制度のご相談</p>
                    <fieldset class="pd-field">
                        <legend>ご関心 <em class="pd-req">必須</em></legend>
                        <div class="pd-seg" role="radiogroup">
                            <label><input type="radio" name="type" value="紹介したい"><span>紹介したい</span></label>
                            <label><input type="radio" name="type" value="開発を任せたい"><span>開発を任せたい</span></label>
                            <label><input type="radio" name="type" value="まだ迷っている" checked><span>まだ迷っている</span></label>
                        </div>
                    </fieldset>
                    <label class="pd-field"><span>会社名 <em class="pd-req">必須</em></span><input type="text" name="company" autocomplete="organization" placeholder="株式会社○○" required></label>
                    <label class="pd-field"><span>お名前 <em class="pd-req">必須</em></span><input type="text" name="name" autocomplete="name" placeholder="山田 太郎" required></label>
                    <label class="pd-field"><span>メールアドレス <em class="pd-req">必須</em></span><input type="email" name="email" autocomplete="email" placeholder="name@example.co.jp" required></label>
                    <label class="pd-field"><span>ご相談内容 <em class="pd-opt">任意</em></span><textarea name="message" rows="3" placeholder="例）顧客から受けたAIの相談を、どう進めるか知りたい"></textarea></label>
                    <label class="pd-check"><input type="checkbox" name="doc" id="pd-doc"><span>説明資料（PDF）も受け取る</span></label>
                    <label class="pd-check"><input type="checkbox" name="privacy" required><span><a href="privacy.html" target="_blank" rel="noopener">プライバシーポリシー</a>に同意します <em class="pd-req">必須</em></span></label>
                    <input type="hidden" name="cta" id="pd-cta" value="direct">
                    <button type="submit" class="pd-submit">相談を送る（無料） <span aria-hidden="true">→</span></button>
                    <p class="pd-form-note">営業電話は行いません。いただいた内容は、ご相談への返信にのみ使います。</p>
                    <div class="pd-done" id="pd-done" hidden>
                        <b>デモのため、送信はされません。</b>
                        <p>本番では、この相談は「パートナー制度の相談」として受け付けます。どのボタンから来たかも記録されます。</p>
                        <p class="pd-done-meta" id="pd-done-meta"></p>
                    </div>
                </form>
            </div>
        </section>`;
s = s.slice(0, a) + FORM + s.slice(b);

// ---- demo banner + CSS + JS --------------------------------------------------------------
const CSS = `
    <style data-partner-demo>
        .pd-demo-ribbon{position:fixed;top:0;left:0;right:0;z-index:2000;height:26px;display:flex;align-items:center;justify-content:center;background:#111;color:#fff;text-align:center;font:700 11px/1 "Noto Sans JP",sans-serif;padding:0 8px;letter-spacing:.02em;white-space:nowrap;overflow:hidden}
        .pd-demo-ribbon b{color:#ffd54a}
        body.partner-page-body{padding-top:26px}
        .header{top:26px !important}
        /* hero: stop vertically centering a viewport-tall box; start the content just below the header */
        .partner-hero-v3{min-height:0 !important;align-items:flex-start !important;padding-top:48px !important;padding-bottom:72px !important}
        .pd-eyebrow{display:inline-flex;align-items:stretch;border:1.5px solid #0f172a;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.92);box-shadow:0 6px 18px rgba(15,23,42,.08)}
        .pd-eyebrow__label{display:inline-flex;align-items:center;gap:8px;background:#0f172a;color:#fff;font-weight:800;font-size:.9rem;letter-spacing:.03em;padding:9px 20px 9px 16px;white-space:nowrap}
        .pd-eyebrow__label i{width:8px;height:8px;border-radius:50%;background:#5b8cff;box-shadow:0 0 0 3px rgba(91,140,255,.28)}
        .pd-eyebrow__text{display:inline-flex;align-items:center;color:#0f172a;font-weight:700;font-size:.92rem;padding:9px 20px 9px 16px}
        .pd-ghost-btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 22px;margin-left:12px;border:1.5px solid #0f172a;border-radius:6px;color:#0f172a;font-weight:800;font-size:.95rem;background:rgba(255,255,255,.85);text-decoration:none}
        .pd-ghost-btn:hover{background:#0f172a;color:#fff}
        .partner-hero-cta-row{flex-wrap:wrap;gap:10px 0;align-items:center}
        .pd-econ .section-header,.pd-proof .section-header{text-align:center}
        .pd-econ,.pd-proof{background:#fff}
        .pd-proof{background:#f6f8fb}
        .pd-econ-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:34px}
        .pd-econ-card{background:#fff;border:1px solid #dbe3ee;border-radius:14px;padding:26px 26px 22px;box-shadow:0 10px 34px rgba(15,23,42,.06)}
        .pd-econ-card--hi{border-color:#2563eb;box-shadow:0 14px 40px rgba(37,99,235,.14)}
        .pd-econ-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
        .pd-chip{font-size:.78rem;font-weight:800;color:#0f172a;border:1px solid #cbd5e1;border-radius:99px;padding:3px 12px}
        .pd-chip--hi{color:#2563eb;border-color:#2563eb}
        .pd-demo-badge{font-size:.7rem;font-weight:800;color:#8a5a00;background:#fff3cd;border:1px dashed #d9a400;border-radius:6px;padding:2px 8px}
        .pd-econ-card h3{font-size:1.2rem;line-height:1.5;margin:0 0 8px;color:#0f172a}
        .pd-econ-card p{color:#475569;font-size:.95rem;line-height:1.8;margin:0 0 18px}
        .pd-calc{display:grid;grid-template-columns:1fr auto 1fr auto 1.15fr;gap:8px;align-items:center;margin:0 0 18px;padding:16px;background:#f6f8fb;border-radius:10px}
        .pd-calc>div{text-align:center}
        .pd-calc dt{font-size:.72rem;color:#64748b;font-weight:700;margin-bottom:4px;line-height:1.4}
        .pd-calc dd{margin:0;font-size:1.7rem;font-weight:900;color:#0f172a;line-height:1.1;font-family:"Inter","Noto Sans JP",sans-serif}
        .pd-calc dd small{font-size:.8rem;font-weight:800;margin-left:2px}
        .pd-calc .pd-op{font-size:1.2rem;font-weight:800;color:#94a3b8}
        .pd-calc .pd-total dd{color:#2563eb}
        .pd-link{font-weight:800;color:#2563eb;text-decoration:none}
        .pd-link:hover{text-decoration:underline}
        .pd-fine{margin:18px 0 0;text-align:center;color:#64748b;font-size:.82rem;line-height:1.8}
        .pd-proof-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:30px}
        .pd-proof-card{display:block;background:#fff;border:1px solid #dbe3ee;border-radius:12px;padding:20px 20px 18px;text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s}
        .pd-proof-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(15,23,42,.1)}
        .pd-proof-card b{display:block;font-size:1.25rem;color:#0f172a;font-family:"Inter","Noto Sans JP",sans-serif}
        .pd-proof-card span{display:block;font-size:.78rem;font-weight:800;color:#2563eb;margin:2px 0 8px}
        .pd-proof-card p{margin:0;color:#475569;font-size:.9rem;line-height:1.75}
        .pd-facts{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:26px 0 0;padding:0}
        .pd-facts li{text-align:center;background:#fff;border:1px solid #dbe3ee;border-radius:10px;padding:14px 8px;font-size:.8rem;color:#64748b;font-weight:700}
        .pd-facts b{display:block;font-size:1.05rem;color:#0f172a;margin-bottom:2px}
        .pd-form-section{background:linear-gradient(135deg,#0b1220 0%,#16233f 100%);color:#fff}
        .pd-form-inner{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:44px;align-items:start}
        .pd-form-copy .eyebrow{color:#9db6ff}
        .pd-form-copy h2{color:#fff;font-size:clamp(1.7rem,3.2vw,2.3rem);line-height:1.4;margin:6px 0 14px}
        .pd-form-copy p{color:#c7d2e8;line-height:1.9}
        .pd-form-points{list-style:none;margin:18px 0 0;padding:0}
        .pd-form-points li{position:relative;padding-left:26px;margin:8px 0;color:#e6ecfa;font-weight:700}
        .pd-form-points li::before{content:"✓";position:absolute;left:0;color:#7cf0b0;font-weight:900}
        .pd-form{background:#fff;color:#0f172a;border-radius:14px;padding:26px 24px 22px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
        .pd-form-title{margin:0 0 14px;font-weight:900;font-size:1.1rem}
        .pd-field{display:block;margin:0 0 14px;border:0;padding:0}
        .pd-field>span,.pd-field legend{display:block;font-size:.82rem;font-weight:800;margin-bottom:6px;padding:0}
        .pd-field input[type=text],.pd-field input[type=email],.pd-field textarea{width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:11px 12px;font:inherit;font-size:.95rem;background:#fff;color:#0f172a}
        .pd-field input:focus,.pd-field textarea:focus{outline:2px solid #2563eb;outline-offset:1px;border-color:#2563eb}
        .pd-field input.is-bad{border-color:#e5251b;background:#fff5f4}
        .pd-req{font-style:normal;font-size:.68rem;font-weight:800;color:#fff;background:#e5251b;border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:1px}
        .pd-opt{font-style:normal;font-size:.68rem;font-weight:800;color:#64748b;background:#eef2f7;border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:1px}
        .pd-seg{display:flex;flex-wrap:wrap;gap:8px}
        .pd-seg label{cursor:pointer}
        .pd-seg input{position:absolute;opacity:0;pointer-events:none}
        .pd-seg span{display:inline-block;border:1.5px solid #cbd5e1;border-radius:99px;padding:8px 16px;font-size:.9rem;font-weight:700;color:#334155;background:#fff}
        .pd-seg input:checked+span{background:#0f172a;border-color:#0f172a;color:#fff}
        .pd-seg input:focus-visible+span{outline:2px solid #2563eb;outline-offset:2px}
        .pd-check{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;font-size:.88rem;line-height:1.6;cursor:pointer}
        .pd-check input{margin-top:4px;width:17px;height:17px;flex:0 0 17px}
        .pd-submit{width:100%;min-height:54px;margin-top:6px;border:0;border-radius:8px;background:#0f172a;color:#fff;font:inherit;font-weight:900;font-size:1rem;cursor:pointer}
        .pd-submit:hover{background:#2563eb}
        /* Plain, restrained styling (reference: Kinsta / HubSpot / Shopify partner pages): no capsules, dots, glows, shadows or gradients */
        .pd-eyebrow{display:block;border:0;border-radius:0;background:none;box-shadow:none;overflow:visible}
        .pd-eyebrow__label{display:inline;background:none;color:#0f172a;padding:0;font-size:.95rem;font-weight:800;letter-spacing:.04em}
        .pd-eyebrow__text{display:inline;padding:0 0 0 1.4em;font-size:.95rem;font-weight:500;color:#475569}
        .pd-econ-card{border-radius:4px;box-shadow:none;border-color:#cfd6df}
        .pd-econ-card--hi{border:1.5px solid #0f172a;box-shadow:none}
        .pd-chip,.pd-chip--hi{border:0;border-radius:0;padding:0;font-size:.8rem;color:#475569;letter-spacing:.06em}
        .pd-demo-badge{border-radius:2px}
        .pd-calc{border-radius:4px;background:#f3f4f6}
        .pd-calc .pd-total dd{color:#0f172a}
        .pd-link{color:#0f172a;text-decoration:underline;text-underline-offset:4px}
        .pd-proof-card{border-radius:4px;transition:none}
        .pd-proof-card:hover{transform:none;box-shadow:none;border-color:#0f172a}
        .pd-proof-card span{color:#475569}
        .pd-facts li{border-radius:4px}
        .pd-form-section{background:#0f172a}
        .pd-form-copy .eyebrow{color:#9aa4b5}
        .pd-form-copy p{color:#c4cbd6}
        .pd-form-points li{padding-left:18px;font-weight:500;color:#e5e7eb}
        .pd-form-points li::before{content:"–";color:#9aa4b5;font-weight:400}
        .pd-form{border-radius:4px;box-shadow:none}
        .pd-field input[type=text],.pd-field input[type=email],.pd-field textarea{border-radius:4px}
        .pd-seg span{border-radius:4px;border-width:1px}
        .pd-req{border-radius:2px}
        .pd-submit{border-radius:4px}
        .pd-submit:hover{background:#1e293b}
        .pd-done{border-radius:4px}
        .pd-eyebrow{line-height:1.6}
        /* hero photo: its own framed block in the right column. No overlay, no fade, never behind the text. */
        /* hero photo: full-bleed, medium crop (window grid AND staircase both readable), light wash only behind the text */
        .partner-hero-v3-bg-img{width:100% !important;height:100% !important;object-fit:cover;object-position:center 66% !important;opacity:1 !important;filter:contrast(1.15) saturate(1.05)}
        .partner-hero-v3-overlay{background:linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 54%,rgba(255,255,255,.78) 64%,rgba(255,255,255,.28) 78%,rgba(255,255,255,0) 92%) !important}
        @media (max-width:860px){
            .partner-hero-v3-overlay{background:rgba(255,255,255,.86) !important}
        }
        html{scroll-behavior:auto !important}
        body.pd-modal{overflow:hidden}
        .pd-dialog{position:fixed;inset:0;margin:auto !important;height:fit-content;z-index:3000;border:0;padding:0;border-radius:4px;width:calc(100% - 24px);max-width:520px;max-height:calc(100vh - 24px);overflow:auto;background:#fff;color:#0f172a}
        .pd-dialog::backdrop{background:rgba(15,23,42,.55)}
        .pd-dialog .pd-form{box-shadow:none;border-radius:0;margin:0;padding:30px 24px 22px;opacity:1 !important;transform:none !important}
        .pd-dialog .pd-form-title{margin-right:72px}
        .pd-dialog__close{position:absolute;top:10px;right:12px;border:0;background:none;font:inherit;font-size:.85rem;font-weight:700;color:#475569;cursor:pointer;padding:6px 8px}
        .pd-dialog__close:hover{color:#0f172a}
        @media (max-width:640px){.pd-eyebrow__label,.pd-eyebrow__text{display:block;padding:0}.pd-eyebrow__text{margin-top:2px;font-size:.8rem;white-space:nowrap}}
        /* hero facts: plain ruled columns instead of a rounded white card with circled icons */
        .partner-hero-features-row{display:grid !important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 !important;width:min(100%,720px) !important;background:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;border:0 !important;border-top:1px solid #cfd6df !important;border-bottom:1px solid #cfd6df !important;border-radius:0 !important;box-shadow:none !important;padding:0 !important;margin-bottom:36px !important}
        .feature-vertical-divider,.feature-icon-circle{display:none !important}
        .partner-feature-col{display:block !important;padding:18px 24px 18px 0}
        .partner-feature-col ~ .partner-feature-col{border-left:1px solid #cfd6df;padding-left:24px}
        .feature-title{font-size:.8rem !important;font-weight:700 !important;color:#475569 !important;letter-spacing:.02em}
        .feature-val{font-size:2.1rem !important;font-weight:800 !important;color:#0f172a !important;line-height:1.15 !important;margin:4px 0 6px !important}
        .val-unit{font-size:1rem !important;font-weight:700 !important;margin-left:2px}
        .feature-desc{font-size:.8rem !important;color:#475569 !important;line-height:1.55 !important;word-break:auto-phrase;line-break:strict}
        /* hero buttons: one solid button + a plain text link, no shadow, no lift */
        .partner-hero-cta-row{gap:0 !important;flex-wrap:wrap;align-items:center}
        .partner-hero-cta-btn{border-radius:2px !important;box-shadow:none !important;min-height:56px;padding:0 32px !important;font-size:1rem !important;background:#0f172a !important}
        .partner-hero-cta-btn:hover{transform:none !important;box-shadow:none !important;background:#000 !important}
        .partner-hero-cta-btn .arrow{margin-left:12px}
        .pd-ghost-btn{border:0 !important;background:none !important;min-height:56px;padding:0 4px !important;margin-left:28px !important;text-decoration:underline;text-underline-offset:5px;font-weight:700;font-size:1rem;color:#0f172a !important}
        .pd-ghost-btn:hover{background:none !important;color:#475569 !important}
        .partner-cta-note{flex-basis:100%;margin-top:14px;font-size:.85rem !important;font-weight:500 !important;color:#475569 !important}
        @media (max-width:640px){
            .partner-hero-features-row{grid-template-columns:1fr !important}
            .partner-feature-col{padding:12px 0 !important}
            .partner-feature-col ~ .partner-feature-col{border-left:0;padding-left:0;border-top:1px solid #cfd6df}
            .feature-body{display:grid !important;grid-template-columns:1fr auto;column-gap:12px;align-items:center}
            .feature-title{grid-column:1;grid-row:1}
            .feature-desc{grid-column:1;grid-row:2}
            .feature-val{grid-column:2;grid-row:1 / span 2;margin:0 !important;font-size:1.7rem !important}
            .pd-ghost-btn{margin-left:0 !important;width:100%;justify-content:center;min-height:48px}
        }
        .pd-form-note{margin:10px 0 0;font-size:.78rem;color:#64748b;text-align:center}
        .pd-done{margin-top:14px;padding:14px 16px;border-radius:10px;background:#ecfdf3;border:1px solid #86e0ad;color:#0a5a30;font-size:.88rem;line-height:1.7}
        .pd-done p{margin:4px 0 0}
        .pd-done-meta{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.78rem;color:#0a5a30;background:#d6f5e3;border-radius:6px;padding:5px 8px;word-break:break-all}
        .mobile-fixed-cta{font-size:.95rem}
        @media (max-width:640px){.pd-eyebrow{flex-direction:column;border-radius:14px;width:100%}.pd-eyebrow__label{padding:9px 16px}.pd-eyebrow__text{padding:9px 16px;font-size:.88rem}}
        @media (max-width:640px){.partner-hero-v3{padding-top:24px !important;padding-bottom:48px !important}}
        @media (max-width:860px){
            .pd-econ-grid,.pd-proof-grid{grid-template-columns:1fr}
            .pd-form-inner{grid-template-columns:1fr;gap:26px}
            .pd-facts{grid-template-columns:repeat(2,minmax(0,1fr))}
            .pd-ghost-btn{margin-left:0;width:100%;min-height:48px}
            .partner-hero-cta-btn{width:100%}
            .partner-hero-v3-content{display:flex;flex-direction:column}
            .partner-hero-v3-content>*{order:1}
            .partner-hero-v3-content>.partner-hero-features-row{order:2;margin-top:22px}
            .partner-hero-cta-row{margin-top:20px}
        }
        @media (max-width:420px){
            .pd-calc{grid-template-columns:1fr;gap:4px}
            .pd-calc .pd-op{display:none}
            .pd-calc>div{display:flex;justify-content:space-between;align-items:baseline;text-align:left;padding:4px 2px}
            .pd-calc dt{margin:0}
            .pd-calc dd{font-size:1.4rem}
        }
    </style>
`;
must('</head>', CSS + '</head>', 'head close');
must('<body class="partner-page-body standalone-menu-page">', '<body class="partner-page-body standalone-menu-page">\n    <div class="pd-demo-ribbon"><b>DEMO</b>　改修案のイメージ（数字は仮・送信なし・本番は未変更）</div>', 'ribbon');

const JS = `
    <script data-partner-demo>
    (function () {
        var form = document.getElementById('pd-form');
        var ctaField = document.getElementById('pd-cta');
        var doc = document.getElementById('pd-doc');
        function pick(type) { var r = form.querySelector('input[name=type][value="' + type + '"]'); if (r) r.checked = true; }
        // comparison page (?g=1): show everything at once, no scroll-triggered fade-in
        if (/[?&]g=1/.test(location.search)) { var showAll = function () { document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('is-visible'); }); }; showAll(); document.addEventListener('DOMContentLoaded', showAll); window.addEventListener('load', showAll); }
        // hero photo variants for comparison: ?img=a|b|c|d|e|f
        (function () {
            var P = { a: ['partner-hero-unsplash-f77UJy0_iW8.jpg', 'center 72%'], b: ['partner-hero-unsplash-jTz1YxjDaGE.jpg', 'center 55%'], c: ['partner-hero-unsplash-YdXr-lZ2_m8.jpg', 'center 64%'], d: ['partner-hero-pexels-7255284.jpg', 'center 40%'], e: ['partner-hero-pexels-13181674.jpg', 'center 80%', 'flip'], f: ['partner-hero-pexels-30978561.jpg', 'center 45%'] };
            var k = new URLSearchParams(location.search).get('img');
            var v = P[k] || P.e;
            var i = document.querySelector('.partner-hero-v3-bg-img');
            if (i && v) { i.src = 'assets/' + v[0]; }
        })();
        // CTA click opens the form in place (a dialog) instead of scrolling ~13,000px down the page.
        var home = form.parentNode;
        var dlg = document.createElement('dialog');
        dlg.className = 'pd-dialog';
        dlg.setAttribute('aria-label', 'パートナー制度のご相談');
        dlg.innerHTML = '<button type="button" class="pd-dialog__close">閉じる ×</button><div class="pd-dialog__body"></div>';
        document.body.appendChild(dlg);
        function openForm() {
            if (typeof dlg.showModal !== 'function') { form.scrollIntoView({ behavior: 'auto', block: 'center' }); return; }
            dlg.querySelector('.pd-dialog__body').appendChild(form);
            form.classList.add('is-visible');
            document.body.classList.add('pd-modal');
            dlg.showModal();
            var f = form.elements.company; if (f) f.focus();
        }
        dlg.addEventListener('close', function () { home.appendChild(form); document.body.classList.remove('pd-modal'); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        dlg.querySelector('.pd-dialog__close').addEventListener('click', function () { dlg.close(); });
        // capture phase: stop the site's smooth-scroll handler on in-page anchors
        window.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('[data-pd-cta]') : null;
            if (!a) return;
            e.preventDefault(); e.stopPropagation();
            ctaField.value = a.getAttribute('data-pd-cta');
            if (a.getAttribute('data-pd-type')) pick(a.getAttribute('data-pd-type'));
            doc.checked = a.getAttribute('data-pd-doc') === '1';
            if (typeof window.gtag === 'function') window.gtag('event', 'cta_click', { cta_location: 'partner_demo:' + ctaField.value, cta_text: (a.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 100), destination: '/partner#partner-form' });
            openForm();
        }, true);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var bad = 0;
            ['company', 'name', 'email'].forEach(function (n) {
                var el = form.elements[n]; var ok = el.value.trim() && (n !== 'email' || /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(el.value));
                el.classList.toggle('is-bad', !ok); if (!ok) bad++;
            });
            if (!form.elements.privacy.checked) bad++;
            var done = document.getElementById('pd-done');
            if (bad) { done.hidden = true; var first = form.querySelector('.is-bad') || form.elements.privacy; first.focus(); return; }
            document.getElementById('pd-done-meta').textContent = 'from=partner / cta=' + ctaField.value + ' / type=' + form.elements.type.value + (doc.checked ? ' / 資料請求あり' : '');
            done.hidden = false;
            done.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        });
    })();
    </script>
`;
must('</body>', JS + '</body>', 'body close');

fs.writeFileSync(ROOT + '/partner-demo.html', s.replace(/\n/g, nl), 'utf8');
console.log('built partner-demo.html', s.length, 'chars');
