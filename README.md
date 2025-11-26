# Web Application Vulnerability Scanner

## 📋 Problem Statement

Build a comprehensive web application vulnerability scanner to detect common web application vulnerabilities based on OWASP Top 10. The scanner should identify XSS (Cross-Site Scripting), SQLi (SQL Injection), CSRF (Cross-Site Request Forgery), and missing security headers through payload injection and pattern matching.

### Objectives

1. **Vulnerability Detection**: Identify XSS, SQLi, CSRF, and security header vulnerabilities
2. **Web Crawling**: Automatically crawl target websites to find input fields and forms
3. **Payload Injection**: Test multiple payloads for each vulnerability type
4. **Pattern Matching**: Use regex patterns to detect vulnerabilities in responses
5. **Web Interface**: Provide a Flask-based UI for managing and viewing scan results
6. **Detailed Reporting**: Generate comprehensive reports with evidence and severity levels
7. **Vulnerability Logging**: Log each vulnerability with evidence and remediation guidance

## 🎯 Key Features

### Backend Scanner Module
- **XSS Detection**: Tests for reflected XSS vulnerabilities using multiple payloads
- **SQLi Detection**: Detects SQL injection through error-based testing
- **CSRF Detection**: Identifies forms lacking CSRF token protection
- **Security Headers**: Checks for missing security headers (CSP, X-Frame-Options, etc.)
- **Form Crawling**: Automatically extracts all forms and input fields from target
- **Pattern Matching**: Uses regex to identify vulnerability indicators

### Web Interface
- **Dashboard**: Real-time statistics and quick scan launcher
- **Scan Management**: View, organize, and delete scans
- **Detailed Reports**: View vulnerability details with evidence
- **Export Functionality**: Export scan results as JSON
- **Responsive Design**: Works on desktop and mobile devices

### Reporting
- **Severity Classification**: CRITICAL, HIGH, MEDIUM, LOW
- **Vulnerability Evidence**: Captured payload and response data
- **Remediation Guidance**: Security best practices for each vulnerability type
- **Scan History**: Persistent storage of all scans and results

## 📦 Project Structure

```
scanner/
├── app/
│   ├── app.py                 # Flask application
│   ├── templates/
│   │   ├── dashboard.html     # Main dashboard
│   │   ├── report.html        # Detailed scan report
│   │   └── error.html         # Error page
│   └── static/
│       ├── css/
│       │   └── style.css      # Application styling
│       └── js/
│           └── main.js        # Frontend JavaScript
├── scanners/
│   └── vulnerability_scanner.py  # Core scanner module
├── reports/                   # Scan reports storage
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Setup Steps

1. **Clone or extract the project**
```bash
cd e:\scanner
```

2. **Create a virtual environment** (recommended)
```bash
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the Flask application**
```bash
python app/app.py
```

5. **Access the web interface**
Open your browser and navigate to: `http://localhost:5000`

## 💻 Usage

### Starting a Scan

1. Navigate to the Dashboard
2. Enter the target URL (e.g., `https://example.com`)
3. Select vulnerability tests to run:
   - ✓ XSS (Cross-Site Scripting)
   - ✓ SQLi (SQL Injection)
   - ✓ CSRF (Cross-Site Request Forgery)
   - ✓ Security Headers
4. Click "Start Scan"
5. Wait for scan to complete
6. Review results in the dashboard

### Viewing Results

- **Summary**: See vulnerability count by severity
- **Detailed View**: Click vulnerability cards for more information
- **Full Report**: Click "View Full Report" for comprehensive analysis
- **Export**: Download scan results as JSON file

### Managing Scans

- **History**: View all historical scans in the History section
- **Delete**: Remove scans you no longer need
- **Export**: Save scan reports locally

## 🔍 Vulnerability Detection Methods

### XSS (Cross-Site Scripting)
**Detection Method**: Payload injection + pattern matching
- **Payloads**: Script tags, event handlers, JavaScript protocols
- **Test Type**: Reflected XSS
- **Severity**: HIGH
- **Impact**: User session hijacking, data theft, malware distribution

**Remediation**:
```html
<!-- Input Validation -->
<input type="text" pattern="[a-zA-Z0-9]+" required>

<!-- Output Encoding -->
<!-- Use framework auto-escaping or htmlspecialchars() -->

<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

### SQLi (SQL Injection)
**Detection Method**: Payload injection + error detection
- **Payloads**: OR conditions, UNION statements, time-based tests
- **Test Type**: Error-based detection
- **Severity**: CRITICAL
- **Impact**: Data breach, authentication bypass, database manipulation

**Remediation**:
```python
# Use parameterized queries
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Use ORM frameworks
user = User.query.filter_by(id=user_id).first()
```

### CSRF (Cross-Site Request Forgery)
**Detection Method**: Form analysis
- **Check**: Presence of CSRF tokens in POST/PUT/DELETE forms
- **Severity**: HIGH
- **Impact**: Unauthorized state-changing actions

**Remediation**:
```html
<form method="POST" action="/action">
    <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
    <input type="submit" value="Submit">
