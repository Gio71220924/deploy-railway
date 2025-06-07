# Pakai base image python slim
FROM python:3.10-slim

# Update dan install tesseract serta dependency pendukung
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    pkg-config \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory di dalam container
WORKDIR /app

# Copy file requirements.txt dan install package python
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua kode project ke container
COPY . .

# Jalankan backend flask (sesuaikan nama file kalau bukan backend.py)
CMD ["python", "backend.py"]
