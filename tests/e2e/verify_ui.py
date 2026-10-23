import os
from playwright.sync_api import sync_playwright

URL = os.environ.get("FX_URL", "http://localhost:4173/kurumi-fx-rewrite/")

def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))

        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_selector("canvas.fx-chart")

        face_ok = page.eval_on_selector("img.fx-face-img, .fx-face img", "el => el.complete && el.naturalWidth > 0")

        # Mangas / galleries dialog loads real images
        page.click('button[data-act="open:manga"]')
        page.wait_for_selector(".fx-modal", timeout=8000)
        page.wait_for_timeout(900)
        manga_imgs = page.locator(".fx-gallery img").count()
        page.wait_for_function("() => [...document.querySelectorAll('.fx-gallery img')].some(i => i.complete && i.naturalWidth > 0)", timeout=8000)
        gallery_ok = True
        page.screenshot(path="/tmp/fx-manga.png", full_page=False)
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:items"]'); page.wait_for_selector(".fx-item", timeout=6000)
        items = page.locator(".fx-item").count()
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:life"]'); page.wait_for_selector(".fx-modal", timeout=6000)
        life_btns = page.locator('.fx-modal [data-act^="life:"]').count()
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:news"]'); page.wait_for_selector(".fx-modal", timeout=6000)
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:settings"]'); page.wait_for_selector(".fx-modal", timeout=6000)
        bgm_buttons = page.locator('.fx-modal [data-act^="bgm:play:"]').count()
        page.click('.fx-modal-head button[data-act="modal:close"]')

        page.click('button[data-act="open:voice"]'); page.wait_for_selector(".fx-modal", timeout=6000)
        voice_buttons = page.locator('.fx-modal [data-act^="voice:play:"]').count()
        page.click('.fx-modal-head button[data-act="modal:close"]')

        # Trade + play loop + persistence
        page.click('button[data-act="long"]'); page.wait_for_timeout(150)
        page.reload(); page.wait_for_load_state("networkidle")
        persisted = "1 笔" in page.content()
        page.click('button[data-act="play"]'); page.wait_for_timeout(1500)
        price = page.inner_text(".fx-quote-price")
        page.click('button[data-theme-set="terminal"]'); page.wait_for_timeout(200)
        page.screenshot(path="/tmp/fx-terminal.png", full_page=True)
        page.click('button[data-theme-set="cyber"]'); page.wait_for_timeout(200)
        page.screenshot(path="/tmp/fx-cyber.png", full_page=True)

        print("FACE_OK:", face_ok)
        print("MANGA_IMGS:", manga_imgs, "GALLERY_OK:", gallery_ok)
        print("ITEMS:", items, "LIFE_BTNS:", life_btns, "BGM:", bgm_buttons, "VOICE:", voice_buttons)
        print("PERSISTED:", persisted, "PRICE:", price)
        print("CONSOLE_ERRORS:", errors[:6])
        browser.close()

if __name__ == "__main__":
    main()
