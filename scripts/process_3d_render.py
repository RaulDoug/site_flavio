import os
from PIL import Image
from rembg import remove

src_img = r"C:\Users\User\.gemini\antigravity\brain\16c53389-71a4-4608-aa6d-30ae6dd235cb\dental_veneer_upper_arch_frontal_1793023397764.jpg"
out_png = r"c:\Users\User\Desktop\Projetos\site_flavio\assets\images\faceta-lente-3d.png"

print(f"Loading {src_img}...")
inp = Image.open(src_img)

print("Removing black background with rembg...")
out = remove(inp)

# Crop transparent borders slightly
bbox = out.getbbox()
if bbox:
    pad = 16
    w, h = out.size
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad)
    )
    out = out.crop(crop_box)

out.save(out_png, "PNG")
print(f"Saved transparent full 3D arch to {out_png}")
print(f"Size: {out.size}, File size: {os.path.getsize(out_png) / 1024:.2f} KB")
