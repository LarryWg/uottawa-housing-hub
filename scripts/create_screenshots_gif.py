#!/usr/bin/env python3
"""
Create a GIF from README screenshots.
Downloads images from GitHub user-attachments and combines them into a single GIF.
Requires: pip install pillow requests
"""

import io
import sys
from pathlib import Path

try:
    import requests
    from PIL import Image
except ImportError:
    print("Please install dependencies: pip install pillow requests")
    sys.exit(1)

# Image URLs from README (GitHub user-attachments)
IMAGE_URLS = [
    "https://github.com/user-attachments/assets/e214b70d-73a4-4e8b-9900-7c25b9539e56",  # Sign in
    "https://github.com/user-attachments/assets/eb082fd9-51f4-4b7a-aeff-ad2b57c95c02",  # Profiles
    "https://github.com/user-attachments/assets/baf370b7-3bcb-40cf-86fd-f387b8c68d11",  # 2FA
    "https://github.com/user-attachments/assets/ee2e7998-868a-4b90-a581-965ba64ddc4d",  # Home
    "https://github.com/user-attachments/assets/320903af-8e29-45d6-8cea-4e0c7ed4a565",  # Roommate
    "https://github.com/user-attachments/assets/146bc88d-fe0d-42ce-a8a6-49ce15ab3fff",  # Map
    "https://github.com/user-attachments/assets/de164cb1-9099-4ec6-8cf9-f4a9b5f8dd7e",  # Lease checker
    "https://github.com/user-attachments/assets/394e6247-caca-4da7-b4c8-ad6c9421668b",  # Filters
    "https://github.com/user-attachments/assets/3cbe9b4a-e2d2-4748-a8b1-dcb111345131",  # Resources 1
    "https://github.com/user-attachments/assets/8fdeadae-5f2d-4c76-867c-94220b871424",  # Resources 2
    "https://github.com/user-attachments/assets/5456fa6c-b893-4a49-902b-730fcb1a5c2d",  # Resources 3
]

MAX_WIDTH = 800  # Resize to keep GIF file size reasonable
DURATION = 2000  # ms per frame
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "docs" / "screenshots.gif"


def download_image(url: str) -> Image.Image:
    """Download image from URL and return as PIL Image."""
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    img = Image.open(io.BytesIO(resp.content))
    if img.mode in ("RGBA", "P"):
        return img.convert("RGB")
    return img


def resize_for_gif(img: Image.Image) -> Image.Image:
    """Resize image to max width while preserving aspect ratio."""
    if img.width <= MAX_WIDTH:
        return img
    ratio = MAX_WIDTH / img.width
    new_size = (MAX_WIDTH, int(img.height * ratio))
    return img.resize(new_size, Image.Resampling.LANCZOS)


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    frames = []
    for i, url in enumerate(IMAGE_URLS):
        print(f"Downloading image {i + 1}/{len(IMAGE_URLS)}...")
        try:
            img = download_image(url)
        except Exception as e:
            print(f"  Error: {e}")
            continue
        img = resize_for_gif(img)
        frames.append(img)

    if not frames:
        print("No images downloaded. Exiting.")
        sys.exit(1)

    print(f"Creating GIF with {len(frames)} frames...")
    frames[0].save(
        OUTPUT_PATH,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION,
        loop=0,
        optimize=True,
    )

    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Done! Saved to {OUTPUT_PATH} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
