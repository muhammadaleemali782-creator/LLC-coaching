import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\suppo\.gemini\antigravity\brain\d5b24d6d-5bb2-4b86-81b8-4245d2fa1c74"

def verify_chat_math():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
        )
        page = context.new_page()

        print("Navigating to http://localhost:5173/...", flush=True)
        page.goto("http://localhost:5173/", wait_until="domcontentloaded")
        page.evaluate("""
            localStorage.setItem('lcc_student_session', JSON.stringify({
                id: 'std-test-user',
                name: 'Student User',
                email: 'student@lcc.com',
                phone: '9876543210',
                goal: 'Spoken English',
                subjects: ['Spoken English & Moral Values', 'English Fluency'],
                enrolledCourses: []
            }));
        """)
        page.reload(wait_until="domcontentloaded")
        time.sleep(2)

        # Open Live Support Chat
        print("Opening Live Support Chat...", flush=True)
        page.evaluate("window.__lcc_open_support()")
        time.sleep(1.5)

        # Send first user query with multiplication symbol ×
        q1 = "23833827272+3838-272727272×733873"
        print(f"Sending Query 1: {q1}", flush=True)
        input_box = page.locator("input[placeholder*='question or doubt']")
        assert input_box.is_visible(), "Chat input box should be visible"
        input_box.fill(q1)
        page.keyboard.press("Enter")
        time.sleep(2)

        # Verify answer is in messages
        chat_body = page.locator("text=-200,123,347,453,346")
        assert chat_body.count() > 0, f"Query 1 answer not found in chat! Chat text: {page.locator('.overflow-y-auto').text_content()}"
        print("[PASS] Query 1 solved accurately! Answer: -200,123,347,453,346", flush=True)

        # Send second user query with trailing text
        q2 = "23833827272+3838-272727272×733873 please solve this math question"
        print(f"Sending Query 2: {q2}", flush=True)
        input_box.fill(q2)
        page.keyboard.press("Enter")
        time.sleep(2)

        # Check answers count
        assert chat_body.count() >= 2, f"Query 2 answer not found in chat! Count: {chat_body.count()}"
        print("[PASS] Query 2 solved accurately! Answer: -200,123,347,453,346", flush=True)

        # Capture screenshot
        screenshot_path = os.path.join(ARTIFACT_DIR, "verified_chat_math_solved.png")
        page.screenshot(path=screenshot_path)
        print(f"Saved screenshot: {screenshot_path}", flush=True)

        browser.close()
        print("ALL CHAT MATH TESTS PASSED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    verify_chat_math()
