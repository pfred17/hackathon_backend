import whisper
import sys
import json
from datetime import datetime
from typing import List, Dict

def format_timestamp(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def segments_to_srt(segments: List[Dict]) -> str:
    lines = []
    for i, seg in enumerate(segments, start=1):
        start = format_timestamp(seg.get('start', 0.0))
        end = format_timestamp(seg.get('end', seg.get('start', 0.0)))
        text = seg.get('text', '').strip()
        lines.append(str(i))
        lines.append(f"{start} --> {end}")
        lines.append(text)
        lines.append("")
    return "\n".join(lines)

audio_file_path = sys.argv[1] if len(sys.argv) > 1 else "test.mp3"
language = sys.argv[2] if len(sys.argv) > 2 else "vi"

model = whisper.load_model("small")

try:
    result = model.transcribe(audio_file_path, language=language)
    text_input = result.get("text", "")
    segments = result.get("segments", [])
    srt = segments_to_srt(segments)

    output = {
        "success": True,
        "language": language,
        "text_input": text_input,
        "srt": srt,
        "timestamp": str(datetime.utcnow()),
    }
    print(json.dumps(output, ensure_ascii=False))

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
