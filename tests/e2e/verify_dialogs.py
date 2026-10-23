import os
from playwright.sync_api import sync_playwright
URL=os.environ.get("FX_URL","http://localhost:4173/kurumi-fx-rewrite/")
def main():
    with sync_playwright() as p:
        b=p.chromium.launch(headless=True); pg=b.new_page(viewport={"width":1280,"height":900})
        errs=[]; pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_load_state("networkidle")
        res={}
        for act,key in [("open:mangalib","mangalib"),("open:charstory","charstory"),("open:origstory","origstory"),
                        ("open:comments","comments"),("open:privacy","privacy"),("open:developer","developer"),
                        ("open:save","save"),("open:scenes","scenes"),("open:achievements","achievements"),
                        ("open:leaderboard","leaderboard"),("open:events","events"),("open:help","help")]:
            pg.click(f'button[data-act="{act}"]'); pg.wait_for_selector(".fx-modal", timeout=8000)
            res[key]=pg.locator(".fx-modal").count()
            pg.click('.fx-modal-head button[data-act="modal:close"]'); pg.wait_for_timeout(120)
        # character story paging
        pg.click('button[data-act="open:charstory"]'); pg.wait_for_selector(".fx-modal")
        pg.click('button[data-act="charstory:next"]'); pg.wait_for_timeout(150)
        cp = "2/4" in pg.content()
        pg.click('.fx-modal-head button[data-act="modal:close"]')
        # developer verify
        pg.click('button[data-act="open:developer"]'); pg.wait_for_selector(".fx-modal")
        pg.fill('[data-field="devpass"]', "kurumi-fx"); pg.eval_on_selector('button[data-act="dev:verify"]', "el => el.click()"); pg.wait_for_timeout(250)
        dev_ok = "现金" in pg.content()
        pg.click('.fx-modal-head button[data-act="modal:close"]')
        # pixel toggle
        pg.click('button[data-act="pixel"]'); pg.wait_for_timeout(200)
        pix = pg.get_attribute("html","data-frontend")
        pg.screenshot(path="/tmp/fx-pixel.png", full_page=True)
        if pix!="pixel":
            pg.click('button[data-act="pixel"]'); pg.wait_for_timeout(150)
            pix = pg.get_attribute("html","data-frontend")
        print("DIALOGS:",res)
        print("STORY_PAGING:",cp,"DEV:",dev_ok,"PIXEL:",pix)
        print("ERRORS:",errs[:5])
        b.close()
if __name__=="__main__": main()
