"""
Convert DEVELOPMENT_GUIDE.md to a styled HTML document and render it to a high-quality PDF via headless Chrome.
"""
import os
import re
import subprocess

def md_to_html(md_text):
    # Escape HTML special chars except for markdown structure
    lines = md_text.split('\n')
    html_lines = []
    in_code_block = False
    code_lang = ""
    code_buffer = []
    in_table = False
    table_buffer = []
    
    for line in lines:
        # Code blocks
        if line.startswith('```'):
            if in_code_block:
                in_code_block = False
                code_content = "\n".join(code_buffer)
                code_buffer = []
                html_lines.append(f'<div class="code-container"><div class="code-header">{code_lang or "code"}</div><pre><code>{escape_html(code_content)}</code></pre></div>')
            else:
                in_code_block = True
                code_lang = line[3:].strip()
                code_buffer = []
            continue
            
        if in_code_block:
            code_buffer.append(line)
            continue
            
        # Tables
        if '|' in line and ('---' in line or line.strip().startswith('|')):
            if not in_table:
                in_table = True
                table_buffer = []
            table_buffer.append(line)
            continue
        else:
            if in_table:
                in_table = False
                html_lines.append(render_table(table_buffer))
                table_buffer = []

        # Headers
        if line.startswith('# '):
            html_lines.append(f'<h1 class="doc-title">{format_inline(line[2:])}</h1>')
        elif line.startswith('## '):
            html_lines.append(f'<h2 class="section-title">{format_inline(line[3:])}</h2>')
        elif line.startswith('### '):
            html_lines.append(f'<h3 class="subsection-title">{format_inline(line[4:])}</h3>')
        elif line.startswith('#### '):
            html_lines.append(f'<h4 class="h4-title">{format_inline(line[5:])}</h4>')
        elif line.startswith('---'):
            html_lines.append('<hr class="divider"/>')
        elif line.startswith('- ') or line.startswith('* '):
            html_lines.append(f'<li class="bullet-item">{format_inline(line[2:])}</li>')
        elif re.match(r'^\d+\.\s', line):
            num = line.split('.')[0]
            content = line[len(num)+2:]
            html_lines.append(f'<div class="numbered-item"><span class="num-badge">{num}</span><span>{format_inline(content)}</span></div>')
        elif line.strip() == '':
            html_lines.append('<div class="spacer"></div>')
        else:
            html_lines.append(f'<p class="paragraph">{format_inline(line)}</p>')

    if in_table:
        html_lines.append(render_table(table_buffer))

    return "\n".join(html_lines)

