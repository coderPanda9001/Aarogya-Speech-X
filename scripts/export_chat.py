"""
Chat Transcript Exporter for Antigravity IDE
---------------------------------------------
Parses the local system transcript JSONL log files and exports
the full conversation history into clean Markdown & HTML documents.
"""

import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

LOG_PATH = r"C:\Users\nikhi\.gemini\antigravity-ide\brain\84477fe0-99cb-43d2-92a7-8572f84e0662\.system_generated\logs\transcript_full.jsonl"
FALLBACK_LOG_PATH = r"C:\Users\nikhi\.gemini\antigravity-ide\brain\84477fe0-99cb-43d2-92a7-8572f84e0662\.system_generated\logs\transcript.jsonl"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OUTPUT_MD_PATH = os.path.join(PROJECT_ROOT, "AAROGYASPEECH_CHAT_EXPORT.md")
OUTPUT_HTML_PATH = os.path.join(PROJECT_ROOT, "AAROGYASPEECH_CHAT_EXPORT.html")

def clean_text(text):
    if not text:
        return ""
    # Strip internal prompt wrapper tags if present
    text = re.sub(r'<USER_REQUEST>\s*', '', text)
    text = re.sub(r'\s*</USER_REQUEST>', '', text)
    text = re.sub(r'<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>', '', text, flags=re.DOTALL)
    text = re.sub(r'<SYSTEM_MESSAGE>.*?</SYSTEM_MESSAGE>', '', text, flags=re.DOTALL)
    return text.strip()

def export_transcript():
    target_log = LOG_PATH if os.path.exists(LOG_PATH) else FALLBACK_LOG_PATH
    if not os.path.exists(target_log):
        print(f"[!] Log file not found at: {target_log}")
        return

    print(f"[+] Reading transcript from: {target_log}")
    
    entries = []
    with open(target_log, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                step_type = data.get("type", "")
                content = data.get("content", "")
                
                # Check for user input
                if step_type == "USER_INPUT":
                    cleaned = clean_text(content)
                    if cleaned:
                        entries.append({"role": "User", "text": cleaned})
                
                # Check for planner response (model output)
                elif step_type == "PLANNER_RESPONSE":
                    if isinstance(content, str):
                        cleaned = clean_text(content)
                        if cleaned:
                            entries.append({"role": "Antigravity AI Assistant", "text": cleaned})
                    elif isinstance(content, dict):
                        # Extract thoughts / response text
                        text_val = content.get("text", "") or content.get("thought", "")
                        cleaned = clean_text(text_val)
                        if cleaned:
                            entries.append({"role": "Antigravity AI Assistant", "text": cleaned})
            except Exception:
                continue

    # Deduplicate consecutive identical messages
    unique_entries = []
    for entry in entries:
        if not unique_entries or unique_entries[-1]["text"] != entry["text"]:
            unique_entries.append(entry)

    # 1. Generate Markdown Export
    md_output = ["# AarogyaSpeech AI - Complete Conversation Transcript Export\n"]
    md_output.append(f"_Exported on: 2026-10-07 | Total Exchanges: {len(unique_entries)}_\n\n---\n")

    for idx, item in enumerate(unique_entries, start=1):
        role_emoji = "👤" if item["role"] == "User" else "🤖"
        md_output.append(f"### {role_emoji} {item['role']} (Message #{idx})\n\n{item['text']}\n\n---\n")

    full_md = "\n".join(md_output)
    with open(OUTPUT_MD_PATH, "w", encoding="utf-8") as f:
        f.write(full_md)
    print(f"[SUCCESS] Markdown transcript exported to: {OUTPUT_MD_PATH}")

    # 2. Generate HTML Export
    html_entries = []
    for item in unique_entries:
        is_user = item["role"] == "User"
        bg_color = "#f0fdf4" if is_user else "#ffffff"
        border_color = "#bbf7d0" if is_user else "#e2e8f0"
        role_label = "User" if is_user else "Antigravity AI Assistant"
        avatar = "👤" if is_user else "🤖"
        
        # Simple markdown to html line breaks
        formatted_content = item["text"].replace("\n", "<br/>")
        
        html_entries.append(f"""
        <div style="background-color: {bg_color}; border: 1px solid {border_color}; border-radius: 12px; padding: 20px; margin-bottom: 20px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-weight: bold; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">{avatar}</span>
                <span>{role_label}</span>
            </div>
            <div style="color: #334155; line-height: 1.6; white-space: pre-wrap;">{item['text']}</div>
        </div>
        """)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AarogyaSpeech AI - Full Chat Export</title>
    <style>
        body {{ max-width: 900px; margin: 40px auto; padding: 0 20px; background-color: #f8fafc; color: #0f172a; font-family: system-ui, -apple-system, sans-serif; }}
        h1 {{ text-align: center; color: #0f172a; font-size: 28px; font-weight: 800; }}
        .meta {{ text-align: center; color: #64748b; font-size: 14px; margin-bottom: 30px; }}
    </style>
</head>
<body>
    <h1>AarogyaSpeech AI - Complete Conversation Transcript</h1>
    <div class="meta">Exported from Antigravity IDE · Total Messages: {len(unique_entries)}</div>
    {"".join(html_entries)}
</body>
</html>
"""
    with open(OUTPUT_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"[SUCCESS] HTML transcript exported to: {OUTPUT_HTML_PATH}")

if __name__ == "__main__":
    export_transcript()
