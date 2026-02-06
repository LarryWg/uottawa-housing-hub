# 🏠 AI Lease Checker - Complete Setup Guide

A comprehensive AI-powered lease analysis system for University of Ottawa students to detect scams, illegal clauses, and unfair terms in rental agreements.

## 🌟 Features

- **Scam Detection**: Identifies common rental scam patterns and fake landlords
- **Legal Analysis**: Checks compliance with Ontario Residential Tenancies Act
- **Financial Protection**: Flags excessive fees and hidden costs
- **Red Flag Detection**: Highlights concerning and illegal clauses
- **AI-Powered**: Uses Claude AI (Anthropic) for intelligent analysis
- **Comprehensive Reports**: Generates detailed HTML reports with actionable advice

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Anthropic API Key** - [Get one here](https://console.anthropic.com/)

### Optional (for OCR on scanned PDFs)

- **Tesseract OCR** - [Installation Guide](https://github.com/tesseract-ocr/tesseract)
- **Poppler** (for PDF to image conversion) - [Installation](https://github.com/Belval/pdf2image#first-you-need-poppler-installed)

---

## Backend Setup

### 1. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Anthropic API Key (REQUIRED)
ANTHROPIC_API_KEY=your-actual-api-key-here

# Optional Configuration
FLASK_ENV=development
FLASK_DEBUG=True
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_FOLDER=/tmp
```

### 3. Get Your Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Important**: Keep your API key secret! Never commit it to version control.

### 4. Test the Backend

```bash
# Make sure you're in the backend directory with venv activated
python api.py
```

You should see:
```
Starting AI Lease Checker API...
Upload folder: /tmp
Max file size: 10.0MB
 * Running on http://0.0.0.0:5000
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Lease Checker API",
  "version": "1.0.0"
}
```

---

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Configure API Endpoint

Update your frontend to point to the backend API. In your React app, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Update the LeaseCheckerPage

Replace the fetch URL in `LeaseCheckerPage-AI.tsx`:

```typescript
// Change this:
const response = await fetch('/api/analyze-lease', {

// To this:
const response = await fetch('http://localhost:5000/api/analyze-lease', {
```

Or use the environment variable:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const response = await fetch(`${API_URL}/api/analyze-lease`, {
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python api.py
```

Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173` (or similar)

### Testing the Full Flow

1. Open your browser to `http://localhost:5173`
2. Navigate to the Lease Checker page
3. Upload a sample PDF lease agreement
4. Click "Analyze Lease with AI"
5. View the detailed analysis results

---

## API Documentation

### Endpoints

#### `POST /api/analyze-lease`

Upload and analyze a lease agreement.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF, DOC, or DOCX)

**Response:**
```json
{
  "overall_risk_level": "HIGH",
  "confidence_score": 87,
  "is_likely_scam": false,
  "scam_indicators": [...],
  "legal_violations": [...],
  "red_flags": [...],
  "financial_red_flags": [...],
  "recommendations": [...],
  "safety_score": 32
}
```

#### `POST /api/generate-report`

Generate HTML report from analysis.

**Request:**
```json
{
  "analysis": { /* analysis object */ },
  "filename": "lease.pdf"
}
```

**Response:** HTML file download

#### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Lease Checker API",
  "version": "1.0.0"
}
```

#### `GET /api/ontario-laws`

Get Ontario housing law reference.

**Response:**
```json
{
  "entry_notice": {
    "law": "Residential Tenancies Act Section 27",
    "requirement": "24 hours written notice required"
  },
  ...
}
```

---

## Deployment

### Backend Deployment (Railway/Render/Heroku)

#### Option 1: Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Initialize Railway:
```bash
railway login
railway init
```

3. Add environment variables in Railway dashboard:
   - `ANTHROPIC_API_KEY`
   - `FLASK_ENV=production`

4. Deploy:
```bash
railway up
```

#### Option 2: Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: lease-checker-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn api:app
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false
```

2. Connect your GitHub repo to Render
3. Add environment variables in Render dashboard
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

Update environment variable in Vercel dashboard:
- `VITE_API_URL=https://your-backend-url.com`

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

Update environment variable in Netlify dashboard:
- `VITE_API_URL=https://your-backend-url.com`

---

## File Structure

```
ai-lease-checker/
├── backend/
│   ├── api.py                 # Flask API server
│   ├── lease_analyzer.py      # Core analysis logic
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (create this)
│   └── README.md             # This file
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── LeaseCheckerPage-AI.tsx  # Main component
│   │   └── ...
│   ├── package.json
│   └── .env.local            # Frontend env vars (create this)
│
└── README.md
```

---

## Troubleshooting

### Common Issues

#### 1. "ModuleNotFoundError: No module named 'anthropic'"

**Solution:**
```bash
pip install -r requirements.txt
```

#### 2. "API Key not found"

**Solution:**
- Ensure `.env` file exists in backend directory
- Verify `ANTHROPIC_API_KEY` is set correctly
- Restart the Flask server after adding the key

#### 3. "CORS Error" in browser

**Solution:**
- Ensure `flask-cors` is installed
- Check that CORS is enabled in `api.py`
- Verify API URL in frontend matches backend URL

#### 4. "Failed to extract text from PDF"

**Solution:**
- Ensure file is a valid PDF
- Try using a different PDF library
- Check if PDF is scanned (requires OCR)

#### 5. "Rate Limit Exceeded" from Anthropic

**Solution:**
- You've exceeded your API quota
- Wait or upgrade your Anthropic plan
- Implement request caching for development

### Testing with Sample Files

Create a test PDF lease for development:

```python
from reportlab.pdfgen import canvas

c = canvas.Canvas("test_lease.pdf")
c.drawString(100, 750, "LEASE AGREEMENT")
c.drawString(100, 700, "Security deposit: 2 months rent")
c.drawString(100, 650, "Landlord may enter with 12 hours notice")
c.save()
```

---

## Security Best Practices

1. **Never commit API keys** - Use `.env` files and `.gitignore`
2. **Validate file uploads** - Check file type and size
3. **Sanitize filenames** - Use `secure_filename()`
4. **Rate limiting** - Implement rate limiting in production
5. **HTTPS only** - Use HTTPS in production
6. **File cleanup** - Delete uploaded files after processing

---

## Cost Estimation

### Anthropic API Costs

Claude Sonnet pricing (as of 2024):
- Input: $3 per million tokens
- Output: $15 per million tokens

Average lease analysis:
- Input: ~3,000 tokens (typical lease)
- Output: ~1,000 tokens (analysis)
- **Cost per analysis: ~$0.02**

For 100 analyses: ~$2.00
For 1,000 analyses: ~$20.00

**Recommendation**: Set up usage alerts in Anthropic console!

---

## Support & Resources

- **Anthropic Documentation**: https://docs.anthropic.com/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Ontario Landlord Tenant Board**: https://tribunalsontario.ca/ltb/
- **UOttawa Legal Aid**: 613-562-5800

---

## License

This project is for educational purposes. Consult with a legal professional for actual lease advice.

---

## Contributing

Want to improve the AI Lease Checker? Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Next Steps

1. ✅ Set up backend with your API key
2. ✅ Test with sample lease PDFs
3. ✅ Integrate with frontend
4. 📊 Add analytics to track usage
5. 🔐 Add user authentication
6. 💾 Store analysis history in database
7. 📧 Email reports to users
8. 🌐 Deploy to production

---

**Need Help?** Open an issue on GitHub or contact the development team!

🏠 Happy (safe) house hunting! 🎓
