from gtts import gTTS
import sys
import os
import json

try:
    text_input = sys.argv[1] if len(sys.argv) > 1 else "Xin chào!"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output.mp3"
    lang = sys.argv[3] if len(sys.argv) > 3 else "vi"

    # fix đường dẫn Windows
    output_file = output_file.replace("\\", "/")

    # đảm bảo thư mục tồn tại
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    tts = gTTS(text=text_input, lang=lang)
    tts.save(output_file)

    # kiểm tra file có tạo ra không
    if not os.path.exists(output_file):
        raise FileNotFoundError(f"File {output_file} not created")

    print(json.dumps({"success": True, "output_file": output_file}))

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
