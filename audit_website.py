import time
from playwright.sync_api import sync_playwright

def audit_website():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop viewport 1440x900
        context = browser.new_context(
            viewport={'width': 1440, 'height': 900},
            device_scale_factor=1
        )
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)

        print("\n[TEST 1] Loading Desktop Website at 1440x900...")
        page.goto("http://127.0.0.1:5173", wait_until="networkidle")
        time.sleep(1)

        # On initial load, does student auth modal show up if not dismissed?
        # Check if auth modal is visible on launch and if it can be closed on desktop
        auth_modal = page.locator('div.fixed.inset-0.z-50')
        if auth_modal.is_visible():
            print("  Auth Modal popped on launch. Capturing screenshot...")
            page.screenshot(path='web_1_auth_modal.png')
            # Close it to view full website home
            close_btn = auth_modal.locator('button[title*="Close"], button:has(svg.lucide-x)').first
            if close_btn.is_visible():
                close_btn.click()
                time.sleep(0.5)
                print("  Auth modal closed.")

        page.screenshot(path='web_1_desktop_home_hero.png')
        print("  PASS: Desktop Home Hero loaded.")

        # Check horizontal overflow
        overflow = page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print(f"  Horizontal overflow detected: {overflow}")

        # Check Navbar elements
        navbar = page.locator('header, nav').first
        print(f"  Navbar visible: {navbar.is_visible()}")

        # Test Theme switcher if present
        theme_btn = page.locator('button[title*="Theme"], button[aria-label*="Theme"], button:has-text("Theme")').first
        if theme_btn.is_visible():
            print("  Theme switcher button found.")
            theme_btn.click()
            time.sleep(0.5)
            page.screenshot(path='web_theme_menu.png')

        # Scroll and audit each section
        sections = [
            ("Features / Why Us", 600, 'web_2_features.png'),
            ("Courses / Batches", 1200, 'web_3_courses.png'),
            ("Director & Faculty", 2000, 'web_4_faculty.png'),
            ("YouTube & Media", 2800, 'web_5_media.png'),
            ("Admissions & Inquiries", 3600, 'web_6_admissions.png'),
            ("Footer & Contact", 4500, 'web_7_footer.png')
        ]

        for name, scroll_y, shot in sections:
            page.evaluate(f"window.scrollTo(0, {scroll_y})")
            time.sleep(0.6)
            page.screenshot(path=shot)
            print(f"  Captured {name} at Y={scroll_y}")

        # Check Student Portal on Desktop
        print("\n[TEST 2] Student Portal Flow on Desktop...")
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(0.5)

        # Open Student Portal modal via Navbar button
        portal_btn = page.locator('header button:has-text("Student Portal"), nav button:has-text("Student Portal"), header button:has-text("Portal")').first
        if portal_btn.is_visible():
            portal_btn.click()
            time.sleep(0.5)
            page.screenshot(path='web_8_portal_modal_opened.png')

            # Login as demo student or register
            modal = page.locator('div.fixed.inset-0.z-50')
            # Let's check tab
            modal.locator('button:has-text("Student")').first.click()
            time.sleep(0.3)
            # Use test account
            email_in = modal.locator('input[type="email"]').first
            pass_in = modal.locator('input[type="password"]').first
            email_in.fill("student.test@lcc.edu")
            pass_in.fill("student123")
            modal.locator('button:has-text("SIGN IN TO STUDENT PORTAL")').first.click()
            time.sleep(1)
            page.screenshot(path='web_9_student_dashboard_desktop.png')

        # Check Staff Portal on Desktop
        print("\n[TEST 3] Staff Portal Flow on Desktop...")
        # Direct URL or navigate to staff-portal
        page.goto("http://127.0.0.1:5173#staff-portal")
        time.sleep(1)
        page.screenshot(path='web_10_staff_portal_desktop.png')

        # Check Admin Portal on Desktop
        print("\n[TEST 4] Admin Portal Flow on Desktop...")
        page.goto("http://127.0.0.1:5173#admin-portal")
        time.sleep(1)
        page.screenshot(path='web_11_admin_portal_desktop.png')

        print("\nConsole warnings/errors during audit:")
        for err in console_errors[:10]:
            print(f"  {err}")

        browser.close()
        print("\nAudit complete! Check screenshots.")

if __name__ == '__main__':
    audit_website()
