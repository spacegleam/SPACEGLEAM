import os, base64, io
from PIL import Image, ImageDraw, ImageFont

ROOT = 'D:/AG/deploy_wt_gov'
OUT = ROOT + '/hero-mock'
os.makedirs(OUT, exist_ok=True)
F = 'C:/Windows/Fonts/'
def font(w, s): return ImageFont.truetype(F + f'NotoSansJP-{w}.otf', s)

W, H = 1920, 900
HEAD = 104
INK = (15, 23, 42); MUTE = (71, 85, 105); BLUE = (37, 99, 235); LINE = (207, 214, 223)

PHOTOS = {
    'A': ('partner-hero-unsplash-f77UJy0_iW8.jpg', 0.72, '青空と高層ビル（東京都庁）'),
    'B': ('partner-hero-unsplash-jTz1YxjDaGE.jpg', 0.55, '街並みと建築（麻布台ヒルズ）'),
    'C': ('partner-hero-unsplash-YdXr-lZ2_m8.jpg', 0.64, '夕暮れの高層ビル（渋谷）'),
    'D': ('partner-hero-pexels-7255284.jpg', 0.40, 'デスクで作業する手元'),
    'E': ('partner-hero-pexels-13181674.jpg', 0.50, '白い建物の内部'),
    'F': ('partner-hero-pexels-30978561.jpg', 0.45, '東京湾の高層ビル群'),
}


def cover(img, w, h, posy):
    s = max(w / img.width, h / img.height)
    nw, nh = round(img.width * s), round(img.height * s)
    im = img.resize((nw, nh), Image.LANCZOS)
    x = (nw - w) // 2
    y = round((nh - h) * posy)
    return im.crop((x, y, x + w, y + h))


def overlay_alpha(w):
    # same stops as the demo: white 1.0 until 66%, .9 at 76%, .35 at 90%, 0 at 100%
    stops = [(0, 1.0), (0.66, 1.0), (0.76, 0.9), (0.90, 0.35), (1.0, 0.0)]
    col = Image.new('L', (w, 1))
    px = col.load()
    for x in range(w):
        t = x / (w - 1)
        for (a, va), (b, vb) in zip(stops, stops[1:]):
            if a <= t <= b:
                v = va + (vb - va) * ((t - a) / (b - a) if b > a else 0)
                break
        px[x, 0] = round(v * 255)
    return col


def text_w(d, t, f): return d.textlength(t, font=f)


