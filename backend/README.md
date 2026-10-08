# AarogyaSpeech X - Real AI Speech Backend

FastAPI Python server powered by PyTorch and Hugging Face's Wav2Vec2/IndicWav2Vec models for Hindi Speech Recognition & Phoneme Misarticulation Analysis.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Python AI Server
```bash
python main.py
```
Or with uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at: `http://localhost:8000`
API Documentation (Swagger UI): `http://localhost:8000/docs`
