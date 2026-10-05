import time
import os
from playwright.sync_api import sync_playwright

def test_user_requirements():
    screenshot_dir = r"C:\Users\suppo\.gemini\antigravity\brain\d5b24d6d-5bb2-4b86-81b8-4245d2fa1c74"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport (Pixel 7 style: 393 x 851)
        context = browser.new_context(
            viewport={'width': 393, 'height': 851},
            user_agent="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        )
        page = context.new_page()

        print("--- TEST 1: Pure White Solid Login Screen on App Launch ---")
        page.goto("http://127.0.0.1:5173/")
        page.wait_for_selector("text=L.C.C. Learning & Campus Portal", timeout=10000)
        time.sleep(1)

        # Check modal backdrop classes
        backdrop = page.locator(".fixed.inset-0.z-50").first
        backdrop_class = backdrop.get_attribute("class") or ""
        print(f"Backdrop class: {backdrop_class}")
        assert "bg-white" in backdrop_class, f"Backdrop should be solid bg-white, got: {backdrop_class}"
        
        # Take screenshot of clean solid white login card
        shot1 = os.path.join(screenshot_dir, "verified_pure_white_login.png")
        page.screenshot(path=shot1)
        print(f"Saved: {shot1}")

        print("\n--- TEST 2: Student Login Flow ---")
        page.fill("input[type='email']", "aarav@example.com")
        page.fill("input[type='password']", "student123")
        page.click("#auth-submit-btn")
        
        # Wait for mobile app home to load with student greeting
        page.locator(".block.lg\\:hidden").locator("text=Hi, Aarav").wait_for(timeout=10000)
        time.sleep(2)
        print("Student successfully logged in!")

        print("\n--- TEST 3: Hero Slider - ONLY Admin Uploads ---")
        # Check slide titles or counter
        slide_counter = page.locator(".block.lg\\:hidden").locator("text=/").first.inner_text()
        print(f"Slide count: {slide_counter.encode('ascii', 'replace').decode('ascii')}")
        
        # Verify fake slides s2-s6 (Interactive Smart Classrooms, Debate Stage, etc.) are NOT present
        has_smart_classrooms = page.locator("text=Interactive Smart Classrooms").count()
        has_debate_stage = page.locator("text=Debate Stage & English Speaking").count()
        print(f"Interactive Smart Classrooms count: {has_smart_classrooms} (should be 0)")
        print(f"Debate Stage count: {has_debate_stage} (should be 0)")
        assert has_smart_classrooms == 0, "Fake slide Interactive Smart Classrooms should be removed"
        assert has_debate_stage == 0, "Fake slide Debate Stage should be removed"

        shot2 = os.path.join(screenshot_dir, "verified_hero_slider_admin_only.png")
        page.screenshot(path=shot2)
        print(f"Saved: {shot2}")

        print("\n--- TEST 4: Video Lectures Carousel & All Videos Sheet ---")
        # Carousel check
        page.locator("text=Video Lectures & Shorts").scroll_into_view_if_needed()
        time.sleep(1)

        # Look for admin video: "This That Detail explaination"
        admin_vid = page.locator("text=This That Detail explaination")
        assert admin_vid.count() > 0, "Admin video 'This That Detail explaination' must be visible"
        print("Admin video found in mobile carousel!")

        # Verify dummy videos are NOT in carousel
        has_trig = page.locator("text=Trigonometry Concepts & Board Proofs").count()
        has_chem = page.locator("text=Chemical Reactions & Equations in 1-Shot").count()
        print(f"Dummy Trigonometry count: {has_trig} (should be 0)")
        print(f"Dummy Chemical Reactions count: {has_chem} (should be 0)")
        assert has_trig == 0, "Dummy Trigonometry video must be removed"
        assert has_chem == 0, "Dummy Chemical Reactions video must be removed"

        # Open "Watch More" Video Lectures Sheet
        page.click("text=Watch More")
        time.sleep(1)
        page.wait_for_selector("text=Video Lectures & Masterclasses", timeout=5000)

        # Check in sheet
        sheet_admin_vid = page.locator("text=This That Detail explaination")
        assert sheet_admin_vid.count() > 0, "Admin video must be in all-videos sheet"
        sheet_dummy_trig = page.locator("text=Trigonometry Concepts & Board Proofs").count()
        assert sheet_dummy_trig == 0, "Dummy video must not be in all-videos sheet"
        print("Verified: In-app Video Sheet contains ONLY admin uploaded videos!")

        shot3 = os.path.join(screenshot_dir, "verified_video_lectures_admin_only.png")
        page.screenshot(path=shot3)
        print(f"Saved: {shot3}")

        # Close video sheet
        page.click("#close-videos-sheet")
        time.sleep(1)

        print("\n--- TEST 5: Live Support Chat & Auto-Destroy on Resolve ---")
        # Click "Ask Doubt" in the bottom dock
        ask_doubt_btn = page.locator("text=Ask Doubt").first
        ask_doubt_btn.click()
        time.sleep(1)

        # Verify Live Student Helpdesk opens
        page.wait_for_selector("text=L.C.C. Student Helpdesk", timeout=5000)
        print("Live Student Helpdesk modal opened successfully!")

        # Send a query
        chat_input = page.locator("#live-chat-input")
        chat_input.fill("Sir admission fees kitni hai?")
        page.click("#btn-send-chat")
        print("Sent student inquiry message.")

        # Wait for Counselor smart response
        time.sleep(2)
        response_found = page.locator("text=Admissions for Session 2026-27").count()
        print(f"Counselor response found: {response_found > 0}")
        assert response_found > 0, "Counselor response should be received"

        shot4 = os.path.join(screenshot_dir, "verified_live_support_chat_active.png")
        page.screenshot(path=shot4)
        print(f"Saved: {shot4}")

        # Click "Resolve" button
        print("Clicking Resolve button...")
        page.click("#btn-resolve-chat")
        time.sleep(0.5)

        # Check button state switched to "Resolved"
        btn_text = page.locator("#btn-resolve-chat").inner_text()
        print(f"Button text after click: {btn_text}")
        assert "RESOLVED" in btn_text.upper(), f"Button should contain Resolved, got: {btn_text}"
        print("Query marked as Resolved.")

        # Wait for auto-destroy & close delay (1.5s)
        time.sleep(2)

        # Verify chat modal closed automatically
        chat_modal_visible = page.locator("text=L.C.C. Student Helpdesk").is_visible()
        print(f"Chat modal visible after auto-destroy: {chat_modal_visible} (should be False)")
        assert not chat_modal_visible, "Chat modal must auto-close after resolution"

        # Re-open chat to verify session was completely destroyed & reset
        ask_doubt_btn.click()
        time.sleep(1)
        reopened_text = page.locator("#live-chat-input").input_value()
        has_old_query = page.locator("text=Sir admission fees kitni hai?").count()
        print(f"Old student query in reopened chat: {has_old_query} (should be 0)")
        assert has_old_query == 0, "Chat history must be destroyed/reset upon resolution"
        print("Verified: Chat session cleanly destroyed upon resolution with zero mention to user!")

        shot5 = os.path.join(screenshot_dir, "verified_chat_destroyed_clean_reset.png")
        page.screenshot(path=shot5)
        print(f"Saved: {shot5}")

        print("\nALL 5 USER REQUIREMENTS VERIFIED WITH 100% SUCCESS!")
        browser.close()

if __name__ == "__main__":
    test_user_requirements()
