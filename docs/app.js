// PayFlow-AI Interactive Frontend Engine
// Supports AG Grid Ledger, Agentic Commerce MCP Sandbox, Bryntum Milestone Gantt, and APIMatic SDK Studio

const LEDGER_ROWS = [
  {
    id: "ORD-83BC0476AA403",
    rail: "ORDERS_V2",
    counterparty: "CloudGPU Cluster Node (us-east)",
    amount: 1258.00,
    savings: 192.00,
    riskScore: 11.4,
    status: "COMPLETED",
    requestId: "pp-req-99412a-01",
    timestamp: "2026-11-10 09:12:04 UTC"
  },
  {
    id: "PAYOUT-683CD93488230",
    rail: "PAYOUTS_V1",
    counterparty: "Multi-Party GPU Compute & Audit Split (3 Recipients)",
    amount: 1258.00,
    savings: 0.00,
    riskScore: 8.2,
    status: "COMPLETED",
    requestId: "pp-req-99412a-02",
    timestamp: "2026-11-10 09:12:19 UTC"
  },
  {
    id: "INV-B2B-7741902C",
    rail: "INVOICING_V2",
    counterparty: "Anthropic Enterprise Token Pool (Net-30)",
    amount: 1995.00,
    savings: 405.00,
    riskScore: 14.8,
    status: "COMPLETED",
    requestId: "pp-req-99412a-03",
    timestamp: "2026-11-10 09:18:45 UTC"
  },
  {
    id: "PP-D-88104B2190",
    rail: "DISPUTES_V1",
    counterparty: "Chargeback Defense: MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
    amount: 840.00,
    savings: 840.00,
    riskScore: 22.5,
    status: "UNDER_REVIEW",
    requestId: "pp-req-99412a-04",
    timestamp: "2026-11-10 09:24:11 UTC"
  },
  {
    id: "ORD-91FA8231CC901",
    rail: "ORDERS_V2",
    counterparty: "Snowflake Realtime ETL Stream Cluster",
    amount: 912.00,
    savings: 138.00,
    riskScore: 9.7,
    status: "COMPLETED",
    requestId: "pp-req-99412a-05",
    timestamp: "2026-11-10 09:31:50 UTC"
  },
  {
    id: "PAYOUT-119EF0024B",
    rail: "PAYOUTS_V1",
    counterparty: "Autonomous Bug Bounty & Security Audit Escrow Split",
    amount: 3450.00,
    savings: 310.00,
    riskScore: 16.1,
    status: "PENDING_MILESTONE",
    requestId: "pp-req-99412a-06",
    timestamp: "2026-11-10 09:35:02 UTC"
  }
];

const BRYNTUM_TASKS = [
  {
    resource: "Milestone 1: GPU Cluster Provisioning",
    role: "merchant-compute@payflow.ai (70% Share)",
    startPct: 2,
    widthPct: 30,
    color: "linear-gradient(135deg, #0070ba, #00a8ea)",
    label: "PAYOUT-M1 • $880.60 CAPTURED (SLA 99.8%)",
    status: "RELEASED"
  },
  {
    resource: "Milestone 2: Model Weights Verification",
    role: "ml-auditor@payflow.ai (20% Share)",
    startPct: 32,
    widthPct: 28,
    color: "linear-gradient(135deg, #10b981, #059669)",
    label: "PAYOUT-M2 • $251.60 RELEASED (SHA-256 Verified)",
    status: "RELEASED"
  },
  {
    resource: "Milestone 3: Zero-Downtime Cutover",
    role: "sre-escrow@payflow.ai (10% Holdback)",
    startPct: 60,
    widthPct: 34,
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    label: "PAYOUT-M3 • $125.80 SCHEDULED (T+48h Holdback)",
    status: "SCHEDULED"
  },
  {
    resource: "Dispute Defense Watchdog",
    role: "PayPal Disputes v1 Auto-Responder",
    startPct: 12,
    widthPct: 78,
    color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    label: "CONTINUOUS SLA & CARRIER PROOF STREAM (Win Prob: 94.6%)",
    status: "ACTIVE"
  }
];

let selectedRowIndex = 0;
let sortAscending = false;

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  const btn = document.getElementById(`tabbtn-${tabId}`);
  const panel = document.getElementById(`panel-${tabId}`);
  if (btn) btn.classList.add("active");
  if (panel) panel.classList.add("active");
}

