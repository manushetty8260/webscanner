"""
Flask Web Application for Vulnerability Scanner
Manages scans, displays results, and generates reports
"""
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import json
import os
import uuid
from pathlib import Path
import sys

# Add scanners directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scanners'))

from vulnerability_scanner import VulnerabilityScanner

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Configuration
REPORTS_DIR = Path(__file__).parent.parent / 'reports'
REPORTS_DIR.mkdir(exist_ok=True)

# In-memory scan history (in production, use database)
scan_history = {}

@app.route('/')
def index():
    """Dashboard homepage"""
    return render_template('dashboard.html')

@app.route('/api/scan', methods=['POST'])
def start_scan():
    """Start a new vulnerability scan"""
    try:
        data = request.json
        target_url = data.get('target_url')
        
        if not target_url:
            return jsonify({'error': 'Target URL is required'}), 400
        
        # Validate URL format
        if not (target_url.startswith('http://') or target_url.startswith('https://')):
            target_url = 'http://' + target_url
        
        # Create scan ID
        scan_id = str(uuid.uuid4())
        
        # Initialize scanner
        scanner = VulnerabilityScanner(target_url)
        
        # Run scan with selected options
        test_xss = data.get('test_xss', True)
        test_sqli = data.get('test_sqli', True)
        test_csrf = data.get('test_csrf', True)
        test_headers = data.get('test_headers', True)
        
        scan_results = scanner.scan_target(
            test_xss=test_xss,
            test_sqli=test_sqli,
            test_csrf=test_csrf,
            test_headers=test_headers
        )
        
        # Store scan results
        scan_results['scan_id'] = scan_id
        scan_results['status'] = 'completed'
        scan_history[scan_id] = scan_results
        
        # Save scan to file
        report_path = REPORTS_DIR / f'scan_{scan_id}.json'
        with open(report_path, 'w') as f:
            json.dump(scan_results, f, indent=2)
        
        return jsonify({
            'success': True,
            'scan_id': scan_id,
            'results': scan_results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scans', methods=['GET'])
def list_scans():
    """List all historical scans"""
    try:
        scans_summary = []
        for scan_id, scan_data in scan_history.items():
            scans_summary.append({
                'scan_id': scan_id,
                'target': scan_data.get('target'),
                'scan_time': scan_data.get('scan_time'),
                'status': scan_data.get('status'),
                'total_vulnerabilities': scan_data['summary'].get('total', 0),
                'critical': scan_data['summary'].get('critical', 0),
                'high': scan_data['summary'].get('high', 0),
                'medium': scan_data['summary'].get('medium', 0),
                'low': scan_data['summary'].get('low', 0),
            })
        
        # Sort by scan time (newest first)
        scans_summary.sort(key=lambda x: x['scan_time'], reverse=True)
        
        return jsonify({
            'success': True,
            'scans': scans_summary,
            'total_scans': len(scans_summary)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scan/<scan_id>', methods=['GET'])
def get_scan_results(scan_id):
    """Get detailed results for a specific scan"""
    try:
        if scan_id not in scan_history:
            return jsonify({'error': 'Scan not found'}), 404
        
        scan_results = scan_history[scan_id]
        return jsonify({
            'success': True,
            'results': scan_results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scan/<scan_id>')
def view_scan_report(scan_id):
    """View detailed scan report in web interface"""
    if scan_id not in scan_history:
        return render_template('error.html', message='Scan not found'), 404
    
    scan_results = scan_history[scan_id]
    return render_template('report.html', scan=scan_results)

@app.route('/api/report/<scan_id>/export', methods=['GET'])
def export_report(scan_id):
    """Export scan report as JSON file"""
    try:
        if scan_id not in scan_history:
            return jsonify({'error': 'Scan not found'}), 404
        
        report_path = REPORTS_DIR / f'scan_{scan_id}.json'
        if report_path.exists():
            return send_file(report_path, as_attachment=True, 
                           download_name=f'scan_report_{scan_id}.json')
        
        return jsonify({'error': 'Report file not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scan/<scan_id>/delete', methods=['DELETE'])
def delete_scan(scan_id):
    """Delete a scan from history"""
    try:
        if scan_id not in scan_history:
            return jsonify({'error': 'Scan not found'}), 404
        
        del scan_history[scan_id]
        
        # Delete report file
        report_path = REPORTS_DIR / f'scan_{scan_id}.json'
        if report_path.exists():
            report_path.unlink()
        
        return jsonify({
            'success': True,
            'message': 'Scan deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_statistics():
    """Get overall statistics"""
    total_scans = len(scan_history)
    total_vulns = sum(scan['summary']['total'] for scan in scan_history.values())
    critical_vulns = sum(scan['summary']['critical'] for scan in scan_history.values())
    
    return jsonify({
        'success': True,
        'total_scans': total_scans,
        'total_vulnerabilities': total_vulns,
        'critical_vulnerabilities': critical_vulns,
        'average_vulns_per_scan': total_vulns // total_scans if total_scans > 0 else 0,
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'vulnerability-scanner'}), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('error.html', message='Page not found'), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return render_template('error.html', message='Internal server error'), 500

if __name__ == '__main__':
    # Load existing scans from disk
    try:
        for report_file in REPORTS_DIR.glob('scan_*.json'):
            with open(report_file, 'r') as f:
                scan_data = json.load(f)
                scan_id = scan_data.get('scan_id')
                if scan_id:
                    scan_history[scan_id] = scan_data
    except Exception as e:
        print(f"Warning: Could not load existing scans: {e}")
    
    # Run Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
