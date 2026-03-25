import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import os
import math

async def capture():
    print("[*] Initializing Chromium Engine...")
    os.makedirs("slides", exist_ok=True)

    version = "v1"
    
    async with async_playwright() as p:
       
        images = []

        for i in range(1, 10):
            img_path = f"slides/{i}.png"
            images.append(img_path)
            
        print("\n[*] Compiling high-resolution screenshots into Pitch Deck PDF...")
        img_list = []
        for img_path in images:
            img = Image.open(img_path).convert('RGB')
            img_list.append(img)
            
        if img_list:
            pdf_path = f"/Users/0xplayerone/.openclaw/workspace/vitapia_web/public/Vitapia_Pitch_Deck_{version}.pdf"
            img_list[0].save(
                pdf_path, 
                save_all=True, 
                append_images=img_list[1:],
                resolution=300.0
            )
            print(f"[*] SUCCESS: Pitch Deck compiled and saved to: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(capture())
