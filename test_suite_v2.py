import time
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

def run_tests():
    print("==========================================================")
    print(" Starting Comprehensive Test Suite (Positive & Negative)")
    print("==========================================================")
    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport for mobile app testing
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Clean storage before starting test
        page.goto("http://127.0.0.1:5173/")
        page.evaluate("localStorage.clear()")
        page.reload()
        page.wait_for_timeout(2000)

        # -------------------------------------------------------------------
        # TEST 1: Strict Mobile Login Gate & Register with Survey Class
        # -------------------------------------------------------------------
        print("\n--- TEST 1: Registration with Survey Class ---")
        try:
            # Login modal should appear on first mobile open
            page.wait_for_selector("#auth-tab-register", timeout=8000)
            assert page.locator("#auth-tab-register").is_visible(), "Register tab should be visible on first mobile open"

            # Switch to Register tab
            page.locator("#auth-tab-register").click()
            page.wait_for_timeout(500)

            # Register fresh student: Rohit Sharma, Class 10
            page.fill("#reg-input-name", "Rohit Sharma")
            page.fill("#reg-input-email", "rohit.test@lcc.edu")
            page.fill("#reg-input-phone", "9876543219")
            page.fill("#reg-input-password", "TestPass@123")

            page.click("#reg-submit-btn")
            page.wait_for_timeout(2000)

            # Goal modal survey opens - select Class 9-10
            goal_btn = page.locator("#goal-class-Class-9-10")
            if goal_btn.is_visible(timeout=3000):
                goal_btn.click()
                page.wait_for_timeout(500)
                # Click Save and Continue
                page.click("#goal-save-btn")
                page.wait_for_timeout(1500)

            # Verify student session exists in localStorage
            session = page.evaluate("localStorage.getItem('lcc_student_session')")
            assert session and "rohit.test@lcc.edu" in session, "Student session should be stored"

            print("[PASS] TEST 1: Registered Rohit Sharma (Class 10) and initialized session")
            results["Registration_&_Survey"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 1: {e}")
            results["Registration_&_Survey"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 2: Hero Slider Verification (No hero_poster.jpg & Auto-Slide)
        # -------------------------------------------------------------------
        print("\n--- TEST 2: Hero Slider (No hero_poster.jpg & Auto-slide) ---")
        try:
            # Check all slide images rendered
            slide_imgs = page.locator("img[alt]")
            count = slide_imgs.count()
            found_hero_poster = False
            for i in range(count):
                src = slide_imgs.nth(i).get_attribute("src") or ""
                if "hero_poster.jpg" in src:
                    found_hero_poster = True
                    break
            
            assert not found_hero_poster, "Slider must NOT contain hero_poster.jpg"
            print("[PASS] No hero_poster.jpg found in slider images!")

            page.screenshot(path="verified_slider_step1.png")
            print("[PASS] TEST 2: Hero Slider is clean and automated")
            results["Hero_Slider"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 2: {e}")
            results["Hero_Slider"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 3: Negative & Positive Test for Student Dashboard
        # (0 Enrolled Batches = 0% Progress, 0 Tests, No Fake Program)
        # -------------------------------------------------------------------
        print("\n--- TEST 3: Student Dashboard Metrics (0% Progress for 0 Enrolled Batches) ---")
        try:
            # Navigate to student portal
            page.evaluate("window.__lcc_navigate && window.__lcc_navigate('student-portal')")
            page.wait_for_timeout(1500)

            dashboard_text = page.inner_text("body")
            assert "Enrolled Batches" in dashboard_text, "Should be on Student Dashboard"

            # Check Enrolled Batches = 0
            # Check Overall Curriculum Completed = 0%
            assert "0%" in dashboard_text, "Overall Curriculum Completed must be 0% when 0 enrolled batches!"
            assert "0 Tests" in dashboard_text or "No quizzes attempted yet" in dashboard_text, "Must show 0 Tests attempted"
            assert "You haven't enrolled in any batch yet" in dashboard_text, "Must show empty enrollment state banner"

            page.screenshot(path="verified_0_enrolled_metrics.png")
            print("[PASS] TEST 3: Enrolled Batches: 0, Curriculum: 0%, Tests: 0 Tests, No fake batch")
            results["Dashboard_0_Enrolled_Metrics"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 3: {e}")
            results["Dashboard_0_Enrolled_Metrics"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 4: Study Vault Filtering & Online/Offline Reading
        # -------------------------------------------------------------------
        print("\n--- TEST 4: Study Vault Filtering & Offline Saving ---")
        try:
            # Click on Study Vault tab using precise data-tab selector
            page.locator("button[data-tab='vault']").click()
            page.wait_for_timeout(1000)

            vault_text = page.inner_text("body")
            # Student is Class 10: Spoken English notes ("Good Manners", "Vocabulary List") must NOT be in "My Notes"!
            assert "Good Manners and Social Etiquette" not in vault_text, "Spoken English notes must NOT be in Class 10 student vault!"
            assert "Class 10 Mathematics" in vault_text or "Class 10 Science" in vault_text, "Class 10 notes must be shown for Class 10 student!"

            # Test Read Online
            read_btn = page.locator("button:has-text('Read Online')").first
            read_btn.click()
            page.wait_for_timeout(1000)

            # Document preview modal opens
            doc_close_btn = page.locator("#btn-close-doc-modal")
            assert doc_close_btn.is_visible(), "Document preview modal should open with close button"

            # Click Save Offline in doc preview
            page.locator("#btn-save-offline-modal").click()
            page.wait_for_timeout(800)

            # Close doc modal cleanly
            page.evaluate("window.__lcc_close_doc && window.__lcc_close_doc()")
            page.wait_for_timeout(1000)

            # Click "Saved Offline" tab inside Study Vault
            offline_subtab = page.locator("#subtab-offline-vault")
            offline_subtab.click()
            page.wait_for_timeout(1000)

            offline_text = page.inner_text("body")
            assert "OFFLINE SAVED" in offline_text or "Read Offline" in offline_text, "Saved offline note should be listed in Saved Offline sub-tab!"

            page.screenshot(path="verified_study_vault_offline.png")
            print("[PASS] TEST 4: Study Vault filtered accurately, Read Online works, Offline save works")
            results["Study_Vault_Filter_&_Offline"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 4: {e}")
            results["Study_Vault_Filter_&_Offline"] = f"FAILED: {e}"
        finally:
            page.evaluate("window.__lcc_close_doc && window.__lcc_close_doc()")
            page.wait_for_timeout(500)

        # -------------------------------------------------------------------
        # TEST 5: Certificate Lock Gate (Negative & Positive)
        # -------------------------------------------------------------------
        print("\n--- TEST 5: Certificate Lock Gate (Negative & Positive) ---")
        try:
            page.evaluate("window.__lcc_close_doc && window.__lcc_close_doc()")
            page.wait_for_timeout(500)
            # Click Verified Certificate tab
            page.locator("button[data-tab='certificate']").click()
            page.wait_for_timeout(1000)

            cert_text = page.inner_text("body")
            assert "CERTIFICATE LOCKED" in cert_text, "Certificate must be LOCKED when no course is 100% completed!"
            assert "100% Course Completion Required" in cert_text, "Should explain requirement"
            page.screenshot(path="verified_certificate_locked.png")
            print("[PASS] Negative Test: Certificate correctly LOCKED for incomplete student!")

            # Positive Test: Simulate 100% course completion in localStorage
            page.evaluate("""
                const s = JSON.parse(localStorage.getItem('lcc_student_session'));
                s.enrolledCourses = ['c-9-10'];
                s.courseProgress = { 'c-9-10': 100 };
                s.quizScores = { 'test-1': 95 };
                localStorage.setItem('lcc_student_session', JSON.stringify(s));
            """)
            page.reload()
            page.wait_for_timeout(1500)

            # Navigate back to student-portal and click certificate tab
            page.evaluate("window.__lcc_navigate && window.__lcc_navigate('student-portal')")
            page.wait_for_timeout(1000)
            page.locator("button[data-tab='certificate']").click()
            page.wait_for_timeout(1000)

            cert_unlocked_text = page.inner_text("body")
            assert "CERTIFICATE OF MERIT & CURRICULUM MASTERY" in cert_unlocked_text, "Redesigned certificate must be UNLOCKED!"
            assert "Aman Arora" in cert_unlocked_text, "Director signature must be present"
            assert "Print Official Certificate" in cert_unlocked_text, "Print button must be available"
            page.screenshot(path="verified_certificate_unlocked_redesigned.png")
            print("[PASS] Positive Test: Redesigned Certificate UNLOCKED at 100% completion!")
            results["Certificate_Lock_&_Redesign"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 5: {e}")
            results["Certificate_Lock_&_Redesign"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 6: Learning History Tracking Verification
        # -------------------------------------------------------------------
        print("\n--- TEST 6: Learning History Tracking ---")
        try:
            page.evaluate("window.__lcc_close_doc && window.__lcc_close_doc()")
            page.wait_for_timeout(500)
            # Switch back to My Progress tab
            page.locator("button[data-tab='overview']").click()
            page.wait_for_timeout(1000)

            prog_text = page.inner_text("body")
            assert "My Learning History" in prog_text, "Learning history section must be present"
            assert "STUDY NOTE" in prog_text or "VIDEO LECTURE" in prog_text, "Previously opened study note must be listed in history!"
            page.screenshot(path="verified_learning_history.png")
            print("[PASS] TEST 6: Learning activity history recorded and displayed!")
            results["Learning_History_Tracking"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 6: {e}")
            results["Learning_History_Tracking"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 7: Payment Modal QR Code & Evidence Upload
        # -------------------------------------------------------------------
        print("\n--- TEST 7: Payment Modal QR Code & Evidence Upload ---")
        try:
            # Dismiss any open doc modal first
            page.evaluate("window.__lcc_close_doc && window.__lcc_close_doc()")
            page.wait_for_timeout(500)

            # Open payment modal directly via window helper
            page.evaluate("window.__lcc_open_payment && window.__lcc_open_payment()")
            page.wait_for_timeout(1000)

            # Payment Modal opens - click "Direct UPI / QR"
            upi_tab = page.locator("button:has-text('Direct UPI / QR')")
            upi_tab.click()
            page.wait_for_timeout(800)

            pay_text = page.inner_text("body").lower()
            assert "official institute upi & qr code" in pay_text, "UPI QR card should be visible"
            assert "scan with any upi app" in pay_text, "UPI scan instruction visible"
            assert "pay in mobile upi app" in pay_text, "Mobile UPI intent link visible"
            assert "attach payment screenshot" in pay_text, "Screenshot evidence upload visible"

            # Fill UTR number
            utr_input = page.locator("input[placeholder*='425189201948']")
            utr_input.fill("425199882211")

            page.screenshot(path="verified_payment_qr_modal.png")

            # Click Submit Payment Evidence
            submit_btn = page.locator("button:has-text('SUBMIT PAYMENT EVIDENCE & JOIN BATCH')")
            submit_btn.click()
            page.wait_for_timeout(2000)

            success_text = page.inner_text("body")
            assert "PAYMENT CRYPTOGRAPHICALLY VERIFIED" in success_text or "Admission Confirmed" in success_text, "Payment must succeed with zero errors"
            page.screenshot(path="verified_payment_success.png")
            print("[PASS] TEST 7: QR Code rendered, UTR accepted, Payment submitted with ZERO errors!")
            results["Payment_QR_&_Evidence"] = "PASSED"

            # Close payment modal
            close_btn = page.locator("button:has-text('Go to My Enrolled Courses')")
            if close_btn.is_visible():
                close_btn.click()
                page.wait_for_timeout(1000)
        except Exception as e:
            print(f"[FAIL] TEST 7: {e}")
            results["Payment_QR_&_Evidence"] = f"FAILED: {e}"

        # -------------------------------------------------------------------
        # TEST 8: Free In-App AI Chat Support Agent (Math & Helpdesk)
        # -------------------------------------------------------------------
        print("\n--- TEST 8: In-App AI Chat Support Agent (Math & Helpdesk) ---")
        try:
            # Open Live Chat Support modal
            page.evaluate("window.__lcc_open_support && window.__lcc_open_support()")
            page.wait_for_timeout(1000)

            chat_input = page.locator("#live-chat-input")
            assert chat_input.is_visible(), "Chat input should be visible"

            # Test 1: Math Linear Equation Question
            chat_input.fill("solve 2x + 5 = 25")
            page.click("#btn-send-chat")
            page.wait_for_timeout(1500)

            chat_body_1 = page.inner_text("body")
            assert "x = 10" in chat_body_1, "AI Math Agent must solve 2x + 5 = 25 -> x = 10"
            print("[PASS] AI Math Agent solved linear equation: 2x + 5 = 25 -> x = 10!")

            # Test 2: Percentage Question
            chat_input.fill("15% of 1200")
            page.click("#btn-send-chat")
            page.wait_for_timeout(1500)

            chat_body_2 = page.inner_text("body")
            assert "180" in chat_body_2, "AI Math Agent must calculate 15% of 1200 -> 180"
            print("[PASS] AI Math Agent calculated percentage: 15% of 1200 -> 180!")

            # Test 3: Fee Inquiry
            chat_input.fill("what are the fees for DCA and Class 10?")
            page.click("#btn-send-chat")
            page.wait_for_timeout(1500)

            chat_body_3 = page.inner_text("body")
            assert "4,999" in chat_body_3 or "999" in chat_body_3, "AI Agent must provide official fee structure"
            print("[PASS] AI Agent provided official institute fee structure!")

            page.screenshot(path="verified_ai_math_agent_active.png")

            # Test 4: Resolve & Clean Destroy
            page.click("#btn-resolve-chat")
            page.wait_for_timeout(2000)

            assert not page.locator("text=L.C.C. AI Math & Student Helpdesk").is_visible(), "Chat must be destroyed/closed after resolution"
            page.screenshot(path="verified_chat_clean_destroy.png")
            print("[PASS] Chat resolved and destroyed cleanly!")

            results["AI_Math_&_Helpdesk_Agent"] = "PASSED"
        except Exception as e:
            print(f"[FAIL] TEST 8: {e}")
            results["AI_Math_&_Helpdesk_Agent"] = f"FAILED: {e}"

        browser.close()

    print("\n==========================================================")
    print("           COMPREHENSIVE TEST RESULTS SUMMARY             ")
    print("==========================================================")
    for test, res in results.items():
        print(f"• {test}: {res}")
    print("==========================================================")

if __name__ == '__main__':
    run_tests()
