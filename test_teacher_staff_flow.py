import time
import os
from playwright.sync_api import sync_playwright

def run_test():
    os.makedirs("test_screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Generate unique teacher email
        timestamp = int(time.time())
        teacher_name = f"Prof. Harish {timestamp % 1000}"
        teacher_email = f"harish_{timestamp}@lcc.edu"
        teacher_pass = "Staff@123"

        print(f"=== 1. ADMIN DESK: LOGIN & OPEN COMMAND CENTER ===")
        page.goto("http://127.0.0.1:5173/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Open Admin Desk via secret link or prompt
        page.evaluate("() => localStorage.setItem('lcc_admin_authenticated', 'true')")
        page.reload()
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Navigate to admin view
        page.locator("button:has-text('Admin Desk'), button:has-text('Admin'), a:has-text('Admin Desk')").first.click()
        time.sleep(1)

        # Click on Branch Staff & Command Center in desktop sidebar
        staff_tab = page.locator("aside button:has-text('Staff & Branch Command')")
        staff_tab.click()
        time.sleep(1)

        page.screenshot(path="test_screenshots/admin_1_command_center.png")
        print("PASS: Admin Command Center opened.")

        print(f"\n=== 2. ADMIN CREATES NEW TEACHER ({teacher_name}) ===")
        page.locator("button:has-text('Add New Teacher')").first.click()
        time.sleep(0.5)

        # Fill Add Teacher Form
        modal = page.locator(".fixed").filter(has_text="Create New Teacher Account")
        assert modal.is_visible(), "Add Teacher Modal must be visible"

        modal.locator("input[placeholder*='Ramesh Gupta']").fill(teacher_name)
        modal.locator("input[placeholder*='ramesh@lcc.edu']").fill(teacher_email)
        modal.locator("input[placeholder*='9876543210']").fill("9876543288")
        modal.locator("input[placeholder*='Physics & Mathematics']").fill("Senior Biology & NEET Faculty")
        modal.locator("button:has-text('Create Account')").click()
        page.locator(".fixed").filter(has_text="Create New Teacher Account").wait_for(state="hidden", timeout=15000)

        # Close Credentials Share Modal if open
        close_creds = page.locator("button:has-text('Done / Close')").first
        try:
            close_creds.wait_for(state="visible", timeout=5000)
            close_creds.click()
            time.sleep(0.5)
        except Exception:
            pass

        page.screenshot(path="test_screenshots/admin_2_teacher_created.png")
        print(f"PASS: Teacher '{teacher_name}' created successfully.")

        print(f"\n=== 3. ADMIN ASSIGNS TASK TO {teacher_name} ===")
        # Search for the teacher in the list
        search_input = page.locator("input[placeholder*='Search faculty']").first
        search_input.fill(teacher_name)
        time.sleep(0.5)

        # Click Assign Task button on the teacher row
        assign_btn = page.locator(f"tr:has-text('{teacher_name}') button:has-text('Assign Task')").first
        assign_btn.wait_for(state="visible", timeout=10000)
        assign_btn.click()
        time.sleep(0.5)

        # Fill Assign Task Modal
        task_modal = page.locator(".fixed").filter(has_text="Assign Task to Teacher")
        assert task_modal.is_visible(), "Assign Task Modal must be visible"

        task_title = "Complete Genetics Doubt Marathon & Mock Review"
        task_modal.locator("input[placeholder*='Quadratic Equations']").fill(task_title)
        task_modal.locator("textarea[placeholder*='Provide syllabus']").fill("Conduct 2-hour doubt session for Class 12 NEET aspirants and submit student attendance notes.")
        task_modal.locator("select").select_option("High")
        task_modal.locator("button:has-text('Assign Task')").click()
        page.locator(".fixed").filter(has_text="Assign Task to Teacher").wait_for(state="hidden", timeout=15000)

        page.screenshot(path="test_screenshots/admin_3_task_assigned.png")
        print(f"PASS: Task '{task_title}' assigned to {teacher_name}.")

        print(f"\n=== 4. TEACHER LOGS IN ({teacher_email}) ===")
        # Open Staff Portal
        page.evaluate("() => { localStorage.removeItem('lcc_admin_authenticated'); localStorage.removeItem('lcc_staff_session'); }")
        page.reload()
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Click Staff Portal in navbar or footer
        page.locator("button:has-text('Portal Login'), a:has-text('Portal Login')").first.click()
        time.sleep(0.5)

        # Switch to Staff tab in auth modal
        staff_tab_btn = page.locator("button:has-text('Teacher / Staff')").first
        if staff_tab_btn.is_visible():
            staff_tab_btn.click()
            time.sleep(0.3)

        auth_box = page.locator(".fixed").filter(has_text="L.C.C. Learning & Campus Portal")
        auth_box.locator("input[type='email']").fill(teacher_email)
        auth_box.locator("input[type='password']").fill(teacher_pass)
        auth_box.locator("button:has-text('SIGN IN AS TEACHER / STAFF')").click()
        time.sleep(2.5)

        page.screenshot(path="test_screenshots/teacher_1_logged_in.png")
        print(f"PASS: Teacher '{teacher_name}' logged in successfully to Staff Portal.")

        print(f"\n=== 5. TEACHER CHECKS ASSIGNED TASK & SUBMITS WORK REPORT ===")
        # Navigate to Tasks tab in StaffDashboard
        tasks_nav_btn = page.locator("button:has-text('Assigned Tasks')").first
        assert tasks_nav_btn.is_visible(), "Tasks tab must be visible in StaffDashboard"
        tasks_nav_btn.click()
        time.sleep(1.0)

        # Verify task is listed with Pending status
        task_card = page.locator(f"div:has-text('{task_title}')").first
        assert task_card.is_visible(), "Assigned task must be displayed on teacher dashboard"
        assert task_card.locator("text=Pending").first.is_visible(), "Task status must initially be Pending"
        print("PASS: Assigned task found with Pending status.")

        # Click Write & Submit Daily Report
        page.locator(f"div:has-text('{task_title}') button:has-text('Write & Submit Daily Report')").first.click()
        time.sleep(0.3)

        report_note = "Genetics doubt clinic completed for 32 students. High-yield concept mind maps shared on student vault."
        page.locator(f"div:has-text('{task_title}') textarea").first.fill(report_note)
        page.locator(f"div:has-text('{task_title}') button:has-text('Submit Report')").first.click()
        time.sleep(1.5)

        # Verify task is now marked Completed
        completed_badge = page.locator(f"div:has-text('{task_title}')").locator("text=Completed").first
        assert completed_badge.is_visible(), "Task must now show Completed status"
        assert page.locator(f"text={report_note[:30]}").first.is_visible(), "Submitted report note must be visible"
        page.screenshot(path="test_screenshots/teacher_2_report_submitted.png")
        print("PASS: Teacher work report successfully submitted and verified as Completed!")

        print(f"\n=== 6. ADMIN RE-VERIFIES TEACHER COMPLETED TASK & REPORT ===")
        # Switch back to Admin
        page.evaluate("() => { localStorage.setItem('lcc_admin_authenticated', 'true'); }")
        page.reload()
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        page.locator("button:has-text('Admin Desk'), button:has-text('Admin')").first.click()
        time.sleep(1)

        # Click on Branch Staff & Command Center in desktop sidebar
        staff_tab = page.locator("aside button:has-text('Staff & Branch Command')")
        staff_tab.click()
        time.sleep(1)

        # Search for teacher and open Dossier
        search_input = page.locator("input[placeholder*='Search faculty']").first
        search_input.fill(teacher_name)
        time.sleep(0.5)

        dossier_btn = page.locator(f"tr:has-text('{teacher_name}') button:has-text('Dossier')").first
        dossier_btn.click()
        time.sleep(0.8)

        # In Dossier, check Tasks tab
        dossier_modal = page.locator(".fixed").filter(has_text=teacher_name)
        assert dossier_modal.is_visible(), "Dossier modal must open"

        # Check task card in dossier
        dossier_task_card = dossier_modal.locator(f"div:has-text('{task_title}')").first
        assert dossier_task_card.is_visible(), "Completed task must be in teacher dossier"
        assert dossier_task_card.locator("text=Completed").first.is_visible(), "Task in dossier must show Completed"
        assert dossier_task_card.locator(f"text={report_note[:30]}").first.is_visible(), "Report note must be visible to Director in dossier"
        page.screenshot(path="test_screenshots/admin_4_verified_completed_dossier.png")
        print("PASS: Admin verified teacher's completed task with full work report note!")

        browser.close()
        print("\n=======================================================")
        print("ALL TEACHER/STAFF & ADMIN WORKFLOW TESTS PASSED (6/6)!")
        print("=======================================================")

if __name__ == "__main__":
    run_test()
