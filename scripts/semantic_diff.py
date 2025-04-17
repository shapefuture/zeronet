from PIL import Image, ImageChops

def semantic_diff(baseline_image_path, current_image_path):
    baseline = Image.open(baseline_image_path)
    current = Image.open(current_image_path)
    diff = ImageChops.difference(baseline, current)
    bbox = diff.getbbox()
    return {"semantic_change": "Difference detected" if bbox else "No visible semantic difference"}