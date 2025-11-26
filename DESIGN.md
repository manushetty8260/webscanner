# Web Application Vulnerability Scanner - Problem Statement & Design

## 📋 Problem Statement

### Overview
Build a comprehensive Web Application Vulnerability Scanner to detect common web application vulnerabilities from the OWASP Top 10. The scanner should identify XSS, SQLi, CSRF vulnerabilities and missing security headers through automated payload injection and pattern matching.

### Business Requirements
1. **Vulnerability Detection**: Automatically scan web applications for security flaws
2. **Easy-to-Use Interface**: Web-based dashboard for managing scans
3. **Comprehensive Reporting**: Detailed reports with evidence and remediation guidance
4. **Historical Tracking**: Store and retrieve scan results over time
5. **Export Capability**: Export scan results for documentation and analysis

### Technical Requirements
1. **Web Crawling**: Automatically discover input fields, forms, and URL parameters
2. **Payload Testing**: Inject test payloads for multiple vulnerability types
3. **Pattern Matching**: Use regex to identify vulnerability indicators in responses
4. **Web Framework**: Flask-based UI for scan management
5. **Data Logging**: Log all vulnerabilities with evidence and severity levels
6. **Responsive Design**: Support desktop and mobile devices

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐
│   User Browser  │
│   (Dashboard)   │
└────────┬────────┘
         │
         │ HTTP/AJAX
         ▼
┌─────────────────────────────────┐
│     Flask Web Application       │
│ ┌───────────────────────────┐   │
│ │ Routes & API Endpoints    │   │
│ └─────────────┬─────────────┘   │
│               │                 │
│ ┌─────────────▼──────────────┐  │
│ │ Scan Manager               │  │
│ │ - Scan Control             │  │
│ │ - Result Storage           │  │
│ │ - Report Generation        │  │
│ └─────────────┬──────────────┘  │
└────────────────┼─────────────────┘
                 │
                 │
    ┌────────────▼────────────────┐
    │  Vulnerability Scanner      │
    │ ┌──────────────────────┐    │
    │ │ Form Crawler         │    │
    │ │ - Extract forms      │    │
    │ │ - Find input fields  │    │
    │ └──────────────────────┘    │
    │                             │
    │ ┌──────────────────────┐    │
    │ │ XSS Detector         │    │
    │ │ - Payload injection  │    │
    │ │ - Response analysis  │    │
    │ └──────────────────────┘    │
    │                             │
    │ ┌──────────────────────┐    │
    │ │ SQLi Detector        │    │
    │ │ - Error detection    │    │
    │ │ - Pattern matching   │    │
    │ └──────────────────────┘    │
    │                             │
    │ ┌──────────────────────┐    │
    │ │ CSRF Detector        │    │
    │ │ - Form analysis      │    │
    │ │ - Token detection    │    │
    │ └──────────────────────┘    │
    │                             │
    │ ┌──────────────────────┐    │
    │ │ Header Analyzer      │    │
    │ │ - Security headers   │    │
    │ │ - Configuration gaps │    │
    │ └──────────────────────┘    │
    └────────────┬─────────────────┘
                 │
                 │
     ┌───────────▼────────────┐
     │  Target Web App        │
     │ (Under Security Test)  │
     └────────────────────────┘

    File Storage:
    ├── reports/
    │   └── scan_*.json (Scan results)
    └── templates/ (Report templates)
