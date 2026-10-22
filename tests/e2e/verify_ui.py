"""Headless smoke test for the built game UI.

Run with the helper so the preview server lifecycle is managed:
    python3 <skill>/scripts/with_server.py \
      --server "npm run preview -- --port 4173 --strictPort" --port 4173 \
      -- python3 tests/e2e/verify_ui.py
"""
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/kurumi-fx-rewrite/"


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))

        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_selector("canvas.fx-chart")

        title = page.inner_text(".fx-title")
        price_before = page.inner_text(".fx-quote-price")

        page.click('button[data-act="long"]')
        page.wait_for_timeout(150)

        # Persistence: a reload must restore the saved run (one open position).
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector("canvas.fx-chart")
        persisted = "1 笔" in page.content()

        page.click('button[data-act="play"]')
        page.wait_for_timeout(1500)
        price_after = page.inner_text(".fx-quote-price")

        # Theme switch
        page.click('button[data-theme-set="terminal"]')
        page.wait_for_timeout(200)
        theme = page.get_attribute("html", "data-theme")
        page.screenshot(path="/tmp/fx-terminal.png", full_page=True)
        page.click('button[data-theme-set="cyber"]')
        page.wait_for_timeout(200)
        page.screenshot(path="/tmp/fx-cyber.png", full_page=True)

        print("TITLE:", title.replace("\n", " | "))
        print("PRICE_BEFORE:", price_before)
        print("PRICE_AFTER:", price_after)
        print("THEME:", theme)
        print("PERSISTED:", persisted)
        print("CONSOLE_ERRORS:", errors[:5])
        browser.close()


if __name__ == "__main__":
    main()