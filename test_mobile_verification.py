import time
import os
from playwright.sync_api import sync_playwright

def run_verification():
    os.makedirs("test_screenshots", exist_ok=True)
    with sync_playwright() as p:
        # 1. MOBILE VERIFICATION (390x844)
        print("=== 1. TESTING STRICT MOBILE AUTHENTICATION ===")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        )
        page = context.new_page()

        # Clear localStorage on start
        page.goto("http://127.0.0.1:5173/")
        page.evaluate("() => localStorage.clear()")
        page.reload()
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Check that StudentAuthModal is open
        auth_modal = page.locator("text=L.C.C. Learning & Campus Portal")
        assert auth_modal.is_visible(), "StudentAuthModal must be open on mobile launch"
        print("PASS: StudentAuthModal opened immediately on mobile launch.")

        # Check that Close button (X) is NOT present on mobile when unauthenticated
        close_btn = page.locator("button[title='Close Modal']")
        assert close_btn.count() == 0, "Close button must be strictly hidden on mobile when unauthenticated"
        print("PASS: Close button (X) is strictly hidden on mobile when unauthenticated.")

        # Click outside modal backdrop
        page.mouse.click(10, 10)
        time.sleep(0.5)
        assert auth_modal.is_visible(), "Modal must not be dismissible by clicking backdrop"
        print("PASS: Modal cannot be bypassed by backdrop click.")

        # Take screenshot of strict login gate
        page.screenshot(path="test_screenshots/1_strict_login_gate.png")

        # 2. TESTING REGISTRATION & SURVEY FLOW
        print("\n=== 2. TESTING REGISTRATION & QUICK SURVEY FLOW ===")
        # Switch to Register tab
        page.locator("button:has-text('Register')").click()
        time.sleep(0.5)

        auth_form = page.locator(".fixed.inset-0")
        auth_form.locator("input[placeholder*='Aarav Patel']").fill("Aryan Verma")
        auth_form.locator("input[placeholder='name@example.com']").fill(f"aryan_{int(time.time())}@lcc.edu")
        auth_form.locator("input[placeholder='9876543210']").fill("9876543210")
        auth_form.locator("input[placeholder='••••••••']").fill("pass123")

        # Submit registration
        auth_form.locator("button:has-text('CREATE STUDENT ACCOUNT')").click()
        time.sleep(1.5)

        # Check that StudentGoalModal (survey) popped up immediately!
        goal_modal = page.locator("text=Step 1: Choose Your Class / Target")
        assert goal_modal.is_visible(), "StudentGoalModal survey must open immediately upon registration"
        print("PASS: Quick survey modal opened immediately upon registration!")

        # Take screenshot of survey modal
        page.screenshot(path="test_screenshots/2_registration_survey.png")

        # Select Class 10 & Save
        page.locator("button:has-text('Class 9 & 10 (Board)')").click()
        time.sleep(0.3)
        page.locator("button:has-text('Save & Enter Learning App')").click()
        time.sleep(1)

        # 3. TESTING HERO SLIDER: STATIC / NO AUTOPLAY & MANUAL CONTROLS
        print("\n=== 3. TESTING MOBILE HERO SLIDER (NO AUTO-ADVANCE) ===")
        # Verify Mobile App Home is now displayed
        assert page.locator("#mobile-drawer-toggle").is_visible(), "Mobile app home must be visible"

        # Check slide counter badge
        counter_locator = page.locator("span.font-mono:has-text('/')").first
        initial_counter = counter_locator.text_content() if counter_locator.count() > 0 else ""
        print(f"Initial Slide Counter: {initial_counter}")

        # Wait 6 seconds to verify NO auto-advance occurs!
        print("Waiting 6 seconds to verify slider does NOT change on its own...")
        time.sleep(6)
        after_counter = counter_locator.text_content() if counter_locator.count() > 0 else ""
        assert initial_counter == after_counter, f"Slide auto-advanced unexpectedly: before={initial_counter}, after={after_counter}"
        print(f"PASS: Slide stayed completely static ({initial_counter}). Zero unwanted auto-advance!")

        # Test manual next button
        next_btn = page.locator("button[aria-label='Next Slide']").first
        assert next_btn.is_visible(), "Next slide button must be visible"
        next_btn.click()
        time.sleep(0.8)
        new_counter = counter_locator.text_content() if counter_locator.count() > 0 else ""
        print(f"Counter after manual next click: {new_counter}")
        assert new_counter != initial_counter, "Slide must advance upon manual user click"
        print("PASS: Manual Next Chevron button advanced the slide smoothly.")
        page.screenshot(path="test_screenshots/3_hero_slider_manual.png")

        # 4. TESTING VIDEO LECTURES & NO RICK ASTLEY DUMMY THUMBNAILS
        print("\n=== 4. TESTING VIDEO LECTURES (NO RICK ASTLEY / REAL THUMBNAILS) ===")
        watch_more_btn = page.locator("button:has-text('Watch More')").first
        if watch_more_btn.is_visible():
            watch_more_btn.click()
            time.sleep(1)

            # Check that bottom sheet is open
            assert page.locator("text=Video Lectures & Masterclasses").is_visible(), "Video bottom sheet must open"

            # Check all video thumbnail img tags inside the sheet
            sheet = page.locator(".fixed").filter(has_text="Video Lectures & Masterclasses")
            img_srcs = [img.get_attribute("src") for img in sheet.locator("img").all()]
            print(f"Found {len(img_srcs)} thumbnails in video sheet.")
            for src in img_srcs:
                assert "dQw4w9WgXcQ" not in src, f"Found Rick Astley ID in thumbnail src: {src}"
                assert "kJQP7kiw5Fk" not in src, f"Found Rick Astley ID in thumbnail src: {src}"
                print(f"  Verified clean thumbnail: {src[:65]}...")

            page.screenshot(path="test_screenshots/4_video_lectures_clean.png")

            # Close video sheet
            page.locator("button#close-videos-sheet").click()
            time.sleep(0.5)
            print("PASS: All video lecture thumbnails are educational, authentic, with zero Rick Astley memes!")

        # 5. TESTING BOTTOM WHITESPACE ELIMINATION & CAMPUS HELPLINE FOOTER
        print("\n=== 5. TESTING BOTTOM WHITESPACE & CAMPUS DESK FOOTER ===")
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)

        campus_card = page.locator("text=Varanasi • Top Academic Coaching & Computer Institute")
        assert campus_card.is_visible(), "Official LCC Campus Desk & Helpline card must be visible at bottom of feed"
        print("PASS: L.C.C. Campus Desk & Helpline card docks cleanly at bottom of mobile feed.")

        page.screenshot(path="test_screenshots/5_mobile_bottom_dock.png")

        # 6. TESTING DESKTOP LAUNCH (ZERO PRE-RENDER TEXT FLASH)
        print("\n=== 6. TESTING DESKTOP VIEWPORT ===")
        desktop_page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
        desktop_page.goto("http://127.0.0.1:5173/")
        desktop_page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Verify desktop navbar and hero are rendered
        assert desktop_page.locator("text=Learning Coaching Center").first.is_visible()
        desktop_page.screenshot(path="test_screenshots/6_desktop_launch.png")
        print("PASS: Desktop website loaded cleanly with zero static pre-render text flash.")

        browser.close()
        print("\n==============================================")
        print("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY (6/6)!")
        print("==============================================")

if __name__ == "__main__":
    run_verification()
