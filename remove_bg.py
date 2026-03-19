from PIL import Image
import os

def remove_black_background(input_path, output_path, noise_threshold=15):
    print(f"[*] Processing {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    # This algorithm un-premultiplies the black background to extract the true 
    # emissive color and its alpha transparency (preserving the soft neon glow perfectly).
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # The alpha is based on the brightest channel
            max_val = max(r, g, b)
            
            if max_val < noise_threshold:
                # Kills JPEG compression noise in the deep black
                pixels[x, y] = (0, 0, 0, 0)
            else:
                # Calculate new alpha (scaling to remove the noise floor smoothly)
                alpha = int(max(0, max_val - noise_threshold) * 255.0 / (255 - noise_threshold))
                
                if alpha == 0:
                    pixels[x, y] = (0, 0, 0, 0)
                else:
                    # Un-premultiply the RGB values to get the true neon color
                    # (C = F * alpha => F = C / alpha)
                    new_r = min(255, int((r * 255) / max_val))
                    new_g = min(255, int((g * 255) / max_val))
                    new_b = min(255, int((b * 255) / max_val))
                    pixels[x, y] = (new_r, new_g, new_b, alpha)

    img.save(output_path, "PNG")
    print(f"[*] Transparent neon logo saved to {output_path}")

if __name__ == "__main__":
    input_img = "/Users/0xplayerone/.openclaw/media/inbound/file_17---2ada089c-c879-49c8-bf2f-cb15b94b8f75.jpg"
    output_img = "/Users/0xplayerone/.openclaw/workspace/vitapia_web/public/logo-transparent.png"
    
    if not os.path.exists(input_img):
        print("[!] Cannot find the input image!")
    else:
        remove_black_background(input_img, output_img)
