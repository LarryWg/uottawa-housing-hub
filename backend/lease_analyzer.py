"""
AI Lease Checker Backend
Analyzes lease agreements for sketchy content, scams, and unfair clauses
"""

import anthropic
import pdfplumber
from pypdf import PdfReader
import json
from typing import Dict, List, Tuple
import re

class LeaseAnalyzer:
    def __init__(self, api_key: str):
        """Initialize with Anthropic API key"""
        self.client = anthropic.Anthropic(api_key=api_key)
        
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract all text from PDF lease agreement"""
        text = ""
        
        try:
            # Try pdfplumber first (better for formatted text)
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}, trying pypdf...")
            # Fallback to pypdf
            try:
                reader = PdfReader(pdf_path)
                for page in reader.pages:
                    text += page.extract_text() + "\n\n"
            except Exception as e2:
                raise Exception(f"Failed to extract text: {e2}")
        
        return text.strip()
    
    def analyze_lease(self, lease_text: str) -> Dict:
        """
        Analyze lease agreement using Claude AI
        Returns detailed analysis with red flags, scam indicators, and recommendations
        """
        
        prompt = f"""You are an expert housing lawyer specializing in Ontario tenant law and lease agreements. 
Analyze this lease agreement for a student renting near the University of Ottawa. 

Your task is to identify:
1. **RED FLAGS**: Illegal, unfair, or highly suspicious clauses
2. **SCAM INDICATORS**: Signs this might be a rental scam
3. **CONCERNING CLAUSES**: Legal but potentially problematic terms
4. **VIOLATIONS**: Specific violations of Ontario Residential Tenancies Act
5. **RECOMMENDATIONS**: Actionable advice for the tenant

Be thorough and specific. For each issue, explain:
- What the clause says
- Why it's problematic
- What the tenant's rights are
- What action they should take

LEASE AGREEMENT:
{lease_text}

