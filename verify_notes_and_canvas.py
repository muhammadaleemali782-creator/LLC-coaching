import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\suppo\.gemini\antigravity\brain\d5b24d6d-5bb2-4b86-81b8-4245d2fa1c74"

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1. Test Mobile Viewport (iPhone 12 / Modern Phone standard 390x844)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
        )
        page = context.new_page()

        print("Navigating to http://localhost:5173/...", flush=True)
        page.goto("http://localhost:5173/", wait_until="domcontentloaded")
        time.sleep(1)

        # Set authenticated student session so MobileAppHome renders
        print("Setting active student session in localStorage...", flush=True)
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

        # Scroll to Study Notes section
        notes_header = page.locator("h3:has-text('Study Notes')")
        print("Found notes header count:", notes_header.count(), flush=True)
        assert notes_header.count() > 0, "Study Notes header should be present"
        notes_header.first.scroll_into_view_if_needed()
        time.sleep(1)

        # Check unique cards
        vocab_cards = page.locator("h4:has-text('Vocabulary List')")
        manners_cards = page.locator("h4:has-text('Good Manners')")
        
        vocab_count = vocab_cards.count()
        manners_count = manners_cards.count()
        print(f"Cards count -> Vocabulary List: {vocab_count}, Good Manners: {manners_count}", flush=True)

        # Capture mobile home screenshot showing strictly 2 cards without duplicate
        home_notes_shot = os.path.join(ARTIFACT_DIR, "verified_no_duplicate_notes_mobile.png")
        page.screenshot(path=home_notes_shot)
        print("Saved:", home_notes_shot, flush=True)

        assert vocab_count == 1, f"Expected exactly 1 Vocabulary List card, got {vocab_count}"
        assert manners_count == 1, f"Expected exactly 1 Good Manners card, got {manners_count}"
        print("[OK] DEDUPLICATION VERIFIED: Exactly 1 card each, ZERO duplicates!", flush=True)

        # 2. Click on "Good Manners" note card to open DocPreviewModal
        print("Opening Good Manners document preview...", flush=True)
        manners_cards.first.click()
        time.sleep(1.5)

        # Verify DocPreviewModal is visible
        modal_close = page.locator("#btn-close-doc-modal")
        assert modal_close.is_visible(), "Modal close button should be visible"

        # Check Digital Book view first
        digital_book_shot = os.path.join(ARTIFACT_DIR, "verified_digital_book_mobile.png")
        page.screenshot(path=digital_book_shot)
        print("Saved Digital Book shot:", digital_book_shot, flush=True)

        # Switch to Canvas View
        canvas_tab = page.locator("#tab-canvas-view")
        assert canvas_tab.is_visible(), "Canvas View tab button should be visible"
        canvas_tab.click()
        time.sleep(2)

        # Check canvas dimensions
        canvas = page.locator("canvas")
        assert canvas.is_visible(), "Canvas element should be visible"
        box = canvas.bounding_box()
        print(f"Canvas element bounding box: width={box['width']:.1f}px, height={box['height']:.1f}px", flush=True)
        aspect_ratio = box['height'] / box['width']
        print(f"Observed aspect ratio: {aspect_ratio:.3f} (target ~1.419)", flush=True)

        # Verify aspect ratio is preserved (1.35 to 1.48 is proper A4 proportion, NOT squished 3.4x!)
        assert 1.35 <= aspect_ratio <= 1.48, f"Canvas is squished! Aspect ratio was {aspect_ratio}"
        print("[OK] CANVAS ASPECT RATIO VERIFIED: Zero distortion!", flush=True)

        # Take screenshot of Page 1 in Canvas View
        canvas_p1_shot = os.path.join(ARTIFACT_DIR, "verified_canvas_manners_p1_mobile.png")
        page.screenshot(path=canvas_p1_shot)
        print("Saved Canvas Page 1 shot:", canvas_p1_shot, flush=True)

        # Click Next page button on canvas
        next_btn = page.locator("#btn-next-canvas-page")
        assert next_btn.is_visible(), "Next page button on canvas should be visible"
        next_btn.click()
        time.sleep(1)

        # Take screenshot of Page 2 in Canvas View
        canvas_p2_shot = os.path.join(ARTIFACT_DIR, "verified_canvas_manners_p2_mobile.png")
        page.screenshot(path=canvas_p2_shot)
        print("Saved Canvas Page 2 shot:", canvas_p2_shot, flush=True)

        # Close modal
        modal_close.click()
        time.sleep(1)

        # 3. Now open Vocabulary List note
        print("Opening Vocabulary List document preview...", flush=True)
        vocab_cards.first.click()
        time.sleep(1.5)

        # Switch to Canvas View
        canvas_tab = page.locator("#tab-canvas-view")
        canvas_tab.click()
        time.sleep(2)

        canvas_vocab_p1_shot = os.path.join(ARTIFACT_DIR, "verified_canvas_vocab_p1_mobile.png")
        page.screenshot(path=canvas_vocab_p1_shot)
        print("Saved Canvas Vocab Page 1 shot:", canvas_vocab_p1_shot, flush=True)

        # Next page
        page.locator("#btn-next-canvas-page").click()
        time.sleep(1)

        canvas_vocab_p2_shot = os.path.join(ARTIFACT_DIR, "verified_canvas_vocab_p2_mobile.png")
        page.screenshot(path=canvas_vocab_p2_shot)
        print("Saved Canvas Vocab Page 2 shot:", canvas_vocab_p2_shot, flush=True)

        # 4. Test Tablet Viewport (768 x 1024)
        tablet_page = browser.new_page(viewport={"width": 768, "height": 1024})
        tablet_page.goto("http://localhost:5173/", wait_until="domcontentloaded")
        tablet_page.evaluate("""
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
        tablet_page.reload(wait_until="domcontentloaded")
        time.sleep(2)

        # Open study notes on tablet
        tablet_page.locator("h4:has-text('Good Manners')").first.click()
        time.sleep(1.5)
        tablet_page.locator("#tab-canvas-view").click()
        time.sleep(2)

        canvas_tablet_shot = os.path.join(ARTIFACT_DIR, "verified_canvas_manners_tablet.png")
        tablet_page.screenshot(path=canvas_tablet_shot)
        print("Saved Canvas Tablet shot:", canvas_tablet_shot, flush=True)

        browser.close()
        print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    run_verification()
