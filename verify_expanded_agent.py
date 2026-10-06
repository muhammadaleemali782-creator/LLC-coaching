import os
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\suppo\.gemini\antigravity\brain\d5b24d6d-5bb2-4b86-81b8-4245d2fa1c74"

def test_expanded_capabilities():
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
                goal: 'Spoken English & Math Master',
                subjects: ['Spoken English & Moral Values', 'Mathematics'],
                enrolledCourses: []
            }));
        """)
        page.reload(wait_until="domcontentloaded")
        time.sleep(2)

        # Open Live Support Chat
        print("Opening Live Support Chat...", flush=True)
        page.evaluate("window.__lcc_open_support()")
        time.sleep(1.5)

        queries = [
            # 1. Spoken English Translation
            ("pani pina hai english me kya bolte hai", "water", "Daily Spoken English Translation"),
            # 2. Grammar: Present Continuous / Tenses
            ("present continuous tense formula", "is/am/are", "Grammar Tense Formula"),
            # 3. Math: Dynamic Table
            ("table of 19", "19 × 10", "Dynamic Multiplication Table"),
            # 4. Math: LCM & HCF
            ("lcm of 24 and 36", "72", "Dynamic LCM Calculator"),
            # 5. Math: Prime check
            ("is 97 prime", "prime", "Prime Number Verification"),
            # 6. Math: Linear Equation
            ("solve 3x + 12 = 48", "x = 12", "Linear Equation Solver"),
            # 7. Math: BigInt BODMAS
            ("23833827272+3838-272727272*733873", "-200,123,347,453,346", "BigInt Multi-step BODMAS")
        ]

        input_box = page.locator("input[placeholder*='question or doubt']")
        assert input_box.is_visible(), "Chat input box should be visible"

        for query, expected_snippet, label in queries:
            print(f"\n--- Testing [{label}]: '{query}' ---", flush=True)
            input_box.fill(query)
            page.keyboard.press("Enter")
            time.sleep(2.5)

            # Check if expected snippet appears in chat messages
            body_text = page.locator("div.space-y-3").last.text_content() or ""
            if expected_snippet.lower() in body_text.lower():
                print(f"[PASS] {label} verified! Snippet found: {expected_snippet}", flush=True)
            else:
                print(f"[FAIL] {label} failed! Snippet '{expected_snippet}' not found. Body text was:\n{body_text}\n", flush=True)
                raise AssertionError(f"Failed on query: {query}")

        # Capture final screenshot
        screenshot_path = os.path.join(ARTIFACT_DIR, "verified_expanded_ai_agent.png")
        page.screenshot(path=screenshot_path)
        print(f"\nSaved screenshot to: {screenshot_path}", flush=True)

        browser.close()
        print("\nALL EXPANDED AGENT TESTS PASSED WITH 100% SUCCESS!", flush=True)

if __name__ == "__main__":
    test_expanded_capabilities()
