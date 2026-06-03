import fitz  # PyMuPDF
import os

pdf_path = "logo rosa may.pdf"
output_path = "public/logo_rosa_may.png"

print(f"Opening {pdf_path}...")
doc = fitz.open(pdf_path)
page = doc.load_page(0)

# Render page to a pixmap (use Matrix for high resolution zoom)
zoom = 4  # 4x zoom for high quality image
mat = fitz.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat)

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Saving to {output_path}...")
pix.save(output_path)
print("Conversion successful!")
