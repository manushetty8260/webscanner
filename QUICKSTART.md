# Quick Start Guide - Web Application Vulnerability Scanner

## ⚡ 5-Minute Setup

### Step 1: Navigate to Project Directory
```powershell
cd e:\scanner
```

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

Wait for installation to complete (1-2 minutes).

### Step 4: Run the Application
```powershell
python app/app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Step 5: Open in Browser
Navigate to: **http://localhost:5000**

You should see the Web Vulnerability Scanner dashboard.

---

## 🔍 First Scan

1. **Enter Target URL**: Type a URL (e.g., `http://testphp.vulnweb.com`)
   - Note: Use test sites with permission only!

2. **Select Tests**:
   - ✓ XSS Detection
   - ✓ SQL Injection
   - ✓ CSRF Detection
   - ✓ Security Headers

3. **Click "Start Scan"**

4. **Wait for Results** (30 seconds - 2 minutes depending on target)

5. **View Results** in the dashboard or click "View Full Report"

---

## 📊 Dashboard Features

| Feature | Purpose |
|---------|---------|
| Statistics Cards | Show total scans and vulnerability counts |
| Scan Form | Enter target URL and select tests |
| Results Section | Displays scan findings with severity |
| History Section | View all previous scans |

---

## 📋 Understanding Results

### Severity Levels
- 🔴 **CRITICAL**: Requires immediate attention (SQLi, RCE)
- 🟠 **HIGH**: Significant risk (XSS, CSRF)
- 🟡 **MEDIUM**: Should be addressed (Missing headers)
- 🟢 **LOW**: Minor issues (Information disclosure)

### Vulnerability Types

**XSS** - Injection of malicious scripts
- Location: Input fields, URL parameters
- Impact: Session theft, credential theft
- Fix: Input validation + output encoding

**SQLi** - Database injection attacks
- Location: Database query parameters
- Impact: Complete data access
- Fix: Parameterized queries (PreparedStatement)

**CSRF** - Unauthorized action execution
- Location: Form submissions
- Impact: Unwanted actions (delete, transfer funds)
- Fix: CSRF tokens in forms

**Missing Headers** - Security configuration gaps
- Location: HTTP response headers
- Impact: Increased attack surface
- Fix: Add security headers (CSP, X-Frame-Options, etc.)

---

## 🧪 Test Targets (with Permission)

### Safe Practice Sites
- http://testphp.vulnweb.com/
- http://dvwa.co.uk/
- https://vulnerablecode.com/

⚠️ **IMPORTANT**: Only test sites you own or have explicit written permission!

---

## 📁 Project Files

```
app/app.py                  ← Main Flask application
app/templates/
  └── dashboard.html        ← Main UI
app/static/
  ├── css/style.css        ← Styling
  └── js/main.js           ← Frontend logic
scanners/
  └── vulnerability_scanner.py  ← Core detection engine
reports/                    ← Scan results storage
requirements.txt            ← Python packages
README.md                   ← Full documentation
QUICKSTART.md              ← This file
```

---

## 🔧 Common Issues & Fixes

### Issue: "Port 5000 already in use"
**Solution**: Use different port
```powershell
# Edit app/app.py last line, change port number
app.run(port=5001)  # instead of 5000
```

### Issue: "ModuleNotFoundError"
**Solution**: Reinstall dependencies
```powershell
pip install --upgrade -r requirements.txt
```

### Issue: "Connection refused"
**Solution**: Ensure app is running and port is correct
```powershell
# Verify Flask is running (should see 127.0.0.1:5000)
# Check browser URL matches port in app.py
```

### Issue: Scan takes too long
**Solution**: App may be scanning intensively
- Wait for current scan to finish
- Try simpler target URL
- Check internet connection

---

## 💡 Tips & Tricks

### Exporting Reports
- Click "Export JSON" to save results
- Use JSON for integration with other tools
- Import into Excel for analysis

### Viewing History
- All scans are saved automatically
- Access history via "History" link
- Delete old scans to free space

### Troubleshooting Scans
- Ensure target URL is valid
- Check firewall allows outbound connections
- Verify website is online and accessible
- Some sites may block scanner requests

---

## 🛑 Stopping the Scanner

### To Stop the App
Press in terminal:
```
CTRL + C
```

### To Deactivate Virtual Environment
```powershell
deactivate
```

---

## 🚀 Next Steps

1. **Run your first scan** on a practice target
2. **Review the detailed report** and understand vulnerabilities
3. **Read the full README.md** for advanced features
4. **Explore the code** to understand how detection works
5. **Customize payloads** for specific targets

---

## 📚 Learning Resources

- Read **README.md** for complete documentation
- Review **vulnerability_scanner.py** to understand detection logic
- Check **app.py** to learn Flask routing
- Examine **style.css** for responsive design techniques
- Study **main.js** for frontend JavaScript patterns

---

## 🔐 Security Reminder

⚠️ **CRITICAL**: 
- Only scan systems you own or have written permission to test
- Unauthorized scanning may violate laws
- Use for educational purposes only
- Respect target server capacity

---

## ✅ Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (pip install -r requirements.txt)
- [ ] Flask app running (python app/app.py)
- [ ] Browser at http://localhost:5000
- [ ] First scan completed successfully
- [ ] Results understood and exported

---

## 📞 Need Help?

1. Check the Troubleshooting section above
2. Review full README.md
3. Verify all files are in correct locations
4. Ensure dependencies are installed
5. Check Flask is running on correct port

---

**Enjoy scanning! Remember to use responsibly.** 🔒