```

### Component Breakdown

#### 1. **Flask Web Application** (`app/app.py`)
**Purpose**: Serve web interface and manage scan operations

**Routes**:
- `GET /` - Dashboard homepage
- `POST /api/scan` - Start new scan
- `GET /api/scans` - List all scans
- `GET /api/scan/<id>` - Get scan details
- `GET /api/stats` - Get statistics
- `GET /scan/<id>` - View full report
- `DELETE /api/scan/<id>/delete` - Delete scan

**Features**:
- Request validation
- Scan orchestration
- Result storage
- Error handling
- Session management

#### 2. **Vulnerability Scanner** (`scanners/vulnerability_scanner.py`)
**Purpose**: Perform actual vulnerability detection

**Key Classes**:
- `VulnerabilityScanner` - Main scanning engine

**Key Methods**:
- `crawl_forms()` - Extract forms from target
- `test_xss()` - Test for XSS vulnerabilities
- `test_sqli()` - Test for SQL injection
- `test_csrf()` - Test for CSRF vulnerabilities
- `test_security_headers()` - Check for security headers
- `scan_target()` - Execute complete scan

**Payloads**:
- XSS: Script tags, event handlers, JavaScript URLs
- SQLi: OR conditions, UNION statements, comments
- CSRF: Form method checking, token detection

#### 3. **Frontend Components**

**Templates** (`app/templates/`):
- `dashboard.html` - Main UI with scan form
- `report.html` - Detailed scan report view
- `error.html` - Error page

**Static Files** (`app/static/`):
- `css/style.css` - Complete styling (responsive)
- `js/main.js` - Frontend logic and API calls

**Features**:
- Form submission and validation
- Real-time statistics display
- AJAX-based scan results
- Report visualization
- Scan history management
- Export functionality

---

## 🔄 Scan Workflow

### Detailed Scan Process

```
1. USER INITIATES SCAN
   └─ Enters target URL
   └─ Selects test types
   └─ Clicks "Start Scan"
          │
          ▼
2. REQUEST PROCESSING (Flask)
   └─ Validate URL format
   └─ Create unique scan ID
   └─ Initialize scanner object
          │
          ▼
3. TARGET RECONNAISSANCE
   └─ Fetch target homepage
   └─ Parse HTML with BeautifulSoup
   └─ Extract all forms
   └─ Identify input fields
          │
          ▼
4. VULNERABILITY TESTING
   ├─ XSS Testing
   │  └─ For each input field:
   │     └─ For each XSS payload:
   │        └─ Submit payload
   │        └─ Check response for payload
   │        └─ Analyze patterns
   │        └─ Log if vulnerable
   │
   ├─ SQLi Testing
   │  └─ For each input field:
   │     └─ For each SQLi payload:
   │        └─ Submit payload
   │        └─ Check for SQL errors
   │        └─ Check status code
   │        └─ Log if vulnerable
   │
   ├─ CSRF Testing
   │  └─ For each form:
   │     └─ Check form method (POST/PUT/DELETE)
   │     └─ Check for CSRF token field
   │     └─ Log if token missing
   │
   └─ Security Headers Testing
      └─ Fetch response headers
      └─ Check for required headers
      └─ Log missing headers
          │
          ▼
5. RESULT AGGREGATION
   └─ Compile all findings
   └─ Assign severity levels
   └─ Calculate statistics
   └─ Generate summary
          │
          ▼
6. STORAGE & PERSISTENCE
   └─ Save results to JSON file
   └─ Store in memory
   └─ Update statistics
          │
          ▼
7. RESPONSE TO USER
   └─ Return results as JSON
   └─ Render report template
   └─ Display in web interface
```

---

## 📊 Data Models

### Scan Results Structure
```json
{
  "scan_id": "550e8400-e29b-41d4-a716-446655440000",
  "target": "https://example.com",
  "scan_time": "2025-11-26T10:30:00.000000",
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
      "parameter": "user_id",
      "payload": "' OR '1'='1",
      "severity": "CRITICAL",
      "evidence": "MySQL error: You have an error in your SQL...",
      "status_code": 500
    }
  ]
}
```

### Vulnerability Record
```json
{
  "type": "String (vulnerability type)",
  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "parameter": "String (affected parameter)",
  "payload": "String (test payload used)",
  "description": "String (detailed description)",
  "evidence": "String (response evidence)",
  "timestamp": "ISO 8601 datetime"
}
```

---

## 🔍 Detection Algorithms

### XSS Detection Algorithm
```python
Algorithm: XSSDetector
Input: URL, parameters
Output: List of vulnerabilities

1. FOR EACH input parameter:
   2. FOR EACH XSS payload:
      3. CREATE test request with payload
      4. SEND request to target
      5. GET response body
      6. IF payload in response:
         7. LOG as vulnerability
         8. CAPTURE evidence
      9. ELSE IF XSS patterns match:
         10. LOG as vulnerability
         11. CAPTURE evidence
   12. CONTINUE with next payload