function renderAgGrid() {
  const query = (document.getElementById("ag-search")?.value || "").toLowerCase();
  const railFilter = document.getElementById("ag-rail-filter")?.value || "ALL";

  const filtered = LEDGER_ROWS.filter(row => {
    const matchesRail = railFilter === "ALL" || row.rail === railFilter;
    const matchesQuery =
      row.id.toLowerCase().includes(query) ||
      row.counterparty.toLowerCase().includes(query) ||
      row.rail.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query);
    return matchesRail && matchesQuery;
  });

  const container = document.getElementById("ag-grid-container");
  if (!container) return;

  let html = `
    <table class="ag-native-table">
      <thead>
        <tr>
          <th>PayPal ID</th>
          <th>API Rail</th>
          <th>Counterparty / Autonomous Memo</th>
          <th>Amount (USD)</th>
          <th>AI Savings</th>
          <th>AI Risk Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  filtered.forEach((r, idx) => {
    const pillClass =
      r.status === "COMPLETED"
        ? "pill-completed"
        : r.status === "UNDER_REVIEW"
        ? "pill-dispute"
        : "pill-pending";
    const riskColor = r.riskScore < 15 ? "#10b981" : r.riskScore < 30 ? "#f59e0b" : "#f43f5e";

    html += `
      <tr onclick="selectLedgerRow(${idx})" style="cursor:pointer;">
        <td style="font-family:monospace; font-weight:700; color:#38bdf8;">${r.id}</td>
        <td><span class="badge badge-paypal">${r.rail}</span></td>
        <td>${r.counterparty}</td>
        <td style="font-weight:700;">$${r.amount.toFixed(2)}</td>
        <td style="color:#34d399; font-weight:700;">+$${r.savings.toFixed(2)}</td>
        <td>
          <div style="font-size:11.5px; font-weight:700;">${r.riskScore.toFixed(1)} / 100</div>
          <div class="risk-bar"><div class="risk-fill" style="width:${Math.min(100, r.riskScore * 2.5)}%; background:${riskColor};"></div></div>
        </td>
        <td><span class="pill ${pillClass}">${r.status}</span></td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  selectLedgerRow(0);
}

function selectLedgerRow(idx) {
  selectedRowIndex = idx;
  const row = LEDGER_ROWS[idx] || LEDGER_ROWS[0];
  const inspector = document.getElementById("inspector-details");
  const payloadBox = document.getElementById("payload-preview");
  if (!inspector || !payloadBox) return;

  inspector.innerHTML = `
    <div class="log-item">
      <strong>Transaction ID:</strong> ${row.id} (${row.rail})<br/>
      <strong>Counterparty:</strong> ${row.counterparty}<br/>
      <strong>Idempotency Header:</strong> <code>PayPal-Request-Id: ${row.requestId}</code><br/>
      <strong>AI Fraud &amp; Velocity Decision:</strong> <span style="color:#34d399; font-weight:700;">AUTO_APPROVE (Risk=${row.riskScore}/100)</span>
    </div>
  `;

  const samplePayload = {
    endpoint:
      row.rail === "ORDERS_V2"
        ? "POST /v2/checkout/orders/{id}/capture"
        : row.rail === "PAYOUTS_V1"
        ? "POST /v1/payments/payouts"
        : row.rail === "INVOICING_V2"
        ? "POST /v2/invoicing/invoices"
        : "POST /v1/customer/disputes/{id}/provide-evidence",
    headers: {
      Authorization: "Bearer A21AAK89...OAuth2",
      "PayPal-Request-Id": row.requestId,
      "Content-Type": "application/json"
    },
    id: row.id,
    status: row.status,
    amount: { currency_code: "USD", value: row.amount.toFixed(2) },
    agentic_metadata: {
      ai_negotiated_discount_usd: row.savings.toFixed(2),
      risk_score: row.riskScore,
      mcp_tool_verified: true,
      timestamp: row.timestamp
    }
  };
  payloadBox.textContent = JSON.stringify(samplePayload, null, 2);
}

function sortByRisk() {
  sortAscending = !sortAscending;
  LEDGER_ROWS.sort((a, b) => (sortAscending ? a.riskScore - b.riskScore : b.riskScore - a.riskScore));
  renderAgGrid();
}

