import whisper
import sys
import json
from datetime import datetime
import os

audio_file_path = sys.argv[1] if len(sys.argv) > 1 else "test.mp3"
user_id = sys.argv[2] if len(sys.argv) > 2 else "unknown_user"

model = whisper.load_model("small")

try:
    result = model.transcribe(audio_file_path, language="vi")
    text_input = result["text"]

    output = {
        "success": True,
        "user_id": user_id,
        "text_input": text_input,
        "timestamp": str(datetime.utcnow()),
    }
    print(json.dumps(output, ensure_ascii=False))

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