def escape_html(text):
    return (text.replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;'))

def format_inline(text):
    # Bold italic
    text = re.sub(r'\*\*\*(.*?)\*\*\*', r'<strong><em>\1</em></strong>', text)
    # Bold
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    # Inline code
    text = re.sub(r'`([^`]+)`', r'<code class="inline-code">\1</code>', text)
    return text

def render_table(table_lines):
    if len(table_lines) < 2:
        return ""
    
    headers = [c.strip() for c in table_lines[0].strip().strip('|').split('|')]
    rows = []
    for line in table_lines[2:]:
        if '|' in line:
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            rows.append(cells)
            
    header_html = "".join([f"<th>{format_inline(h)}</th>" for h in headers])
    rows_html = ""
    for row in rows:
        cells_html = "".join([f"<td>{format_inline(c)}</td>" for c in row])
        rows_html += f"<tr>{cells_html}</tr>"
        
    return f'<div class="table-wrapper"><table class="styled-table"><thead><tr>{header_html}</tr></thead><tbody>{rows_html}</tbody></table></div>'

def generate_pdf():
    guide_path = "/Users/nabeelzaidi/Downloads/elastic_hackathon/docs/DEVELOPMENT_GUIDE.md"
    with open(guide_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    body_html = md_to_html(md_content)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VIGIL - Developer & Engineering Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {{
    size: A4;
    margin: 18mm 14mm 18mm 14mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1E293B;
    background-color: #FFFFFF;
    line-height: 1.55;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }}

  .header-banner {{
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0369A1 100%);
    color: #FFFFFF;
    padding: 24px 28px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  }}

  .header-badges {{
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }}

  .badge {{
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 6px;
  }}

  .badge-blue {{ background-color: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); }}
  .badge-green {{ background-color: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.4); }}
  .badge-purple {{ background-color: rgba(168, 85, 247, 0.2); color: #C084FC; border: 1px solid rgba(168, 85, 247, 0.4); }}

  .doc-title {{
    font-size: 20pt;
    font-weight: 800;
    margin: 0 0 6px 0;
    color: #0F172A;
    letter-spacing: -0.5px;
  }}

  .header-banner .doc-title {{
    color: #FFFFFF;
  }}

  .subtitle {{
    font-size: 11pt;
    color: #94A3B8;
    margin: 0;
    font-weight: 500;
  }}

  .section-title {{
    font-size: 13pt;
    font-weight: 700;
    color: #0F172A;
    border-left: 4px solid #0284C7;
    padding-left: 10px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }}

  .subsection-title {{
    font-size: 11pt;
    font-weight: 700;
    color: #1E293B;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}

  .h4-title {{
    font-size: 10pt;
    font-weight: 600;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}

  .paragraph {{
    margin: 6px 0;
    color: #334155;
    font-size: 9.5pt;
  }}

  .divider {{
    border: 0;
    height: 1px;
    background: #E2E8F0;
    margin: 20px 0;
  }}

  .spacer {{
    height: 6px;
  }}

  .bullet-item {{
    margin: 4px 0 4px 18px;
    color: #334155;
    font-size: 9.5pt;
  }}

  .numbered-item {{
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 6px 0;
    font-size: 9.5pt;
    color: #334155;
  }}

  .num-badge {{
    background: #E0F2FE;
    color: #0369A1;
    font-weight: 700;
    font-size: 8pt;
    padding: 2px 7px;
    border-radius: 4px;
    min-width: 20px;
    text-align: center;
  }}

  .inline-code {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8.5pt;
    background-color: #F1F5F9;
    color: #0F172A;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #E2E8F0;
  }}

  .code-container {{
    background-color: #0F172A;
    border-radius: 8px;
    margin: 12px 0;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    page-break-inside: avoid;
  }}

  .code-header {{
    background-color: #1E293B;
    color: #94A3B8;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    font-weight: 600;
    padding: 5px 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #334155;
  }}

  pre {{
    margin: 0;
    padding: 12px 14px;
    overflow-x: auto;
  }}

  code {{
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 8pt;
    color: #E2E8F0;
    line-height: 1.45;
  }}

  .table-wrapper {{
    margin: 14px 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #E2E8F0;
    page-break-inside: avoid;
  }}

  .styled-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
  }}

  .styled-table th {{
    background-color: #F8FAFC;
    color: #0F172A;
    font-weight: 700;
    text-align: left;
    padding: 9px 12px;
    border-bottom: 2px solid #E2E8F0;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }}

  .styled-table td {{
    padding: 8px 12px;
    border-bottom: 1px solid #F1F5F9;
    color: #334155;
    vertical-align: top;
  }}

  .styled-table tr:nth-child(even) {{
    background-color: #FAFAFA;
  }}

  .footer-note {{
    margin-top: 30px;
    padding: 12px 16px;
    background-color: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 8px;
    color: #166534;
    font-size: 8.5pt;
  }}
</style>
</head>
<body>

<div class="header-banner">
  <div class="header-badges">
    <span class="badge badge-blue">Elastic Search AI Platform</span>
    <span class="badge badge-green">AWS Bedrock</span>
    <span class="badge badge-purple">Sarvam AI</span>
  </div>
  <h1 class="doc-title">🛡️ VIGIL: Developer & Engineering Guide</h1>
  <p class="subtitle">Comprehensive Technical Architecture & Implementation Blueprint for Indian BFSI SOC</p>
</div>

{body_html}

<div class="footer-note">
  <strong>VIGIL — Forge the Future Hackathon 2026</strong> | Confidential & Proprietary Team Blueprint | Track 03: Security & AI-Powered SOC
</div>

</body>
</html>"""

    html_path = "/Users/nabeelzaidi/Downloads/elastic_hackathon/docs/DEVELOPMENT_GUIDE.html"
    pdf_path = "/Users/nabeelzaidi/Downloads/elastic_hackathon/docs/VIGIL_Developer_Guide.pdf"

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"✅ Generated styled HTML at {html_path}")

    # Convert to PDF using Google Chrome
    user_data_dir = "/Users/nabeelzaidi/Downloads/elastic_hackathon/scratch_chrome"
    os.makedirs(user_data_dir, exist_ok=True)
    
    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={user_data_dir}",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        f"file://{html_path}"
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"🎉 Successfully rendered beautiful PDF: {pdf_path}")
    else:
        print(f"❌ Error rendering PDF: {res.stderr}")

if __name__ == "__main__":
    generate_pdf()