</form>
```

### Security Headers
**Detection Method**: Response header analysis
- **Checks**:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY/SAMEORIGIN
  - Strict-Transport-Security
  - Content-Security-Policy
  - X-XSS-Protection
- **Severity**: MEDIUM
- **Impact**: Increased attack surface

**Remediation**:
```python
# Flask example
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response
```

## 📊 Report Format

### Scan Results Structure
```json
{
  "scan_id": "uuid",
  "target": "https://example.com",
  "scan_time": "2025-11-26T10:30:00",
  "status": "completed",
  "summary": {
    "total": 5,
    "critical": 1,
    "high": 2,
    "medium": 2,
    "low": 0
  },
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "parameter": "id",
      "payload": "' OR '1'='1",
      "severity": "CRITICAL",
      "evidence": "SQL error details..."
    }
  ]
}
```

## 🛡️ OWASP Top 10 Coverage

| Rank | Vulnerability | Detection | Status |
|------|---------------|-----------|--------|
| 1 | Broken Access Control | - | Not Implemented |
| 2 | Cryptographic Failures | ✓ Security Headers | Partial |
| 3 | Injection | ✓ SQLi, XSS | Implemented |
| 4 | Insecure Design | - | Not Implemented |
| 5 | Security Misconfiguration | ✓ Security Headers | Implemented |
| 6 | Vulnerable Components | - | Not Implemented |
| 7 | Authentication Failures | - | Not Implemented |
| 8 | Software & Data Integrity | - | Not Implemented |
| 9 | Logging & Monitoring | ✓ Logging | Implemented |
| 10 | SSRF | - | Not Implemented |

## 🔐 Important Security Notes

### Legal & Ethical Usage
⚠️ **WARNING**: Only scan websites you own or have explicit permission to test. Unauthorized scanning may be illegal.

### Scanner Limitations
- Only detects basic/obvious vulnerabilities
- False positives may occur
- Should be used as part of comprehensive security testing
- Does not perform deep code analysis
- Manual verification recommended for findings

### Rate Limiting
The scanner does not implement rate limiting. Be responsible with scans to avoid:
- Overwhelming target servers
- Getting your IP blocked
- Violating terms of service

## 🔧 Advanced Usage

### Command Line Testing (Future Feature)
```python
from scanners.vulnerability_scanner import VulnerabilityScanner

scanner = VulnerabilityScanner('https://example.com')
results = scanner.scan_target(
    test_xss=True,
    test_sqli=True,
    test_csrf=True,
    test_headers=True
)

print(scanner.export_report(results, format='json'))
```

### Custom Payloads (Future Enhancement)
```python
# Add custom XSS payloads
scanner.XSS_PAYLOADS.append('<custom-payload>')

# Add custom SQLi payloads
scanner.SQLI_PAYLOADS.append("CUSTOM' AND 1=2--")
```

## 📈 Scan Statistics

The dashboard displays real-time statistics:
- **Total Scans**: Number of scans performed
- **Total Vulnerabilities**: Cumulative vulnerability count
- **Critical Issues**: Number of critical severity vulnerabilities
- **Average Vulns/Scan**: Mean vulnerabilities per scan

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change Flask port in app.py
app.run(port=5001)  # Use different port
```

### Connection Errors
- Verify target URL is accessible
- Check internet connection
- Ensure firewall allows outbound connections

### Import Errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Virtual Environment Issues
```bash
# Recreate virtual environment
deactivate
rmdir venv /s
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 🚀 Future Enhancements

### Planned Features
- [ ] Authenticity bypass detection
- [ ] XXE (XML External Entity) injection testing
- [ ] SSRF (Server-Side Request Forgery) detection
- [ ] Deserialization vulnerability testing
- [ ] File upload vulnerability detection
- [ ] API endpoint scanning
- [ ] Selenium-based JavaScript rendering
- [ ] Concurrent scanning support
- [ ] Database persistence (SQLite/PostgreSQL)
- [ ] User authentication and role-based access
- [ ] Scheduled scans
- [ ] Email report delivery
- [ ] Integration with CI/CD pipelines
- [ ] Docker containerization
- [ ] Custom payload editor

## 📝 Technical Details

### Dependencies
- **Flask 2.3.0**: Web framework for building the UI
- **flask-cors 4.0.0**: Handle cross-origin requests
- **requests 2.31.0**: HTTP library for vulnerability testing
- **beautifulsoup4 4.12.0**: HTML parsing for form extraction

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Start new vulnerability scan |
| GET | `/api/scans` | List all historical scans |
| GET | `/api/scan/<id>` | Get specific scan results |
| DELETE | `/api/scan/<id>/delete` | Delete scan |
| GET | `/api/report/<id>/export` | Export scan as JSON |
| GET | `/api/stats` | Get statistics |
| GET | `/health` | Health check |

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/)

## 📄 License

This project is created for educational purposes. Use responsibly and only on systems you own or have explicit permission to test.

## 👨‍💻 Support

For issues or suggestions:
1. Check the Troubleshooting section
2. Verify all dependencies are installed
3. Ensure Python 3.8+ is being used
4. Review Flask and library documentation

## 🎓 Educational Value

This scanner demonstrates:
- Web application security concepts
- Vulnerability detection techniques
- Flask web development
- HTML/CSS/JavaScript frontend development
- REST API design
- Security testing methodologies
- OWASP best practices

---

**Last Updated**: November 26, 2025
**Version**: 1.0.0
#   v u l n e r a b i l i t y s c a n n e r  
 #   w e b s c a n n e r  
 