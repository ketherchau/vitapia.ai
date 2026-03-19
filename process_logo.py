from PIL import Image
import os

def process_logo():
    print("[*] Processing logo for dark background seamless integration...")
    input_path = "/Users/0xplayerone/.openclaw/workspace/vitapia_web/public/logo-light.png"
    output_path = "/Users/0xplayerone/.openclaw/workspace/vitapia_web/public/logo-black.png"
    
    if not os.path.exists(input_path):
        print(f"[!] Input image not found: {input_path}")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # The website background is #0a0a0a (RGB: 10, 10, 10)
    # We will replace the pure black background of the generated image 
    # with a transparent or #0a0a0a background so the glow blends perfectly.
    for item in data:
        # If the pixel is pure black or very close to it (artifacting)
        if item[0] <= 5 and item[1] <= 5 and item[2] <= 5:
            # Replace with transparent or the exact site background
            new_data.append((10, 10, 10, 0)) # Transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"[*] Seamless logo variant saved to: {output_path}")

if __name__ == "__main__":
    process_logo()