def build(key):
    fn, posy, label = PHOTOS[key]
    base = Image.new('RGB', (W, H), (248, 250, 252))
    hero_h = H - HEAD
    ph = cover(Image.open(ROOT + '/assets/' + fn).convert('RGB'), W, hero_h, posy)
    white = Image.new('RGB', (W, hero_h), (255, 255, 255))
    mask = overlay_alpha(W).resize((W, hero_h))
    hero = Image.composite(white, ph, mask)
    base.paste(hero, (0, HEAD))
    d = ImageDraw.Draw(base)

    # header
    d.rectangle([0, 0, W, HEAD], fill=(255, 255, 255))
    d.line([0, HEAD, W, HEAD], fill=(228, 232, 238), width=1)
    bolt = Image.open(ROOT + '/assets/spacegleam-logo-header-v2.webp').convert('RGBA')
    bh = 50; bw = round(bolt.width * bh / bolt.height)
    base.paste(bolt.resize((bw, bh), Image.LANCZOS), (70, 27), bolt.resize((bw, bh), Image.LANCZOS))
    d.text((70 + bw + 14, 28), 'SPACE GLEAM', font=font('Black', 36), fill=INK)
    nav = ['AI業務システム開発', '料金', '実績', 'FAQ', 'パートナー制度', 'Blog']
    nf = font('Bold', 19); x = 720
    for n in nav:
        d.text((x, 38), n, font=nf, fill=INK); x += text_w(d, n, nf) + 36
    d.rounded_rectangle([1540, 28, 1850, 78], radius=4, fill=INK)
    d.text((1566, 40), '担当者に相談する  →', font=font('Bold', 20), fill=(255, 255, 255))

    X0 = 340
    # eyebrow
    ef1, ef2 = font('Bold', 21), font('Regular', 21)
    d.text((X0, 168), 'AI開発パートナー制度', font=ef1, fill=INK)
    d.text((X0 + text_w(d, 'AI開発パートナー制度', ef1) + 34, 168), 'Web制作会社・広告代理店・コンサル会社の方へ', font=ef2, fill=MUTE)

    # headline
    hf = font('Black', 74)
    d.text((X0, 212), 'AI案件を、採用なしで受けられる。', font=hf, fill=INK)
    t1, t2, t3 = '紹介だけでも、', '手数料', 'が入る。'
    x = X0
    d.text((x, 308), t1, font=hf, fill=INK); x += text_w(d, t1, hf)
    d.text((x, 308), t2, font=hf, fill=BLUE); x += text_w(d, t2, hf)
    d.text((x, 308), t3, font=hf, fill=INK)

    # sub
    sf = font('Medium', 25)
    d.text((X0, 432), 'Web制作会社・広告代理店・コンサルティング会社の', font=sf, fill=(51, 65, 85))
    d.text((X0, 470), '外部AI開発チームとして、要件整理から納品まで支援します。', font=sf, fill=(51, 65, 85))

    # stats (ruled columns)
    top, bot = 544, 706
    colw = 262
    d.line([X0, top, X0 + colw * 3, top], fill=LINE, width=2)
    d.line([X0, bot, X0 + colw * 3, bot], fill=LINE, width=2)
    stats = [('加盟金・月額費用', '0', '円', '初期費用もかかりません'), ('案件ノルマ', 'なし', '', '自分のペースで提案できます'), ('直接営業', 'なし', '', 'NDAにも対応します')]
    for i, (lab, val, unit, desc) in enumerate(stats):
        cx = X0 + i * colw + (26 if i else 0)
        if i:
            d.line([X0 + i * colw, top + 6, X0 + i * colw, bot - 6], fill=LINE, width=2)
        d.text((cx, top + 18), lab, font=font('Bold', 17), fill=MUTE)
        d.text((cx, top + 46), val, font=font('Black', 50), fill=INK)
        if unit:
            d.text((cx + text_w(d, val, font('Black', 50)) + 4, top + 74), unit, font=font('Bold', 20), fill=INK)
        d.text((cx, top + 118), desc, font=font('Regular', 16), fill=MUTE)

    # CTA
    d.rounded_rectangle([X0, 744, X0 + 392, 808], radius=3, fill=INK)
    d.text((X0 + 34, 758), '30分で相談する（無料）  →', font=font('Bold', 24), fill=(255, 255, 255))
    lf = font('Bold', 23); lx = X0 + 392 + 34
    d.text((lx, 760), '説明資料をもらう', font=lf, fill=INK)
    d.line([lx, 794, lx + text_w(d, '説明資料をもらう', lf), 794], fill=INK, width=2)
    d.text((X0, 834), '1〜2営業日以内にご連絡します。具体的な案件がなくてもご相談いただけます。', font=font('Medium', 18), fill=MUTE)

    path = f'{OUT}/hero-{key}.png'
    base.save(path, optimize=True)
    return path, label, base


rows = []
for k in 'ABCDEF':
    p, label, im = build(k)
    small = im.resize((1280, round(1280 * H / W)), Image.LANCZOS)
    b = io.BytesIO(); small.save(b, 'JPEG', quality=88)
    rows.append((k, label, 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), p))
    print('made', p, os.path.getsize(p) // 1024, 'KB')

html = '''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ヒーロー完成イメージ</title>
<style>body{margin:0;background:#e9ebee;color:#111;font:15px/1.6 "Noto Sans JP","Hiragino Kaku Gothic ProN",Meiryo,sans-serif}.w{max-width:1320px;margin:0 auto;padding:22px 16px 60px}h1{font-size:20px;margin:0 0 4px}p{margin:0 0 20px;color:#555}figure{margin:0 0 26px;background:#fff;border:1px solid #d5d8dd}figcaption{display:flex;gap:12px;align-items:baseline;padding:10px 14px;border-bottom:1px solid #e5e7eb}figcaption b{font-size:28px;line-height:1}figcaption span{color:#555;font-size:14px}img{display:block;width:100%;height:auto}</style></head><body><div class="w"><h1>ヒーロー完成イメージ（文字入り）</h1><p>写真ごとに、同じ文字・同じ配置で作っています。気に入った番号を教えてください。</p>'''
for k, label, uri, p in rows:
    html += f'<figure><figcaption><b>{k}</b><span>{label}</span></figcaption><img src="{uri}" alt=""></figure>'
html += '</div></body></html>'
open(ROOT + '/hero-mock.html', 'w', encoding='utf-8').write(html)
print('page', len(html) // 1024, 'KB')