Please respond in the following JSON format:
{{
    "overall_risk_level": "LOW/MEDIUM/HIGH/CRITICAL",
    "confidence_score": 0-100,
    "is_likely_scam": true/false,
    "scam_indicators": [
        {{
            "indicator": "Description of scam sign",
            "severity": "LOW/MEDIUM/HIGH",
            "explanation": "Why this indicates a scam"
        }}
    ],
    "legal_violations": [
        {{
            "clause": "Quote from lease",
            "violation": "Which law/act it violates",
            "severity": "LOW/MEDIUM/HIGH",
            "explanation": "Detailed explanation",
            "tenant_rights": "What rights the tenant has",
            "action": "What the tenant should do"
        }}
    ],
    "red_flags": [
        {{
            "issue": "Name of the red flag",
            "clause": "Quote from lease",
            "severity": "LOW/MEDIUM/HIGH",
            "explanation": "Why this is a red flag",
            "recommendation": "What to do about it"
        }}
    ],
    "concerning_clauses": [
        {{
            "clause": "Quote from lease",
            "concern": "What's concerning about it",
            "impact": "How it affects the tenant",
            "negotiation_tip": "How to negotiate this"
        }}
    ],
    "missing_clauses": [
        {{
            "missing_item": "What should be in the lease but isn't",
            "importance": "Why this matters",
            "recommendation": "What to request from landlord"
        }}
    ],
    "good_points": [
        "List of positive aspects of the lease"
    ],
    "financial_red_flags": [
        {{
            "issue": "Financial concern",
            "details": "Specifics",
            "standard": "What's normal in Ontario",
            "risk": "Why this is risky"
        }}
    ],
    "recommendations": [
        {{
            "priority": "HIGH/MEDIUM/LOW",
            "action": "Specific action to take",
            "explanation": "Why this is important"
        }}
    ],
    "overall_summary": "2-3 sentence summary of the lease",
    "should_sign": "YES/NO/PROCEED_WITH_CAUTION",
    "next_steps": "What the tenant should do next"
}}"""

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                temperature=0,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Extract JSON from response
            response_text = message.content[0].text
            
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
            else:
                analysis = json.loads(response_text)
            
            return analysis
            
        except Exception as e:
            raise Exception(f"AI analysis failed: {e}")
    
    def calculate_safety_score(self, analysis: Dict) -> int:
        """Calculate a safety score (0-100) based on the analysis"""
        score = 100
        
        # Deduct points for issues
        if analysis.get('is_likely_scam'):
            score -= 80
        
        risk_level = analysis.get('overall_risk_level', 'LOW')
        if risk_level == 'CRITICAL':
            score -= 60
        elif risk_level == 'HIGH':
            score -= 40
        elif risk_level == 'MEDIUM':
            score -= 20
        
        # Deduct for violations and red flags
        score -= len(analysis.get('legal_violations', [])) * 10
        score -= len(analysis.get('red_flags', [])) * 5
        score -= len(analysis.get('concerning_clauses', [])) * 3
        score -= len(analysis.get('financial_red_flags', [])) * 7
        
        return max(0, min(100, score))
    
    def generate_report_html(self, analysis: Dict, filename: str) -> str:
        """Generate an HTML report of the analysis"""
        score = self.calculate_safety_score(analysis)
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Lease Analysis Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #8F001A 0%, #6B0013 100%);
            color: white;
            border-radius: 10px;
        }}
        .score {{
            font-size: 72px;
            font-weight: bold;
            margin: 20px 0;
        }}
        .risk-badge {{
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }}
        .risk-low {{ background: #22c55e; color: white; }}
        .risk-medium {{ background: #f59e0b; color: white; }}
        .risk-high {{ background: #ef4444; color: white; }}
        .risk-critical {{ background: #7f1d1d; color: white; }}
        .section {{
            margin: 30px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #8F001A;
        }}
        .section-title {{
            font-size: 24px;
            font-weight: bold;
            color: #8F001A;
            margin-bottom: 15px;
        }}
        .item {{
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }}
        .severity {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }}
        .severity-high {{ background: #fee2e2; color: #991b1b; }}
        .severity-medium {{ background: #fef3c7; color: #92400e; }}
        .severity-low {{ background: #dbeafe; color: #1e3a8a; }}
        .quote {{
            background: #f3f4f6;
            padding: 10px;
            border-left: 3px solid #9ca3af;
            margin: 10px 0;
            font-style: italic;
        }}
        .recommendation {{
            background: #ecfdf5;
            padding: 15px;
            border-left: 3px solid #10b981;
            margin: 10px 0;
        }}
        .scam-alert {{
            background: #fee2e2;
            border: 2px solid #dc2626;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .good-point {{
            background: #ecfdf5;
            padding: 10px;
            border-left: 3px solid #10b981;
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Lease Analysis Report</h1>
        <p>UOttawa Housing Hub - AI Lease Checker</p>
        <p><strong>File:</strong> {filename}</p>
        <div class="score">{score}</div>
        <p>Safety Score</p>
        <span class="risk-badge risk-{analysis.get('overall_risk_level', 'low').lower()}">
            {analysis.get('overall_risk_level', 'UNKNOWN')} RISK
        </span>
    </div>
"""
        
        # Scam Alert
        if analysis.get('is_likely_scam'):
            html += """
    <div class="scam-alert">
        <h2>⚠️ SCAM ALERT</h2>
        <p><strong>This lease shows signs of being a potential scam. DO NOT SIGN or send money.</strong></p>
    </div>
"""
        
        # Scam Indicators
        if analysis.get('scam_indicators'):
            html += '<div class="section"><div class="section-title">🚨 Scam Indicators</div>'
            for indicator in analysis['scam_indicators']:
                html += f"""
    <div class="item">
        <strong>{indicator['indicator']}</strong>
        <span class="severity severity-{indicator['severity'].lower()}">{indicator['severity']}</span>
        <p>{indicator['explanation']}</p>
    </div>
"""
            html += '</div>'
        
        # Legal Violations
        if analysis.get('legal_violations'):
            html += '<div class="section"><div class="section-title">⚖️ Legal Violations</div>'
            for violation in analysis['legal_violations']:
                html += f"""
    <div class="item">
        <strong>{violation['violation']}</strong>
        <span class="severity severity-{violation['severity'].lower()}">{violation['severity']}</span>
        <div class="quote">"{violation['clause']}"</div>
        <p><strong>Explanation:</strong> {violation['explanation']}</p>
        <p><strong>Your Rights:</strong> {violation['tenant_rights']}</p>
        <div class="recommendation">
            <strong>Action Required:</strong> {violation['action']}
        </div>
    </div>
"""
            html += '</div>'
        
        # Red Flags
        if analysis.get('red_flags'):
            html += '<div class="section"><div class="section-title">🚩 Red Flags</div>'
            for flag in analysis['red_flags']:
                html += f"""
    <div class="item">
        <strong>{flag['issue']}</strong>
        <span class="severity severity-{flag['severity'].lower()}">{flag['severity']}</span>
        <div class="quote">"{flag['clause']}"</div>
        <p>{flag['explanation']}</p>
        <div class="recommendation">
            <strong>Recommendation:</strong> {flag['recommendation']}
        </div>
    </div>
"""
            html += '</div>'
        
        # Financial Red Flags
        if analysis.get('financial_red_flags'):
            html += '<div class="section"><div class="section-title">💰 Financial Red Flags</div>'
            for flag in analysis['financial_red_flags']:
                html += f"""
    <div class="item">
        <strong>{flag['issue']}</strong>
        <p><strong>Details:</strong> {flag['details']}</p>
        <p><strong>Ontario Standard:</strong> {flag['standard']}</p>
        <p><strong>Risk:</strong> {flag['risk']}</p>
    </div>
"""
            html += '</div>'
        
        # Good Points
        if analysis.get('good_points'):
            html += '<div class="section"><div class="section-title">✅ Positive Aspects</div>'
            for point in analysis['good_points']:
                html += f'<div class="good-point">{point}</div>'
            html += '</div>'
        
        # Recommendations
        if analysis.get('recommendations'):
            html += '<div class="section"><div class="section-title">📋 Recommendations</div>'
            for rec in analysis['recommendations']:
                priority_class = 'severity-' + rec['priority'].lower()
                html += f"""
    <div class="item">
        <strong>{rec['action']}</strong>
        <span class="severity {priority_class}">{rec['priority']} PRIORITY</span>
        <p>{rec['explanation']}</p>
    </div>
"""
            html += '</div>'
        
        # Summary
        html += f"""
    <div class="section">
        <div class="section-title">📝 Summary</div>
        <p>{analysis.get('overall_summary', 'No summary available')}</p>
        <p><strong>Recommendation:</strong> {analysis.get('should_sign', 'UNKNOWN')}</p>
        <div class="recommendation">
            <strong>Next Steps:</strong> {analysis.get('next_steps', 'Consult with a legal professional')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">ℹ️ Important Information</div>
        <p>This analysis is provided by AI and should not be considered legal advice. 
        For specific legal concerns, please consult with:</p>
        <ul>
            <li><strong>UOttawa Legal Aid Clinic</strong></li>
            <li><strong>Ontario Landlord and Tenant Board:</strong> tribunalsontario.ca/ltb</li>
            <li><strong>Community Legal Services Ottawa:</strong> clsottawa.ca</li>
        </ul>
    </div>
</body>
</html>
"""
        return html


# Example usage
if __name__ == "__main__":
    # Initialize analyzer with your API key
    analyzer = LeaseAnalyzer(api_key="your-anthropic-api-key-here")
    
    # Extract text from PDF
    lease_text = analyzer.extract_text_from_pdf("lease.pdf")
    
    # Analyze the lease
    analysis = analyzer.analyze_lease(lease_text)
    
    # Generate HTML report
    html_report = analyzer.generate_report_html(analysis, "lease.pdf")
    
    # Save report
    with open("lease_analysis_report.html", "w") as f:
        f.write(html_report)
    
    print("Analysis complete! Report saved to lease_analysis_report.html")
    print(f"Safety Score: {analyzer.calculate_safety_score(analysis)}/100")