function exportAgGridCsv() {
  const headers = ["ID", "Rail", "Counterparty", "Amount_USD", "Savings_USD", "Risk_Score", "Status", "Request_ID"];
  const lines = [headers.join(",")];
  LEDGER_ROWS.forEach(r => {
    lines.push([r.id, r.rail, `"${r.counterparty}"`, r.amount, r.savings, r.riskScore, r.status, r.requestId].join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payflow_ai_paypal_ledger.csv";
  a.click();
}

function renderNegotiationLog() {
  const box = document.getElementById("agent-negotiation-log");
  if (!box) return;
  box.innerHTML = `
    <div class="log-item">
      <strong>[Round 1 • Vendor Quote Received]</strong> CloudGPU Cluster Node quoted <code>$1,450.00 USD</code> (Buyer Cap: <code>$1,300.00 USD</code>, Reliability SLA: <code>99.4%</code>).
    </div>
    <div class="log-item">
      <strong>[Round 2 • MCP AI Counter-Offer]</strong> PayFlow-AI proposed instant OAuth2 capture + zero-chargeback cryptographic SLA telemetry in exchange for a 13.2% enterprise volume discount.
    </div>
    <div class="log-item">
      <strong>[Round 3 • Settlement &amp; PayPal Capture]</strong> Counterparty accepted <code>$1,258.00 USD</code> (Saved <code>+$192.00 USD</code>). Captured via <code>POST /v2/checkout/orders/ORD-83BC0476AA403/capture</code>.
    </div>
  `;
}

function executeVendorNegotiation() {
  const val = document.getElementById("vendor-select")?.value || "VND-AWS-GPU|1850|1600|0.996";
  const [vendor, askStr, capStr, slaStr] = val.split("|");
  const ask = parseFloat(askStr);
  const cap = parseFloat(capStr);
  const settled = +(cap * 0.96).toFixed(2);
  const saved = +(ask - settled).toFixed(2);
  const newOrderId = "ORD-" + Math.random().toString(16).substring(2, 10).toUpperCase();

  LEDGER_ROWS.unshift({
    id: newOrderId,
    rail: "ORDERS_V2",
    counterparty: `${vendor} (Autonomous MCP Procurement)`,
    amount: settled,
    savings: saved,
    riskScore: 10.2,
    status: "COMPLETED",
    requestId: "pp-req-" + Math.random().toString(16).substring(2, 8),
    timestamp: new Date().toISOString()
  });

  const box = document.getElementById("agent-negotiation-log");
  if (box) {
    box.innerHTML =
      `<div class="log-item"><strong>[NEW AUTONOMOUS CAPTURE • ${newOrderId}]</strong> Negotiated <code>${vendor}</code> from <code>$${ask.toFixed(2)}</code> down to <code>$${settled.toFixed(2)} USD</code> (Saved <code>+$${saved.toFixed(2)}</code>, SLA=${slaStr}). Immediate PayPal Orders v2 capture succeeded!</div>` +
      box.innerHTML;
  }
  renderAgGrid();
}

function triggerAutonomousProcurement() {
  executeVendorNegotiation();
}

function triggerDisputeDefense() {
  const pane = document.getElementById("dispute-json-pane");
  if (!pane) return;
  const pkg = {
    dispute_id: "PP-D-88104B2190",
    endpoint: "POST /v1/customer/disputes/PP-D-88104B2190/provide-evidence",
    status: "UNDER_REVIEW",
    evidence_type: "PROOF_OF_FULFILLMENT",
    carrier_name: "FEDEX_AIR",
    tracking_number: "FX-992018442-US",
    cryptographic_delivery_receipt_sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    server_access_logs_verified: true,
    estimated_win_probability: 0.946,
    submitted_at: "2026-11-10T09:24:11Z"
  };
  pane.textContent = JSON.stringify(pkg, null, 2);
}

function renderBryntumScheduler() {
  const board = document.getElementById("bryntum-board");
  if (!board) return;
  let html = `
    <div class="bryntum-header">
      <div>Escrow Resource / Payee</div>
      <div>T+0h (Order Capture)</div>
      <div>T+12h (Provision)</div>
      <div>T+24h (QA Audit)</div>
      <div>T+36h (Staging)</div>
      <div>T+48h (Cutover)</div>
      <div>T+72h (Final Settlement)</div>
    </div>
  `;
  BRYNTUM_TASKS.forEach(t => {
    html += `
      <div class="bryntum-row">
        <div class="bryntum-resource">
          ${t.resource}
          <span>${t.role}</span>
        </div>
        <div class="bryntum-track">
          <div class="bryntum-task" style="left:${t.startPct}%; width:${t.widthPct}%; background:${t.color};">
            <span>${t.label}</span>
            <span style="background:rgba(0,0,0,0.28); padding:2px 7px; border-radius:999px;">${t.status}</span>
          </div>
        </div>
      </div>
    `;
  });
  board.innerHTML = html;
}

function advanceMilestoneGantt() {
  BRYNTUM_TASKS[2].status = "RELEASED";
  BRYNTUM_TASKS[2].color = "linear-gradient(135deg, #10b981, #059669)";
  BRYNTUM_TASKS[2].label = "PAYOUT-M3 • $125.80 RELEASED (100% SLA Verified)";
  renderBryntumScheduler();
}

function renderApimaticSdk() {
  const lang = document.getElementById("sdk-lang")?.value || "python";
  const op = document.getElementById("sdk-op")?.value || "orders_v2";
  const codeBox = document.getElementById("apimatic-code-box");
  const summaryBox = document.getElementById("apimatic-validation-summary");
  if (!codeBox || !summaryBox) return;

  const snippets = {
    python: `# Generated by APIMatic v3.1 CodeGen for PayPal Agentic Commerce
from paypal_agentic_sdk.client import PayPalAgenticClient
from paypal_agentic_sdk.models import OrderRequest, PurchaseUnit, Money

client = PayPalAgenticClient(
    client_id="PAYPAL_SANDBOX_CLIENT_ID",
    client_secret="PAYPAL_SANDBOX_SECRET",
    environment="sandbox",
    retry_config={"max_retries": 3, "backoff_factor": 0.5}
)

order = client.orders_v2.create_and_capture(
    paypal_request_id="pp-req-99412a-01",
    body=OrderRequest(
        intent="CAPTURE",
        purchase_units=[
            PurchaseUnit(
                custom_id="VND-AWS-GPU",
                description="Autonomous MCP CloudGPU Node (${op})",
                amount=Money(currency_code="USD", value="1258.00")
            )
        ]
    )
)
print(f"Captured PayPal Order: {order.id} | Status: {order.status}")`,
    typescript: `// Generated by APIMatic TypeScript SDK Generator (@apimatic/core)
import { Client, OrdersController, OrderIntent } from '@payflow-ai/paypal-apimatic-sdk';

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
  },
  timeout: 15000
});

const ordersController = new OrdersController(client);
const { result } = await ordersController.createOrder({
  paypalRequestId: 'pp-req-99412a-01',
  body: {
    intent: OrderIntent.Capture,
    purchaseUnits: [{
      customId: 'VND-AWS-GPU',
      amount: { currencyCode: 'USD', value: '1258.00' }
    }]
  }
});
console.log('Captured Idempotent Order:', result.id);`,
    curl: `curl -X POST "https://api-m.sandbox.paypal.com/v2/checkout/orders" \\
  -H "Authorization: Bearer A21AAK89_OAUTH2_TOKEN" \\
  -H "PayPal-Request-Id: pp-req-99412a-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "intent": "CAPTURE",
    "purchase_units": [{
      "custom_id": "VND-AWS-GPU",
      "description": "PayFlow-AI Agentic Settlement",
      "amount": { "currency_code": "USD", "value": "1258.00" }
    }]
  }'`
  };

  codeBox.textContent = snippets[lang] || snippets.python;
  summaryBox.innerHTML = `
    <div class="log-item">
      <strong>OpenAPI 3.1 Spec Compliance:</strong> 100% Validated against PayPal Orders v2, Payouts v1, Invoicing v2 &amp; Customer Disputes v1 schemas.
    </div>
    <div class="log-item">
      <strong>Idempotency &amp; Retry Guardrails:</strong> Automatic <code>PayPal-Request-Id</code> UUIDv4 injection prevents duplicate captures on network retries.
    </div>
    <div class="log-item">
      <strong>MCP Tool Binding:</strong> Exposes 4 strongly-typed Model Context Protocol tools with deterministic JSON Schema validation.
    </div>
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get("tab");
  renderAgGrid();
  renderNegotiationLog();
  triggerDisputeDefense();
  renderBryntumScheduler();
  renderApimaticSdk();
  if (requestedTab) {
    switchTab(requestedTab);
  }
});
