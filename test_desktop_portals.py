import time
from playwright.sync_api import sync_playwright

def test_portals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)

        print("\n--- [TEST 1] Student Portal on Desktop ---")
        page.goto("http://127.0.0.1:5173", wait_until="networkidle")
        time.sleep(1)

        # Click Portal Login in Navbar
        portal_btn = page.locator('header button:has-text("Portal Login"), nav button:has-text("Portal Login")').first
        assert portal_btn.is_visible()
        portal_btn.click()
        time.sleep(0.5)

        modal = page.locator('div.fixed.inset-0.z-50')
        assert modal.is_visible()

        # Login as student
        modal.locator('button:has-text("Student")').first.click()
        modal.locator('input[type="email"]').first.fill("student@lcc.edu")
        modal.locator('input[type="password"]').first.fill("student123")
        modal.locator('button:has-text("SIGN IN TO STUDENT PORTAL")').first.click()
        time.sleep(1.5)

        page.screenshot(path='desktop_student_dashboard.png')
        print("  Student dashboard screenshot saved.")

        # Assert student dashboard elements
        assert page.locator('text=Welcome Back, Aarav Patel').first.is_visible() or page.locator('text=Aarav Patel').first.is_visible()
        print("  PASS: Student Dashboard loaded for Aarav Patel.")

        # Test Student Tabs on Desktop
        tabs = [
            ("Enrolled Batches", "desktop_student_batches.png"),
            ("DPPs & Notes", "desktop_student_notes.png"),
            ("Online Tests", "desktop_student_tests.png"),
            ("Attendance", "desktop_student_attendance.png"),
            ("Fee Receipts", "desktop_student_receipts.png")
        ]
        for tab_name, shot in tabs:
            tab_btn = page.locator(f'button:has-text("{tab_name}")').first
            if tab_btn.is_visible():
                tab_btn.click()
                time.sleep(0.4)
                page.screenshot(path=shot)
                print(f"  PASS: Clicked student tab: {tab_name}")

        # Logout student via Navbar
        logout_btn = page.locator('header button[title="Log Out"], nav button[title="Log Out"]').first
        if logout_btn.is_visible():
            logout_btn.click()
            time.sleep(0.8)
            print("  PASS: Student logged out via Navbar.")

        print("\n--- [TEST 2] Staff / Teacher Portal on Desktop ---")
        # Open Portal Login again
        page.locator('header button:has-text("Portal Login"), nav button:has-text("Portal Login")').first.click()
        time.sleep(0.5)

        modal = page.locator('div.fixed.inset-0.z-50')
        modal.locator('button:has-text("Teacher / Staff")').first.click()
        time.sleep(0.3)

        modal.locator('input[placeholder*="faculty@lcc.edu"]').first.fill("rajesh@lcc.edu")
        modal.locator('input[placeholder*="••••••••"]').first.fill("Staff@123")
        modal.locator('button:has-text("SIGN IN AS TEACHER / STAFF")').first.click()
        time.sleep(1.5)

        page.screenshot(path='desktop_staff_dashboard.png')
        print("  Staff dashboard screenshot saved.")

        # Assert staff dashboard elements
        assert page.locator('text=Rajesh Verma').first.is_visible()
        print("  PASS: Staff Dashboard loaded for Senior Faculty Rajesh Verma.")

        # Test Staff Tabs / Actions
        staff_sections = [
            ("1. My Daily Attendance", "desktop_staff_self_att.png"),
            ("2. Mark Student Attendance", "desktop_staff_student_att.png"),
            ("3. Assigned Tasks", "desktop_staff_tasks.png"),
            ("4. New Admission", "desktop_staff_admissions.png"),
            ("5. My Students Directory", "desktop_staff_directory.png")
        ]
        for sec_name, shot in staff_sections:
            sec_btn = page.locator(f'button:has-text("{sec_name}")').first
            if sec_btn.is_visible():
                sec_btn.click()
                time.sleep(0.4)
                page.screenshot(path=shot)
                print(f"  PASS: Clicked staff action: {sec_name}")

        # Logout staff via Navbar
        logout_staff_btn = page.locator('header button[title="Log Out Staff"], nav button[title="Log Out Staff"]').first
        if logout_staff_btn.is_visible():
            logout_staff_btn.click()
            time.sleep(0.8)
            print("  PASS: Staff logged out via Navbar.")

        print("\n--- [TEST 3] Admin / Director Portal on Desktop ---")
        # Open Admin login via footer or direct shortcut
        admin_link = page.locator('a:has-text("Staff & Faculty Portal"), a:has-text("Portal Login"), footer a:has-text("Director")').first
        # Or open Portal login -> Student tab -> admin credentials
        page.locator('header button:has-text("Portal Login"), nav button:has-text("Portal Login")').first.click()
        time.sleep(0.5)
        modal = page.locator('div.fixed.inset-0.z-50')
        modal.locator('button:has-text("Student")').first.click()
        modal.locator('input[type="email"]').first.fill("admin@lcc.edu")
        modal.locator('input[type="password"]').first.fill("AmanLCC@2026!")
        modal.locator('button:has-text("SIGN IN TO STUDENT PORTAL")').first.click()
        time.sleep(1.5)

        page.screenshot(path='desktop_admin_panel.png')
        print("  Admin panel screenshot saved.")
        assert page.locator('text=Admin Desk').first.is_visible() or page.locator('text=Director').first.is_visible()
        print("  PASS: Director Admin Panel verified.")

        print("\nConsole errors:")
        for err in console_errors:
            print(f"  {err}")

        browser.close()
        print("\nAll Desktop Portal Tests Completed Successfully!")

if __name__ == '__main__':
    test_portals()
