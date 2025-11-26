// Main JavaScript for Vulnerability Scanner

// Load statistics on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    
    // Handle scan form submission
    const scanForm = document.getElementById('scan-form');
    if (scanForm) {
        scanForm.addEventListener('submit', handleScanSubmit);
    }
});

/**
 * Load and display statistics
 */
async function loadStatistics() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('total-scans').textContent = data.total_scans;
            document.getElementById('total-vulns').textContent = data.total_vulnerabilities;
            document.getElementById('critical-vulns').textContent = data.critical_vulnerabilities;
            document.getElementById('avg-vulns').textContent = data.average_vulns_per_scan;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

/**
 * Handle scan form submission
 */
async function handleScanSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const targetUrl = document.getElementById('target-url').value;
    const testXss = document.getElementById('test-xss').checked;
    const testSqli = document.getElementById('test-sqli').checked;
    const testCsrf = document.getElementById('test-csrf').checked;
    const testHeaders = document.getElementById('test-headers').checked;
    
    // Disable button and show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Scanning...';
    
    try {
        const response = await fetch('/api/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_url: targetUrl,
                test_xss: testXss,
                test_sqli: testSqli,
                test_csrf: testCsrf,
                test_headers: testHeaders,
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display results
            displayResults(data.results);
            
            // Reload statistics
            loadStatistics();
            
            // Show success message
            showNotification(`Scan completed! Found ${data.results.summary.total} vulnerabilities.`, 'success');
        } else {
            showNotification(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        console.error('Error starting scan:', error);
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Display scan results
 */
function displayResults(results) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    let html = `
        <div class="report-info">
            <div class="info-row">
                <span class="info-label">Target URL:</span>
                <span class="info-value">${escapeHtml(results.target)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Scan Time:</span>
                <span class="info-value">${new Date(results.scan_time).toLocaleString()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Scan ID:</span>
                <span class="info-value">${results.scan_id}</span>
            </div>
        </div>

        <div class="summary-section">
            <h3>Vulnerability Summary</h3>
            <div class="summary-grid">
                <div class="summary-card total">
                    <span class="summary-label">Total Issues</span>
                    <span class="summary-value">${results.summary.total}</span>
                </div>
                <div class="summary-card critical">
                    <span class="summary-label">Critical</span>
                    <span class="summary-value">${results.summary.critical}</span>
                </div>
                <div class="summary-card high">
                    <span class="summary-label">High</span>
                    <span class="summary-value">${results.summary.high}</span>
                </div>
                <div class="summary-card medium">
                    <span class="summary-label">Medium</span>
                    <span class="summary-value">${results.summary.medium}</span>
                </div>
                <div class="summary-card low">
                    <span class="summary-label">Low</span>
                    <span class="summary-value">${results.summary.low}</span>
                </div>
            </div>
        </div>

        <div class="vulnerabilities-section">
            <h3>Detected Vulnerabilities</h3>
    `;
    
    if (results.vulnerabilities && results.vulnerabilities.length > 0) {
        // Group vulnerabilities by severity
        const bySeverity = groupBySeverity(results.vulnerabilities);
        
        // Display CRITICAL
        if (bySeverity.CRITICAL && bySeverity.CRITICAL.length > 0) {
            html += `<h4 class="severity-critical">🔴 CRITICAL (${bySeverity.CRITICAL.length})</h4>`;
            bySeverity.CRITICAL.forEach(vuln => {
                html += createVulnerabilityCard(vuln, 'critical');
            });
        }
        
        // Display HIGH
        if (bySeverity.HIGH && bySeverity.HIGH.length > 0) {
            html += `<h4 class="severity-high">🟠 HIGH (${bySeverity.HIGH.length})</h4>`;
            bySeverity.HIGH.forEach(vuln => {
                html += createVulnerabilityCard(vuln, 'high');
            });
        }
        
        // Display MEDIUM
        if (bySeverity.MEDIUM && bySeverity.MEDIUM.length > 0) {
            html += `<h4 class="severity-medium">🟡 MEDIUM (${bySeverity.MEDIUM.length})</h4>`;
            bySeverity.MEDIUM.forEach(vuln => {
                html += createVulnerabilityCard(vuln, 'medium');
            });
        }
        
        // Display LOW
        if (bySeverity.LOW && bySeverity.LOW.length > 0) {
            html += `<h4 class="severity-low">🟢 LOW (${bySeverity.LOW.length})</h4>`;
            bySeverity.LOW.forEach(vuln => {
                html += createVulnerabilityCard(vuln, 'low');
            });
        }
    } else {
        html += `<p class="no-vulns">✅ No vulnerabilities detected!</p>`;
    }
    
    html += `
            </div>
            <div class="back-link">
                <button class="btn btn-secondary" onclick="location.href='/scan/${results.scan_id}'">View Full Report →</button>
                <button class="btn btn-secondary" onclick="exportReport('${results.scan_id}')" style="margin-left: 0.5rem;">Export JSON</button>
            </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Create vulnerability card HTML
 */
function createVulnerabilityCard(vuln, severity) {
    let html = `<div class="vulnerability-card ${severity}">
        <div class="vuln-header">
            <span class="vuln-type">${escapeHtml(vuln.type)}</span>
            <span class="severity-badge ${severity}">${(vuln.severity || severity).toUpperCase()}</span>
        </div>
        <div class="vuln-details">`;
    
    if (vuln.parameter) {
        html += `<p><strong>Parameter:</strong> ${escapeHtml(vuln.parameter)}</p>`;
    }
    
    if (vuln.payload) {
        html += `<p><strong>Payload:</strong> <code>${escapeHtml(vuln.payload.substring(0, 50))}</code></p>`;
    }
    
    if (vuln.description) {
        html += `<p><strong>Description:</strong> ${escapeHtml(vuln.description)}</p>`;
    }
    
    if (vuln.header) {
        html += `<p><strong>Header:</strong> ${escapeHtml(vuln.header)}</p>`;
    }
    
    if (vuln.evidence) {
        const evidence = typeof vuln.evidence === 'string' ? vuln.evidence : JSON.stringify(vuln.evidence);
        html += `<p><strong>Evidence (first 200 chars):</strong></p>
                <pre class="evidence">${escapeHtml(evidence.substring(0, 200))}</pre>`;
    }
    
    html += `</div></div>`;
    return html;
}

/**
 * Group vulnerabilities by severity
 */
function groupBySeverity(vulnerabilities) {
    const grouped = {
        CRITICAL: [],
        HIGH: [],
        MEDIUM: [],
        LOW: []
    };
    
    vulnerabilities.forEach(vuln => {
        const severity = vuln.severity || 'MEDIUM';
        if (grouped[severity]) {
            grouped[severity].push(vuln);
        }
    });
    
    return grouped;
}

/**
 * Load scan history
 */
async function loadScans() {
    const historySection = document.getElementById('history-section');
    const scansList = document.getElementById('scans-list');
    
    try {
        const response = await fetch('/api/scans');
        const data = await response.json();
        
        if (data.success && data.scans.length > 0) {
            let html = '<div class="scan-list">';
            
            data.scans.forEach(scan => {
                const scanTime = new Date(scan.scan_time);
                html += `
                    <div class="scan-item" onclick="location.href='/scan/${scan.scan_id}'">
                        <div class="scan-info">
                            <div class="scan-target">${escapeHtml(scan.target)}</div>
                            <div class="scan-meta">
                                Scanned on ${scanTime.toLocaleDateString()} at ${scanTime.toLocaleTimeString()}
                            </div>
                        </div>
                        <div class="scan-vulnerabilities">
                            <div class="scan-vuln-count total">
                                <span class="count">${scan.total_vulnerabilities}</span>
                                <span class="label">Total</span>
                            </div>
                            ${scan.critical > 0 ? `
                                <div class="scan-vuln-count critical">
                                    <span class="count">${scan.critical}</span>
                                    <span class="label">Critical</span>
                                </div>
                            ` : ''}
                            ${scan.high > 0 ? `
                                <div class="scan-vuln-count high">
                                    <span class="count">${scan.high}</span>
                                    <span class="label">High</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="scan-actions">
                            <button class="btn btn-secondary" onclick="event.stopPropagation(); exportReport('${scan.scan_id}')">Export</button>
                            <button class="btn btn-secondary" onclick="event.stopPropagation(); deleteScan('${scan.scan_id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            scansList.innerHTML = html;
        } else {
            scansList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No scans yet. Start a new scan to get started.</p>';
        }
        
        historySection.style.display = 'block';
        historySection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error loading scans:', error);
        showNotification('Error loading scan history', 'error');
    }
}

/**
 * Show statistics section
 */
async function showStats() {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth' });
        loadStatistics();
    }
}

/**
 * Export scan report
 */
async function exportReport(scanId) {
    try {
        window.location.href = `/api/report/${scanId}/export`;
        showNotification('Report exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report', 'error');
    }
}

/**
 * Delete a scan
 */
async function deleteScan(scanId) {
    if (!confirm('Are you sure you want to delete this scan?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/scan/${scanId}/delete`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Scan deleted successfully', 'success');
            loadScans();
            loadStatistics();
        } else {
            showNotification(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting scan:', error);
        showNotification('Error deleting scan', 'error');
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
