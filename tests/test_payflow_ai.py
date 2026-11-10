#!/usr/bin/env python3
"""
Unit & Integration Test Suite for PayFlow-AI (`src/paypal_client.py` & `src/mcp_paypal_agent.py`).
Run with: python3 -m unittest discover -s tests -v
"""

from __future__ import annotations

import unittest

from src.mcp_paypal_agent import AgenticCommerceCopilot, MCP_PAYPAL_TOOLS
from src.paypal_client import PayPalDeveloperClient


class TestPayFlowAI(unittest.TestCase):
    def setUp(self) -> None:
        self.client = PayPalDeveloperClient()
        self.copilot = AgenticCommerceCopilot(self.client)

    def test_oauth2_and_orders_v2_create_and_capture(self) -> None:
        auth = self.client.authenticate_oauth2()
        self.assertIn("access_token", auth)
        self.assertEqual(auth["token_type"], "Bearer")

        order = self.client.create_order_v2(
            amount_value="850.00",
            currency_code="USD",
            merchant_reference="REF-1001",
            description="AI Agent SaaS License",
        )
        self.assertEqual(order["status"], "CREATED")
        self.assertTrue(order["id"].startswith("ORD-"))

        captured = self.client.capture_order_v2(order["id"])
        self.assertEqual(captured["status"], "COMPLETED")
        breakdown = captured["capture_details"]["seller_receivable_breakdown"]
        self.assertEqual(breakdown["gross_amount"]["value"], "850.00")
        self.assertGreater(float(breakdown["net_amount"]["value"]), 820.0)

    def test_agentic_commerce_negotiation_and_payout_batch(self) -> None:
        res = self.copilot.negotiate_and_settle_procurement(
            vendor_name="NeuralData Corp",
            vendor_email="billing@neuraldata.example.com",
            initial_ask_usd=2000.00,
            target_budget_usd=1750.00,
            deliverable_description="Fine-tuning Dataset Shard #9",
        )
        self.assertLess(res["agreed_settlement_usd"], 2000.00)
        self.assertGreater(res["negotiated_savings_usd"], 200.00)
        self.assertEqual(res["paypal_order_v2"]["status"], "COMPLETED")
        self.assertEqual(
            res["paypal_payout_v1"]["batch_header"]["batch_status"], "SUCCESS"
        )
        self.assertEqual(
            res["ai_risk_evaluation"]["agent_decision"], "AUTO_APPROVE_SETTLEMENT"
        )

    def test_invoicing_v2_and_disputes_v1_auto_defense(self) -> None:
        inv = self.client.create_invoice_v2(
            invoice_number="INV-2026-901",
            recipient_email="cfo@enterprise.example.com",
            items=[
                {
                    "name": "Autonomous AI Treasury Subscription",
                    "quantity": "2",
                    "unit_amount": {"currency_code": "USD", "value": "450.00"},
                }
            ],
        )
        self.assertEqual(inv["status"], "SENT")
        self.assertEqual(inv["amount"]["value"], "900.00")

        disp = self.copilot.auto_defend_chargeback_dispute(
            dispute_id="PP-D-40192",
            order_id="ORD-8819201",
            buyer_claim_reason="ITEM_NOT_RECEIVED",
            carrier_name="UPS Next Day Air",
            tracking_number="1Z999AA10123456784",
        )
        self.assertEqual(disp["paypal_dispute_response"]["status"], "UNDER_REVIEW")
        self.assertGreater(disp["win_probability_pct"], 90.0)

    def test_webhook_signature_and_apimatic_sdk_generator(self) -> None:
        wh = self.client.verify_webhook_signature(
            transmission_id="tx-991",
            timestamp="2026-11-10T10:00:00Z",
            webhook_id="WH-2026",
            event_body='{"event_type":"PAYMENT.CAPTURE.COMPLETED"}',
        )
        self.assertEqual(wh["verification_status"], "SUCCESS")

        py_sdk = self.copilot.generate_apimatic_sdk_snippet(language="python")
        ts_sdk = self.copilot.generate_apimatic_sdk_snippet(language="typescript")
        self.assertIn("PaypalServersdkClient", py_sdk)
        self.assertIn("@paypal/paypal-server-sdk", ts_sdk)
        self.assertEqual(len(MCP_PAYPAL_TOOLS), 3)


if __name__ == "__main__":
    unittest.main()
