import os
from playwright.sync_api import sync_playwright

URL = os.environ.get("FX_URL", "http://localhost:4173/kurumi-fx-rewrite/")

def count(page, sel):
    return page.locator(sel).count()

def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL); page.wait_for_load_state("networkidle"); page.wait_for_selector("canvas.fx-chart")

        face_ok = page.eval_on_selector(".fx-face img", "el => el.complete && el.naturalWidth > 0")
        extras = count(page, '.fx-extras [data-act^="amount:"]') + count(page, '.fx-extras [data-act^="stake:"]')
        toolbar = count(page, '[data-act^="period:"]') + count(page, '[data-act^="ma:"]') + count(page, '[data-act^="speed:"]')
        pressure = count(page, '[data-act^="press:"]')

        # Buy then position management buttons
        page.click('button[data-act="long"]'); page.wait_for_timeout(200)
        half = count(page, '[data-act^="half:"]'); closeb = count(page, '[data-act^="close:"]')
        page.click('button[data-act="open:margin"]'); page.wait_for_selector(".fx-modal"); margin_ok = count(page, '[data-act^="margin:"]') > 0
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="press:stake"]'); page.wait_for_timeout(150)
        page.click('button[data-act="share"]'); page.wait_for_selector(".fx-modal"); share_ok = count(page, '[data-act^="share:"]') > 0
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:opening"]'); page.wait_for_selector(".fx-modal")
        page.click('button[data-act="opening:next"]'); page.wait_for_timeout(150)
        opening_ok = "序章 2" in page.content()
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:source"]'); page.wait_for_selector(".fx-modal"); mode_ok = count(page, '[data-act^="source:"]') > 0
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:manga"]'); page.wait_for_selector(".fx-modal"); page.wait_for_timeout(1200)
        manga_imgs = count(page, ".fx-gallery img")
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:life"]'); page.wait_for_selector(".fx-modal"); life = count(page, '.fx-modal [data-act^="life:"]')
        page.click('.fx-modal-head button[data-act="modal:close"]')
        page.click('button[data-act="open:settings"]'); page.wait_for_selector(".fx-modal"); bgm = count(page, '[data-act^="bgm:play:"]')
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="play"]'); page.wait_for_timeout(1200)
        price = page.inner_text(".fx-quote-price")
        page.click('button[data-theme-set="terminal"]'); page.wait_for_timeout(200)
        page.screenshot(path="/tmp/fx-terminal.png", full_page=True)

        print("FACE_OK:", face_ok)
        print("ORDER_EXTRAS:", extras, "TOOLBAR:", toolbar, "PRESSURE:", pressure)
        print("HALF/CLOSE:", half, closeb, "MARGIN_OK:", margin_ok, "SHARE_OK:", share_ok, "OPENING_OK:", opening_ok, "MODE_OK:", mode_ok)
        print("MANGA_IMGS:", manga_imgs, "LIFE:", life, "BGM:", bgm)
        print("PRICE:", price)
        print("CONSOLE_ERRORS:", errors[:6])
        browser.close()

if __name__ == "__main__":
    main()
