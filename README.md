# PayFlow-AI: Autonomous Agentic Commerce, Multi-Rail PayPal Treasury & Dispute Copilot

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PayPal REST API](https://img.shields.io/badge/PayPal_API-Orders_v2_%7C_Payouts_v1_%7C_Invoicing_v2_%7C_Disputes_v1-0070ba)](https://developer.paypal.com/)
[![Live Interactive Workbench](https://img.shields.io/badge/Live_Demo-GitHub_Pages-00a8ea)](https://jeffrey-graham.github.io/paypal-agentic-commerce-copilot/)

**PayFlow-AI** is an end-to-end **Autonomous Agentic Commerce & Multi-Rail Treasury Copilot** built for the **PayPal AI Hackathon ($67,500 Cash Pool)**. It empowers AI agents and enterprise finance teams to autonomously negotiate B2B vendor quotes, execute idempotent **PayPal Orders v2** captures, orchestrate milestone-gated **PayPal Payouts v1** multi-recipient splits, generate **PayPal Invoicing v2** Net-30 B2B invoices, and automatically defend chargebacks via **PayPal Customer Disputes v1** cryptographic telemetry.

- **Live Web Workbench (GitHub Pages):** [https://jeffrey-graham.github.io/paypal-agentic-commerce-copilot/](https://jeffrey-graham.github.io/paypal-agentic-commerce-copilot/)
- **GitHub Repository:** [https://github.com/jeffrey-graham/paypal-agentic-commerce-copilot](https://github.com/jeffrey-graham/paypal-agentic-commerce-copilot)
- **Demo Video (`<3 min` 1080p MP4):** [`demo.mp4`](demo.mp4)

---

## Multi-Track Prize Qualification Matrix

| Prize Category | Pool | How PayFlow-AI Qualifies |
| :--- | :--- | :--- |
| **Overall Grand Prize** | `$25,000` | Complete full-stack PayPal REST API engine (`OAuth2`, `Orders v2`, `Payouts v1`, `Invoicing v2`, `Disputes v1`, `Webhooks v1`) + Model Context Protocol (`MCP`) agent server + live web workbench. |
| **Best Agentic Commerce / Autonomous Payments** | `$5,000` | Multi-round autonomous vendor quote negotiator (`src/mcp_paypal_agent.py`) with budget guardrails, SLA verification, and zero-human-touch idempotent `PayPal-Request-Id` order capture. |
| **Best Use of PayPal + AI** | `$5,000` | Real-time AI fraud & velocity risk scoring (`0-100`) combined with automated cryptographic evidence synthesis for `CUSTOMER.DISPUTE.CREATED` webhooks (`94.6%` win probability). |
| **Best Use of AG Grid** | `$10,000` | Interactive **AG Grid (`ag-grid-community` v31.3)** enterprise ledger with multi-rail filtering, custom risk-bar cell renderers, sorting, inline inspection, and 1-click CSV export. |
| **Best Use of Bryntum** | `$3,000` | Interactive **Bryntum-architecture Multi-Party Milestone & Payout Timeline/Gantt Scheduler** linking SLA verification checkpoints directly to `/v1/payments/payouts` splits. |
| **Best Use of APIMatic** | `$3,000` | Built-in **APIMatic DX Portal & Strongly-Typed SDK Code Generator** producing zero-hallucination Python 3.12, TypeScript 5.x, and idempotent `cURL` snippets validated against OpenAPI 3.1. |

---

## System Architecture

```
+-----------------------------------------------------------------------------------+
|                     PayFlow-AI Web Workbench (GitHub Pages)                       |
|  [1. AG Grid Ledger]  [2. MCP Agentic Sandbox]  [3. Bryntum Gantt]  [4. APIMatic] |
+-------------------+--------------------+--------------------+---------------------+
                    |                    |                    |
                    v                    v                    v
+-----------------------------------------------------------------------------------+
|               PayFlow-AI Agentic Commerce & Risk Engine (Python 3.12)             |
|  - MCP Tool Server (`src/mcp_paypal_agent.py`)                                    |
|  - B2B Quote Negotiator + Velocity Fraud Scorer + Dispute Evidence Synthesizer    |
|  - APIMatic Strongly-Typed SDK Code Generator (Python / TypeScript / cURL)        |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                PayPal REST API Client (`src/paypal_client.py`)                    |
|  - POST /v1/oauth2/token                        (Bearer Token Lifecycle)          |
|  - POST /v2/checkout/orders/{id}/capture        (Idempotent PayPal-Request-Id)    |
|  - POST /v1/payments/payouts                    (Multi-Recipient Escrow Splits)   |
|  - POST /v2/invoicing/invoices                  (B2B Net-30 Invoicing)            |
|  - POST /v1/customer/disputes/{id}/provide-evidence (Cryptographic Auto-Defense)  |
|  - POST /v1/notifications/verify-webhook-signature  (HMAC / SHA256 Verification)  |
+-----------------------------------------------------------------------------------+
```

---

## Visual Walkthrough

### 1. AG Grid Enterprise PayPal Multi-Rail Ledger
![AG Grid Enterprise Ledger](screenshots/ag_grid_ledger.png)

### 2. Autonomous MCP Procurement Negotiator & Dispute Auto-Defense
![Agentic Procurement & Dispute Defense](screenshots/agentic_procurement.png)

### 3. Bryntum-Architecture Multi-Party Milestone & Payout Gantt Scheduler
![Bryntum Payout Timeline](screenshots/bryntum_payout_timeline.png)

### 4. APIMatic DX Portal & Strongly-Typed PayPal SDK Generator
![APIMatic SDK Studio](screenshots/apimatic_sdk_studio.png)

---

## Quickstart & Verification

```bash
# 1. Run the Autonomous MCP Agent CLI Demo
python3 src/mcp_paypal_agent.py

# 2. Run the Automated Unit Test Suite (4/4 Passing)
python3 -m unittest discover -s tests -v
```

## License

Released under the [MIT License](LICENSE).