13. RETURN vulnerabilities list
```

### SQLi Detection Algorithm
```python
Algorithm: SQLiDetector
Input: URL, parameters
Output: List of vulnerabilities

1. FOR EACH input parameter:
   2. FOR EACH SQLi payload:
      3. CREATE test request with payload
      4. SEND request to target
      5. GET response body and status
      6. IF SQL error patterns detected:
         7. LOG as vulnerability
         8. CAPTURE evidence
      9. ELSE IF HTTP 500 status:
         10. LOG as potential vulnerability
         11. CAPTURE evidence
   12. CONTINUE with next payload
13. RETURN vulnerabilities list
```

### CSRF Detection Algorithm
```python
Algorithm: CSRFDetector
Input: Forms list
Output: List of vulnerabilities

1. FOR EACH form:
   2. GET form method (GET, POST, PUT, DELETE)
   3. IF method in [POST, PUT, DELETE]:
      4. SEARCH form inputs for CSRF token
      5. IF token field NOT found:
         6. LOG as CSRF vulnerability
         7. CAPTURE form details
   8. CONTINUE with next form
9. RETURN vulnerabilities list
```

---

## 🛡️ Security Headers Analysis

### Checked Headers
| Header | Purpose | Severity if Missing |
|--------|---------|-------------------|
| X-Content-Type-Options | Prevent MIME sniffing | MEDIUM |
| X-Frame-Options | Prevent clickjacking | MEDIUM |
| Strict-Transport-Security | Force HTTPS | MEDIUM |
| Content-Security-Policy | XSS prevention | HIGH |
| X-XSS-Protection | Browser XSS filter | MEDIUM |

### Detection Pattern
```
Required Headers = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-XSS-Protection'
]

For header in Required Headers:
    If header NOT in response headers:
        Log as vulnerability
        Severity = MEDIUM
```

---

## 📈 Severity Classification

### CRITICAL (Score: 10)
- **SQLi**: Allows database manipulation
- **RCE**: Remote code execution
- **Impact**: Complete system compromise

### HIGH (Score: 7-9)
- **XSS**: Session hijacking, data theft
- **CSRF**: Unauthorized state changes
- **Impact**: User account compromise

### MEDIUM (Score: 4-6)
- **Missing Security Headers**: Configuration gaps
- **Information Disclosure**: Sensitive data exposure
- **Impact**: Increased attack surface

### LOW (Score: 1-3)
- **Deprecated Components**: End-of-life software
- **Configuration Issues**: Non-critical settings
- **Impact**: Minor security concerns

---

## 🔌 API Specification

### POST /api/scan
**Purpose**: Start a new vulnerability scan

**Request**:
```json
{
  "target_url": "https://example.com",
  "test_xss": true,
  "test_sqli": true,
  "test_csrf": true,
  "test_headers": true
}
```

**Response (Success)**:
```json
{
  "success": true,
  "scan_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": { /* Full results object */ }
}
```

**Response (Error)**:
```json
{
  "error": "Error message"
}
```

### GET /api/scans
**Purpose**: List all historical scans

**Response**:
```json
{
  "success": true,
  "scans": [
    {
      "scan_id": "...",
      "target": "...",
      "scan_time": "...",
      "status": "completed",
      "total_vulnerabilities": 5,
      "critical": 1,
      "high": 2,
      "medium": 2,
      "low": 0
    }
  ],
  "total_scans": 1
}
```

---

## 🧪 Testing Payloads

### XSS Payloads Tested
1. `<script>alert("XSS")</script>`
2. `"><script>alert("XSS")</script>`
3. `';alert('XSS');//`
4. `<img src=x onerror=alert("XSS")>`
5. `<svg onload=alert("XSS")>`
6. `javascript:alert("XSS")`
7. `<iframe src=javascript:alert("XSS")>`
8. `<body onload=alert("XSS")>`

### SQLi Payloads Tested
1. `' OR '1'='1`
2. `' OR 1=1--`
3. `' OR 1=1/*`
4. `admin' --`
5. `1' UNION SELECT NULL--`
6. `' AND '1'='1`
7. `' AND SLEEP(5)--`
8. `1' AND SLEEP(5)--`

