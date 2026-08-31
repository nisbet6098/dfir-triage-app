# 🛡️ NTCyber Interactive DFIR Triage App

An interactive, high-performance Digital Forensics & Incident Response (DFIR) triage application engineered for security analysts and incident responders. Built as a lightweight, zero-dependency web interface designed to accelerate host containment, volatile memory capture, and artifact analysis during live security incidents.

---

## 🚀 Key Features

* **Interactive Triage Playbooks:** Dynamic decision paths for Ransomware containment, Volatile Memory forensics, Phishing payload analysis, and Network exfiltration.
* **Command & CLI Helper:** Instant, copy-paste execution commands tailored for Windows CLI, PowerShell, Linux, Volatility 2/3, and specialized IR tools.
* **Artifact Locators:** Interactive lookup engine for core operating system artifacts (Windows Event Logs, Registry, MFT, Linux syslog/auth logs, volatile RAM structures).
* **Ultra-Lightweight Architecture:** Vanilla HTML5, CSS3, and ES6 JavaScript engine—zero heavy framework overhead, near-instant load times, and complete portability.

---

## 🏗️ Technical Architecture

| Component | Technology |
| :--- | :--- |
| **Front-End UI** | HTML5 / Modern CSS Variables (Dark Cybersecurity Theme) |
| **Triage Engine** | Vanilla ES6 JavaScript (`triage-engine.js`, `app.js`) |
| **Data Schema** | Modular JSON Stores (`playbooks.json`, `artifacts.json`, `commands.json`) |
| **Web Server** | Nginx Alpine Docker Container |
| **Ingress & Proxy** | Traefik Reverse Proxy (`dfir.ntcyber.com`) |

---

## 🛠️ Deployment & Infrastructure

### Server Directory Path
`/mnt/storage/docker/public-web-stack/dfir_site`

### Container Management
To restart or redeploy the stack:
```bash
docker compose down
docker compose up -d
🔒 License & Ownership
Maintained under the NTCyber ecosystem (ntcyber.com). Designed with modular decoupling to support standalone migration or independent host deployment.
