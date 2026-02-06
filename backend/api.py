"""
Flask API Backend for AI Lease Checker
Handles file uploads and coordinates with the LeaseAnalyzer
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tempfile
from lease_analyzer import LeaseAnalyzer
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Initialize analyzer (use environment variable for API key)
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', 'your-api-key-here')
analyzer = LeaseAnalyzer(api_key=ANTHROPIC_API_KEY)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze-lease', methods=['POST'])
def analyze_lease():
    """
    Main endpoint for lease analysis
    Accepts: multipart/form-data with 'file' field
    Returns: JSON analysis result
    """
    
    # Validate request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Use PDF, DOC, or DOCX'}), 400
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Extract text from PDF
        print(f"Extracting text from {filename}...")
        lease_text = analyzer.extract_text_from_pdf(filepath)
        
        if not lease_text or len(lease_text) < 100:
            os.remove(filepath)
            return jsonify({'error': 'Could not extract sufficient text from file'}), 400
        
        # Analyze with AI
        print("Analyzing lease with Claude AI...")
        analysis = analyzer.analyze_lease(lease_text)
        
        # Add safety score
        analysis['safety_score'] = analyzer.calculate_safety_score(analysis)
        analysis['filename'] = filename
        
        # Clean up
        os.remove(filepath)
        
        return jsonify(analysis), 200
    
    except Exception as e:
        # Clean up on error
        if os.path.exists(filepath):
            os.remove(filepath)
        
        print(f"Error analyzing lease: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    """
    Generate HTML report from analysis
    Accepts: JSON analysis result
    Returns: HTML file download
    """
    
    try:
        data = request.get_json()
        
        if not data or 'analysis' not in data:
            return jsonify({'error': 'No analysis data provided'}), 400
        
        analysis = data['analysis']
        filename = data.get('filename', 'lease.pdf')
        
        # Generate HTML report
        html_report = analyzer.generate_report_html(analysis, filename)
        
        # Save to temp file
        report_path = os.path.join(UPLOAD_FOLDER, 'lease_analysis_report.html')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(html_report)
        
        return send_file(
            report_path,
            as_attachment=True,
            download_name='lease_analysis_report.html',
            mimetype='text/html'
        )
    
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return jsonify({'error': f'Report generation failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Lease Checker API',
        'version': '1.0.0'
    }), 200

@app.route('/api/ontario-laws', methods=['GET'])
def get_ontario_laws():
    """
    Return common Ontario housing laws for reference
    """
    laws = {
        'entry_notice': {
            'law': 'Residential Tenancies Act Section 27',
            'requirement': '24 hours written notice required',
            'exceptions': 'Emergency situations only'
        },
        'rent_increase': {
            'law': 'Residential Tenancies Act Section 120',
            'requirement': '90 days written notice required',
            'guideline_2026': '2.5%'
        },
        'security_deposit': {
            'law': 'Residential Tenancies Act Section 105',
            'requirement': 'Only last month rent allowed, no security deposits',
            'maximum': 'One month rent'
        },
        'pet_policy': {
            'law': 'Residential Tenancies Act Section 14',
            'requirement': 'No-pet clauses are not enforceable',
            'note': 'Landlord can only evict if pet causes damage/disturbance'
        },
        'repairs': {
            'law': 'Residential Tenancies Act Section 20',
            'requirement': 'Landlord must maintain property in good repair',
            'tenant_rights': 'Can apply to Landlord Tenant Board for repairs'
        }
    }
    
    return jsonify(laws), 200

if __name__ == '__main__':
    print("Starting AI Lease Checker API...")
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Max file size: {MAX_FILE_SIZE / 1024 / 1024}MB")
    app.run(debug=True, host='0.0.0.0', port=5000)
