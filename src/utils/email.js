const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send quotation email to company
 */
const sendQuotationEmail = async ({ userName, userEmail, userPhone, userLocation, message, products, isCart = false }) => {
  const transporter = createTransporter();

  const productList = Array.isArray(products)
    ? products.map(p => `
      <tr>
        <td style="padding:8px;border:1px solid #2a3a4a;">${p.name}</td>
        <td style="padding:8px;border:1px solid #2a3a4a;">${p.category || 'N/A'}</td>
        <td style="padding:8px;border:1px solid #2a3a4a;">${p.quantity || 1}</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:8px;border:1px solid #2a3a4a;">${products}</td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background:#0a1628; color:#e0e8f0; margin:0; padding:0; }
        .container { max-width:650px; margin:30px auto; background:#0d1f35; border:1px solid #1a3a5c; border-radius:8px; overflow:hidden; }
        .header { background:linear-gradient(135deg,#0a3060,#0d4a8a); padding:30px; text-align:center; }
        .header h1 { margin:0; color:#00d4ff; font-size:26px; letter-spacing:3px; }
        .header p { color:#8ab4d4; margin:5px 0 0; font-size:13px; }
        .body { padding:30px; }
        .section-title { color:#00d4ff; font-size:14px; letter-spacing:2px; text-transform:uppercase; border-bottom:1px solid #1a3a5c; padding-bottom:8px; margin-bottom:16px; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
        .info-item label { display:block; color:#5a8aaa; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
        .info-item span { color:#e0e8f0; font-size:14px; }
        table { width:100%; border-collapse:collapse; margin-bottom:24px; }
        th { background:#0a3060; color:#00d4ff; padding:10px 8px; text-align:left; font-size:12px; letter-spacing:1px; border:1px solid #1a3a5c; }
        .message-box { background:#0a1628; border:1px solid #1a3a5c; border-radius:4px; padding:14px; color:#c0d4e8; font-size:14px; line-height:1.6; }
        .footer { background:#060f1e; padding:16px 30px; text-align:center; color:#3a5a7a; font-size:12px; }
        .badge { display:inline-block; background:#00d4ff22; color:#00d4ff; border:1px solid #00d4ff44; border-radius:4px; padding:3px 10px; font-size:11px; letter-spacing:1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⬡ AUTOFORGE</h1>
          <p>DEFENCE DRONE TECHNOLOGY</p>
        </div>
        <div class="body">
          <div style="margin-bottom:20px;">
            <span class="badge">${isCart ? 'CART QUOTATION' : 'PRODUCT QUOTATION'}</span>
          </div>
          
          <div class="section-title">Client Information</div>
          <div class="info-grid">
            <div class="info-item"><label>Name</label><span>${userName}</span></div>
            <div class="info-item"><label>Email</label><span>${userEmail}</span></div>
            <div class="info-item"><label>Phone</label><span>${userPhone}</span></div>
            <div class="info-item"><label>Location</label><span>${userLocation}</span></div>
          </div>

          <div class="section-title">Requested Products</div>
          <table>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
            </tr>
            ${productList}
          </table>

          ${message ? `
          <div class="section-title">Additional Message</div>
          <div class="message-box">${message}</div>
          ` : ''}
        </div>
        <div class="footer">
          This quotation request was submitted via autoforge.com · ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Autoforge Website" <${process.env.EMAIL_USER}>`,
    to: process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL,
    subject: `[Quotation Request] ${isCart ? 'Cart Order' : products} — ${userName}`,
    html,
  });
};

/**
 * Send service/training quotation email
 */
const sendServiceQuotationEmail = async ({ userName, userEmail, userPhone, userLocation, message, serviceName }) => {
  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background:#0a1628; color:#e0e8f0; }
        .container { max-width:600px; margin:30px auto; background:#0d1f35; border:1px solid #1a3a5c; border-radius:8px; overflow:hidden; }
        .header { background:linear-gradient(135deg,#0a3060,#0d4a8a); padding:28px; text-align:center; }
        .header h1 { margin:0; color:#00d4ff; font-size:24px; letter-spacing:3px; }
        .body { padding:28px; }
        .label { color:#5a8aaa; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
        .value { color:#e0e8f0; font-size:14px; margin-bottom:16px; }
        .service-badge { background:#00ff8822; color:#00ff88; border:1px solid #00ff8844; border-radius:4px; padding:4px 12px; font-size:12px; display:inline-block; margin-bottom:20px; }
        .message-box { background:#0a1628; border:1px solid #1a3a5c; border-radius:4px; padding:14px; font-size:14px; line-height:1.6; }
        .footer { background:#060f1e; padding:14px; text-align:center; color:#3a5a7a; font-size:12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>⬡ AUTOFORGE</h1><p style="color:#8ab4d4;margin:4px 0 0;font-size:13px;">SERVICE ENQUIRY</p></div>
        <div class="body">
          <div class="service-badge">SERVICE: ${serviceName}</div>
          <div class="label">Client Name</div><div class="value">${userName}</div>
          <div class="label">Email</div><div class="value">${userEmail}</div>
          <div class="label">Phone</div><div class="value">${userPhone}</div>
          <div class="label">Location</div><div class="value">${userLocation}</div>
          ${message ? `<div class="label">Message</div><div class="message-box">${message}</div>` : ''}
        </div>
        <div class="footer">${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Autoforge Website" <${process.env.EMAIL_USER}>`,
    to: process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL,
    subject: `[Service Enquiry] ${serviceName} — ${userName}`,
    html,
  });
};

module.exports = { sendQuotationEmail, sendServiceQuotationEmail };
