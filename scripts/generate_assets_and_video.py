#!/usr/bin/env python3
"""
Captures 4 high-resolution 1920x1080 screenshots of PayFlow-AI via headless Chrome
and synthesizes a 60-second 1080p MP4 walkthrough video (`demo.mp4`) with HUD banners.
"""

from __future__ import annotations

import http.server
import os
import shutil
import socketserver
import subprocess
import threading
import time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SCREENSHOTS = ROOT / "screenshots"
SCREENSHOTS.mkdir(exist_ok=True)

shutil.copy2(DOCS / "index.html", ROOT / "index.html")
shutil.copy2(DOCS / "app.js", ROOT / "app.js")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DOCS), **kwargs)

    def log_message(self, format, *args):
        pass


def capture_screenshot(port: int, tab: str, out_path: Path) -> None:
    url = f"http://127.0.0.1:{port}/index.html?tab={tab}"
    cmd = [
        "google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--window-size=1920,1080",
        f"--screenshot={out_path}",
        url,
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def annotate_slide(img_path: Path, title: str, subtitle: str, out_path: Path) -> None:
    base = Image.open(img_path).convert("RGBA").resize((1920, 1080))
    overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Bottom HUD banner
    draw.rounded_rectangle([(40, 945), (1880, 1055)], radius=16, fill=(6, 15, 32, 230), outline=(0, 168, 234, 220), width=2)
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((70, 962), title, fill=(56, 189, 248, 255), font=font_title)
    draw.text((70, 1004), subtitle, fill=(226, 232, 240, 255), font=font_sub)

    combined = Image.alpha_composite(base, overlay).convert("RGB")
    combined.save(out_path, quality=95)


def main() -> None:
    with socketserver.TCPServer(("127.0.0.1", 0), QuietHandler) as httpd:
        port = httpd.server_address[1]
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        time.sleep(0.4)

        tabs = [
            (
                "aggrid",
                SCREENSHOTS / "ag_grid_ledger.png",
                "1/4 • PayFlow-AI: AG Grid Enterprise PayPal Multi-Rail Ledger",
                "Real-time Orders v2, Payouts v1, Invoicing v2 & Disputes v1 with AI Risk Scoring & CSV Export",
            ),
            (
                "agent",
                SCREENSHOTS / "agentic_procurement.png",
                "2/4 • Autonomous MCP Procurement Negotiator & Dispute Auto-Defense",
                "Negotiates B2B vendor quotes, captures idempotent PayPal Orders v2 & submits SHA-256 Dispute evidence",
            ),
            (
                "bryntum",
                SCREENSHOTS / "bryntum_payout_timeline.png",
                "3/4 • Bryntum-Architecture Multi-Party Milestone & Payout Gantt Scheduler",
                "Links SLA telemetry checkpoints directly to automated /v1/payments/payouts batch splits",
            ),
            (
                "apimatic",
                SCREENSHOTS / "apimatic_sdk_studio.png",
                "4/4 • APIMatic DX Portal & Strongly-Typed PayPal SDK Generator",
                "Zero-hallucination Python, TypeScript & idempotent cURL codegen with OpenAPI 3.1 schema validation",
            ),
        ]

        slide_paths = []
        for idx, (tab, png_path, title, subtitle) in enumerate(tabs):
            capture_screenshot(port, tab, png_path)
            slide_out = SCREENSHOTS / f"_slide_{idx}.png"
            annotate_slide(png_path, title, subtitle, slide_out)
            slide_paths.append(slide_out)

        httpd.shutdown()

    # Build 60s 1080p MP4 video (15s per slide)
    concat_file = SCREENSHOTS / "concat.txt"
    with open(concat_file, "w") as f:
        for sp in slide_paths:
            f.write(f"file '{sp.resolve()}'\n")
            f.write("duration 15\n")
        f.write(f"file '{slide_paths[-1].resolve()}'\n")

    video_out = ROOT / "demo.mp4"
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_file),
        "-vf",
        "fps=30,format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        str(video_out),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for sp in slide_paths:
        sp.unlink(missing_ok=True)
    concat_file.unlink(missing_ok=True)
    print(f"Generated 4 screenshots and {video_out} ({video_out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
