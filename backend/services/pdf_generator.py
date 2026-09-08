"""
Official CERT-In Incident Report PDF Generator for VIGIL.
Generates a downloadable, high-fidelity statutory Annexure-1 PDF document.
"""
import io
import os
from datetime import datetime
from typing import Dict, Any

class CertInPDFBuilder:
    def __init__(self, incident_data: Dict[str, Any]):
        self.data = incident_data
        self.w = 595.28 # A4 width in points
        self.h = 841.89 # A4 height in points
        self.margin_x = 40.0
        self.margin_top = 40.0
        self.content_w = self.w - 2 * self.margin_x
        self.y = self.h - self.margin_top
        self.stream = []

    def _escape(self, text):
        return (str(text).replace('\\', '\\\\')
                         .replace('(', '\\(')
                         .replace(')', '\\)')
                         .replace('\r', ''))

    def draw_header(self):
        # Header Box with CERT-In Banner
        h_box = 65.0
        self.stream.append(f"""
q
0.06 0.09 0.16 rg
{self.margin_x} {self.y - h_box} {self.content_w} {h_box} re f
0.01 0.52 0.78 RG 1.5 w
{self.margin_x} {self.y - h_box} {self.content_w} {h_box} re S
1 1 1 rg
BT
/F2 13 Tf
{self.margin_x + 12} {self.y - 24} Td
(INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)) Tj
ET
0.22 0.74 0.97 rg
BT
/F2 9.5 Tf
{self.margin_x + 12} {self.y - 40} Td
(CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1) Tj
ET
0.58 0.64 0.72 rg
BT
/F1 7 Tf
{self.margin_x + 12} {self.y - 54} Td
(Mandatory statutory reporting under Section 70B of IT Act 2000 & CERT-In Directions 2022) Tj
ET
Q
""")
        self.y -= (h_box + 14)

    def draw_section_title(self, title):
        self.stream.append(f"""
q
0.01 0.52 0.78 rg
{self.margin_x} {self.y - 12} 3 12 re f
0.06 0.09 0.16 rg
BT
/F2 9.5 Tf
{self.margin_x + 8} {self.y - 10.5} Td
({self._escape(title)}) Tj
ET
Q
""")
        self.y -= 18

    def draw_field_row(self, label, value, is_highlight=False):
        val_str = str(value)
        self.stream.append(f"""
q
0.96 0.97 0.99 rg
{self.margin_x} {self.y - 15} {self.content_w} 15 re f
0.88 0.91 0.94 RG 0.5 w
{self.margin_x} {self.y - 15} {self.content_w} 15 re S
0.3 0.35 0.42 rg
BT
/F2 7.5 Tf
{self.margin_x + 6} {self.y - 11} Td
({self._escape(label)}:) Tj
ET
{'0.8 0.1 0.1 rg' if is_highlight else '0.06 0.09 0.16 rg'}
BT
/{'F2' if is_highlight else 'F1'} 7.5 Tf
{self.margin_x + 180} {self.y - 11} Td
({self._escape(val_str[:70])}) Tj
ET
Q
""")
        self.y -= 17

    def draw_footer(self):
        self.stream.append(f"""
q
0.88 0.91 0.94 RG 0.5 w
{self.margin_x} 30 m {self.w - self.margin_x} 30 l S
0.5 0.55 0.65 rg
BT
/F1 6.5 Tf
{self.margin_x} 20 Td
(Generated automatically by VIGIL AI Tier-1 SOC Analyst | Sealed under SHA-256 Hash Chain) Tj
{self.w - self.margin_x - 70} 20 Td
(CERT-In 6-Hour Filing) Tj
ET
Q
""")

    def build_pdf(self) -> bytes:
        self.draw_header()
        
        sc = self.data.get("scenario") or self.data or {}
        mat = self.data.get("step1_materiality") or {}
        exp = self.data.get("step3_exposure") or {}
        inc_id = sc.get("incident_id") or self.data.get("incident_id", "INC-2026-0902-01")
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        # Section 1: Organisation
        self.draw_section_title("1. ORGANISATION PARTICULARS & NODAL CONTACT")
        self.draw_field_row("Name of Organisation", "Apex Commercial Bank of India Ltd")
        self.draw_field_row("Sector / Regulatory Body", "Banking & Financial Services (RBI Supervised)")
        self.draw_field_row("CISO Nodal Officer Contact", "ciso-office@apexbank.in | +91-22-6889-0100")
        self.draw_field_row("Reporting Reference ID", inc_id)
        self.y -= 6

        # Section 2: Incident Details
        self.draw_section_title("2. INCIDENT DETECTION & REGULATORY CLASSIFICATION")
        self.draw_field_row("Date & Time of Incident Detection", now_str)
        certin_cat = mat.get("certin_category") or "CIAD-2022-04 Unauthorized Access & Fraud"
        self.draw_field_row("CERT-In Incident Category", certin_cat)
        self.draw_field_row("Regulatory Reporting Window", "Mandatory 6 Hours (CERT-In / RBI Directions)")
        threat_tactic = sc.get("threat_tactic", "T1078 Valid Accounts")
        mitre_id = sc.get("mitre_id", "T1078")
        self.draw_field_row("MITRE ATT&CK Classification", f"{threat_tactic} ({mitre_id})")
        self.draw_field_row("Attacker Source IP(s)", sc.get("attacker_ip", "198.51.100.44"), is_highlight=True)
        self.y -= 6

        # Section 3: Financial & Impact Assessment
        self.draw_section_title("3. RUPEE FINANCIAL EXPOSURE & IMPACT ASSESSMENT")
        direct_inr = exp.get("direct_exposure_inr") or sc.get("direct_exposure_inr") or 0.0
        channel_name = (
            "UPI Bulk Gateway / NPCI Inter-Bank Switch" if inc_id == "INC-2026-0902-01" else
            "NetBanking Web Portal & High-Velocity IMPS" if inc_id == "INC-2026-0902-02" else
            "ATM Switch ISO 8583 Authorization Protocol" if inc_id == "INC-2026-0902-03" else
            "Core Banking System (CBS) Loan Disbursal Engine" if inc_id == "INC-2026-0902-04" else
            "Internal Core Batch Scheduler (Routine Maintenance)"
        )
        self.draw_field_row("Direct Financial Risk (INR)", f"Rs. {direct_inr:,.2f}", is_highlight=(direct_inr > 0))
        aff_count = exp.get("affected_accounts_count") or sc.get("affected_accounts_count") or 18
        self.draw_field_row("Customer Accounts Affected", f"{aff_count} Accounts")
        self.draw_field_row("Payment Channels Impacted", channel_name)
        self.draw_field_row("Core Banking Operational Status", "NORMAL (Unauthorized activity intercepted / neutralized)")
        self.y -= 6

        # Section 4: Containment & Remediation
        self.draw_section_title("4. REMEDIAL & CONTAINMENT ACTIONS TAKEN")
        comp_user = sc.get("compromised_user", "svc_payment_gw")
        att_ip = sc.get("attacker_ip", "198.51.100.44")
        batch_id = sc.get("batch_id", "UPI-BATCH-9921")

        if inc_id == "INC-2026-0902-01":
            self.draw_field_row("Credential Invalidation", f"OAuth2 Bearer Token for '{comp_user}' revoked")
            self.draw_field_row("Perimeter Security Action", f"Null-routed IP '{att_ip}' on edge firewall")
            self.draw_field_row("Payment Settlement Action", f"Batch '{batch_id}' placed on hold in NPCI switch")
        elif inc_id == "INC-2026-0902-02":
            self.draw_field_row("WAF Ingress Defense", f"Geo-IP reputation block enforced for '{att_ip}'")
            self.draw_field_row("IAM Session Termination", "Force password reset on 28 corporate accounts")
            self.draw_field_row("Payment Velocity Action", f"Outbound IMPS queue '{batch_id}' frozen")
        elif inc_id == "INC-2026-0902-03":
            self.draw_field_row("Network Access Control", f"Quarantined switch tap '{att_ip}' to sinkhole VLAN")
            self.draw_field_row("Cryptographic HSM Action", f"Rotated MAC encryption keys for '{batch_id}'")
            self.draw_field_row("ATM Authorization Mode", "Forced 100% synchronous core ledger validation")
        elif inc_id == "INC-2026-0902-04":
            self.draw_field_row("Insider Access Revocation", f"Active Directory & CBS rights revoked for '{comp_user}'")
            self.draw_field_row("Treasury Queue Action", f"Disbursal batch '{batch_id}' suspended")
            self.draw_field_row("AML Beneficiary Lien", "Placed debit freeze on 12 recipient mule accounts")
        else:
            self.draw_field_row("Schedule Correlation", "Validated against CBS monthly maintenance calendar")
            self.draw_field_row("Detection Tuning", "Auto-suppressed Alert Zero trigger as Benign False Positive")
            self.draw_field_row("Operational Status", "Normal banking operations uninterrupted")

        self.draw_field_row("Cryptographic Evidence Status", "SEALED in SHA-256 Hash Chain Ledger (S3 Object Lock)")
        
        self.draw_footer()
        
        page_stream = "".join(self.stream)
        stream_len = len(page_stream.encode('utf-8'))

        # Construct PDF Output
        pdf_out = io.BytesIO()
        pdf_out.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        
        objs = [
            "<< /Type /Catalog /Pages 2 0 R >>",
            "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            f"""<< /Type /Page /Parent 2 0 R
/MediaBox [0 0 {self.w} {self.h}]
/Resources <<
  /Font <<
    /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
    /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
  >>
>>
/Contents 4 0 R >>""",
            f"<< /Length {stream_len} >>\nstream\n{page_stream}\nendstream"
        ]
        
        offsets = []
        for idx, obj in enumerate(objs):
            offsets.append(pdf_out.tell())
            pdf_out.write(f"{idx + 1} 0 obj\n{obj}\nendobj\n".encode('utf-8'))
            
        xref_pos = pdf_out.tell()
        pdf_out.write(f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode('utf-8'))
        for off in offsets:
            pdf_out.write(f"{off:010d} 00000 n \n".encode('utf-8'))
            
        pdf_out.write(f"""trailer
<< /Size {len(objs) + 1}
   /Root 1 0 R
>>
startxref
{xref_pos}
%%EOF
""".encode('utf-8'))
        
        return pdf_out.getvalue()

def generate_certin_pdf(incident_data: Dict[str, Any]) -> bytes:
    builder = CertInPDFBuilder(incident_data)
    return builder.build_pdf()
