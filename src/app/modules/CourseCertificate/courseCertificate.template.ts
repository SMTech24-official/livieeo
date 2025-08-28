export const certificateHTML = (p: {
  studentName: string;
  courseTitle: string;
  mentorName: string;
  dateStr: string;
  certificateNo: string;
  qrDataUrl: string;
  brand?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Certificate</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Open+Sans:wght@400;600;700&display=swap');

  @page { size: A4; margin: 0; }
  html, body { margin:0; padding:0; }
  body {
    width: 210mm; height: 297mm; 
    font-family: 'Open Sans', sans-serif;
    background: #f4f4f9;
  }
  .wrap {
    position: relative;
    width: 190mm; height: 277mm; margin: 10mm auto;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  }
  /* Gold Gradient Frame */
  .frame {
    position: absolute; inset: 0;
    padding: 10px;
    background: linear-gradient(135deg, #FFD700, #FFB800, #FFC966);
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  .inner {
    position: absolute; inset: 10px;
    background: white; border-radius: 12px;
    padding: 40px 48px 32px;
    overflow: hidden;
  }
  /* Watermark Logo */
  .wm {
    position:absolute; inset: 0; pointer-events:none; opacity:.05;
    display:flex; justify-content:center; align-items:center;
    font-size:200px; font-weight:700; color:#ffd700;
    transform: rotate(-30deg);
  }
  .brand {
    display:flex; align-items:center; gap:10px;
    letter-spacing:2px; font-weight:bold; font-size:14px; color:#475569;
  }
  .title {
    text-align:center; margin-top:14mm;
    font-size:50px; letter-spacing:3px; font-family:'Playfair Display', serif; color:#1f2937;
  }
  .subtitle { text-align:center; color:#64748b; margin-top:6px; font-size:18px; }
  .name {
    text-align:center; margin-top:20mm; font-size:44px; font-family:'Playfair Display', serif; color:#111827;
    text-transform: uppercase;
  }
  .line { width: 130mm; height:3px; background:#e2e8f0; margin:12px auto 0; border-radius:2px; }
  .course {
    text-align:center; margin-top:12mm; font-size:20px; color:#334155;
    line-height:1.6;
  }
  .badge {
    display:inline-block; padding:10px 18px; border-radius:999px;
    background: linear-gradient(90deg,#fcd34d,#f59e0b);
    color:#1f2937; font-weight:700; font-size:14px; letter-spacing:1px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .meta {
    margin-top:24mm; display:flex; justify-content:space-between; align-items:flex-end;
    font-size:13px; color:#475569;
  }
  .meta .block { display:flex; flex-direction:column; }
  .meta .val { font-weight:700; color:#0f172a; margin-top:2px; }
  .sign {
    margin-top:20mm; display:flex; justify-content:space-between; align-items:center;
  }
  .sign .box {
    width:70mm; text-align:center;
  }
  .sign .bar { height:2px; background:#e2e8f0; margin-bottom:6px; }
  .qr { width: 30mm; height:30mm; border-radius:4px; border:1px solid #e2e8f0; }
  .foot {
    position:absolute; left:0; right:0; bottom:0;
    background:#f4f4f9; border-top:1px solid #e2e8f0; padding:12px 48px; font-size:12px; color:#64748b;
    display:flex; justify-content:space-between;
  }
  /* Ribbon for course */
  .ribbon {
    display:inline-block; margin-top:8px; padding:6px 16px; font-size:14px; font-weight:700;
    color:#111827; background: linear-gradient(90deg,#fde68a,#fbbf24);
    border-radius:999px; box-shadow:0 4px 6px rgba(0,0,0,0.1);
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="frame"></div>
  <div class="wm">${p.brand ?? "LIVIEEO"}</div>
  <div class="inner">
    <div class="brand">${p.brand ?? "LIVIEEO ACADEMY"}</div>

    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is to certify that</div>

    <div class="name">${p.studentName}</div>
    <div class="line"></div>

    <div class="course">
      has successfully completed the course<br/>
      <span class="ribbon">${p.courseTitle}</span><br/>
      under the guidance of <b>${p.mentorName}</b>.
    </div>

    <div class="meta">
      <div class="block">
        <div>Certificate No</div>
        <div class="val">${p.certificateNo}</div>
      </div>
      <img class="qr" src="${p.qrDataUrl}" />
      <div class="block" style="text-align:right;">
        <div>Issued On</div>
        <div class="val">${p.dateStr}</div>
      </div>
    </div>

    <div class="sign">
      <div class="box">
        <div class="bar"></div>
        <div>Program Director</div>
      </div>
      <div class="box">
        <div class="bar"></div>
        <div>Head of Academics</div>
      </div>
    </div>

    <div class="foot">
      <div>${p.courseTitle}</div>
      <div>Verify: scan QR or visit portal</div>
    </div>
  </div>
</div>
</body>
</html>
`;