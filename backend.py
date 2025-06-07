from flask import Flask, request, jsonify
import pytesseract
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return '✅ OCR Backend is running!'

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp:
        file.save(temp.name)
        img = cv2.imread(temp.name)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang='eng+ind', config='--oem 3 --psm 6')
    os.unlink(temp.name)

    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))