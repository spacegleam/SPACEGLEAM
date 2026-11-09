# /partner redesign — where we are (resume here)

## Already deployed (main = c1e30e4a)
Only the **hero** of `/partner`: headline, plain eyebrow, ruled 3-fact row, one CTA
(`/contact?from=partner&cta=hero`), Pexels 13181674 background, hero spacing.
Styles are inline in `partner.html` (`<style data-partner-hero>`), scoped to `.partner-hero-v3`.

## NOT deployed yet (lives only in the demo, built from `partner.base.html`)
Run: `node tools/partner-redesign/build-partner-demo.js` -> writes `partner-demo.html` (repo root),
then serve the repo root (e.g. `npx http-server . -p 4178 -c-1 --cors`) and open `/partner-demo.html`.
`partner.base.html` is partner.html as it was before the hero deploy (41410ade); the build script's anchors
only match that file, not today's partner.html.

What the demo adds below the hero:
1. Revenue block (紹介型 / 開発型) — **numbers are placeholders** (300万円 x 10% etc.); the explanation PDF says
   紹介手数料 is **最大10%**, 10万〜150万円/案件. Needs real, approved figures + "最大" wording.
2. Own-product proof (DIFFsense / MERKI / 御御御付) + company facts strip.
3. FAQ Q1 "紹介手数料や収益は？" (renumbers old Q1-7 to Q2-8).
4. In-page consult form shown as a dialog (CTA click no longer scrolls ~13,000px). Demo only: it does not submit.
   Production path = existing /contact?from=partner&cta=<key> (script.js already knows header, hero,
   referral-model, development-model, case-studies, process, final, mobile-fixed, footer).
5. Every CTA tagged with from=partner&cta=...; mobile fixed bar wording unified.
6. Hero comparison tools: `?img=a..f` on the demo, `make-hero-mock.py` (text-on-photo mock PNGs).

## Open decisions (ask the owner)
- Real fee rate / sample numbers; show "最大10%"?
- Explanation PDF (`SPACEGLEAM_AI開発_紹介パートナー制度_説明資料.pdf`, 紹介パートナー only): publish? email-gated or direct download?
  The hero "説明資料をもらう" link was NOT deployed because nothing delivers the PDF yet.
- Which products may be named on the page.
- Header: the owner's polish branch has newer header CSS than production style.css (see git log notes / chat).

## Style rules the owner insisted on
No "AI-looking" templates (pills, dots, glows, shadows, gradients); plain/flat; no foreign people in photos;
photo must never sit behind/over the text; free stock photos need no credit line.