---

## 📊 Performance Considerations

### Scan Duration Factors
- Number of forms on page
- Number of input fields
- Payload count (8-15 per vulnerability type)
- Target response time
- Network latency

### Typical Scan Times
- Simple site (10 forms, 20 inputs): 30-60 seconds
- Medium site (30 forms, 50 inputs): 1-2 minutes
- Complex site (100+ forms): 3-5 minutes

### Optimization Strategies
1. Parallel requests (future enhancement)
2. Payload deduplication
3. Early termination on detection
4. Caching of form analysis
5. Request throttling

---

## 🔐 Limitations & Considerations

### Scanner Limitations
1. **Basic Detection Only**: No advanced analysis
2. **False Positives**: May occur with certain responses
3. **Session Handling**: No cookie/session support (yet)
4. **JavaScript Rendering**: No dynamic content rendering
5. **Rate Limiting**: No built-in rate limiting
6. **Timeout Handling**: Fixed timeout values

### Legal & Ethical Considerations
1. **Authorization Required**: Only authorized testing
2. **Responsible Disclosure**: Report findings properly
3. **DoS Prevention**: Minimal impact on target
4. **Data Privacy**: Don't store sensitive data
5. **Compliance**: Follow legal regulations

### Detection Gaps
- **OWASP #4**: Insecure Design (architectural flaw)
- **OWASP #7**: Authentication (complex testing)
- **OWASP #8**: Software Integrity (dependency analysis)
- **OWASP #10**: SSRF (context-dependent)

---

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] Cookie and session handling
- [ ] Selenium-based JavaScript rendering
- [ ] Concurrent scan execution
- [ ] Database persistence (SQLite/PostgreSQL)
- [ ] User authentication
- [ ] Role-based access control
- [ ] Scheduled scans
- [ ] Email reporting

### Phase 3 Features
- [ ] Advanced XXE detection
- [ ] Deserialization testing
- [ ] File upload vulnerability scanning
- [ ] API endpoint mapping
- [ ] Custom payload management
- [ ] Vulnerability remediation automation
- [ ] CI/CD integration
- [ ] Docker containerization

### Phase 4 Features
- [ ] Machine learning-based detection
- [ ] Behavioral analysis
- [ ] Threat intelligence integration
- [ ] Custom rule engine
- [ ] Advanced reporting (PDF, Excel)
- [ ] Multi-user collaboration
- [ ] Scan scheduling and automation

---

## 📚 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend | Python 3.8+ | Server logic |
| Web Framework | Flask 2.3.0 | Web application |
| HTTP Client | Requests 2.31.0 | Target communication |
| HTML Parser | BeautifulSoup4 4.12.0 | Form extraction |
| Frontend | HTML5 | Markup |
| Styling | CSS3 | Responsive design |
| Scripting | JavaScript (Vanilla) | UI interactions |
| Storage | JSON | Result persistence |

---

## 🎓 Learning Outcomes

Students completing this project will understand:

1. **Web Security Concepts**
   - XSS vulnerabilities and prevention
   - SQL injection attacks and defenses
   - CSRF attacks and protection
   - Security headers and their importance

2. **Web Development Skills**
   - Flask framework development
   - REST API design and implementation
   - Frontend with HTML/CSS/JavaScript
   - Responsive web design

3. **Software Engineering Practices**
   - Modular code architecture
   - Error handling and logging
   - Testing and validation
   - Documentation practices

4. **Security Testing Methodology**
   - Payload crafting
   - Response analysis
   - Pattern matching
   - Evidence gathering

---

## 📄 Conclusion

This Web Application Vulnerability Scanner provides a practical, hands-on learning experience in web application security. It demonstrates how vulnerabilities can be detected through automated testing and provides a complete system for managing security assessments.

The project successfully combines:
- Robust backend scanning capabilities
- User-friendly web interface
- Comprehensive reporting
- Educational value

This foundation can be extended with more advanced features as needed for specific security assessment requirements.

---

**Document Version**: 1.0
**Last Updated**: November 26, 2025
**Status**: Complete & Production Ready
