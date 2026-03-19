import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import os
import math

async def capture():
    print("[*] Initializing Chromium Engine...")
    os.makedirs("slides", exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1080, 'height': 1480}, device_scale_factor=2)
        
        print("[*] Navigating to local Vitapia.ai instance...")
        # In Next.js dev mode, HMR/websocket traffic can keep network "busy" forever.
        # Use DOM readiness as the hard gate, then try a best-effort idle wait.
        await page.goto('http://localhost:3000', wait_until='domcontentloaded', timeout=90000)
        try:
            await page.wait_for_load_state('networkidle', timeout=5000)
        except Exception:
            print("[*] Network did not become idle (expected in dev mode). Continuing...")
        
        print("[*] Waiting for React to hydrate and 3D Canvas to render...")
        try:
            # Explicitly wait for the main heading to ensure the page isn't blank
            await page.wait_for_selector('text=Synthetic Societies', timeout=15000)
        except Exception as e:
            print("[!] Failed to find main content. The site might be failing to render.")
            print(await page.content())
            await browser.close()
            return

        # Give Three.js extra time to compile shaders and render
        await page.wait_for_timeout(3000) 
        
        print("[*] Simulating human scroll to trigger all Framer Motion animations...")
        # Lenis and Framer Motion require actual scrolling to trigger 'whileInView' elements.
        # If we just jump to sections, the elements remain opacity: 0.
        # We will scroll down the entire page smoothly first.
        
        scroll_height = await page.evaluate("document.body.scrollHeight")
        viewport_height = 1080
        scroll_steps = math.ceil(scroll_height / 800)
        
        for _ in range(scroll_steps):
            await page.mouse.wheel(0, 800)
            await page.wait_for_timeout(600) # Let animations play out
            
        print("[*] Pre-scrolling complete. Jumping back to top...")
        # Disable Lenis temporarily to allow precise coordinate jumping
        await page.evaluate("""
            const html = document.documentElement;
            html.classList.remove('lenis', 'lenis-smooth');
            html.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
        """)
        await page.wait_for_timeout(2000)
        
        # Get exact pixel offsets for every section
        section_tops = await page.evaluate("""
            Array.from(document.querySelectorAll('section')).map(s => {
                const rect = s.getBoundingClientRect();
                return rect.top + window.scrollY;
            })
        """)
        
        if not section_tops or section_tops[0] > 100:
            section_tops.insert(0, 0)
            
        images = []
        
        for i, top in enumerate(section_tops):
            print(f"[*] Rendering Slide {i+1}/{len(section_tops)} (Offset: {top}px)...")
            
            # Jump exactly to the section top
            await page.evaluate(f"window.scrollTo(0, {top});")
            await page.wait_for_timeout(1000) # Wait for any lingering frame updates
            
            # Hide the Nav bar on slides after the first one to make it look like a real PowerPoint deck
            if i > 0:
                await page.evaluate("""
                    const nav = document.querySelector('nav');
                    if(nav) nav.style.opacity = '0';
                """)
            
            img_path = f"slides/slide_{i:02d}.png"
            await page.screenshot(path=img_path)
            images.append(img_path)
            
        await browser.close()
        
        print("\n[*] Compiling high-resolution screenshots into Pitch Deck PDF...")
        img_list = []
        for img_path in images:
            img = Image.open(img_path).convert('RGB')
            img_list.append(img)
            
        if img_list:
            pdf_path = "/Users/0xplayerone/.openclaw/workspace/vitapia_web/public/Vitapia_Pitch_Deck.pdf"
            img_list[0].save(
                pdf_path, 
                save_all=True, 
                append_images=img_list[1:],
                resolution=300.0
            )
            print(f"[*] SUCCESS: Pitch Deck compiled and saved to: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(capture())
