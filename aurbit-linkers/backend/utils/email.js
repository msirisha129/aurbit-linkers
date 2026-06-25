const nodemailer = require('nodemailer');

// ──────────────────────────────────────────────
// SMTP Configuration Diagnostics
// ──────────────────────────────────────────────
console.log('\n=== SMTP CONFIGURATION DIAGNOSTICS ===');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '(not set)');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '(not set)');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
console.log('BREVO_SMTP_USER exists:', !!process.env.BREVO_SMTP_USER);
console.log('BREVO_SMTP_KEY exists:', !!process.env.BREVO_SMTP_KEY);
console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '(not set)');

// ──────────────────────────────────────────────
// Determine which SMTP provider to use
// Priority: Brevo SMTP keys > Gmail (EMAIL_HOST)
// ──────────────────────────────────────────────
let smtpHost, smtpPort, smtpUser, smtpPass, smtpProvider;

if (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_KEY) {
  // Brevo SMTP credentials explicitly set
  smtpHost = 'smtp-relay.brevo.com';
  smtpPort = 587;
  smtpUser = process.env.BREVO_SMTP_USER;
  smtpPass = process.env.BREVO_SMTP_KEY;
  smtpProvider = 'Brevo SMTP';
} else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  // Gmail / generic SMTP credentials
  smtpHost = process.env.EMAIL_HOST;
  smtpPort = parseInt(process.env.EMAIL_PORT, 10) || 587;
  smtpUser = process.env.EMAIL_USER;
  smtpPass = process.env.EMAIL_PASS;
  smtpProvider = `Generic SMTP (${smtpHost})`;
} else {
  console.error('=== MISSING SMTP VARIABLES ===');
  console.error('Expected EITHER:');
  console.error('  BREVO_SMTP_USER + BREVO_SMTP_KEY  (for Brevo)');
  console.error('  EMAIL_HOST + EMAIL_USER + EMAIL_PASS  (for Gmail / generic)');
  console.error('None of these sets are fully configured.');
  smtpProvider = 'NONE';
}

const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@aurbitlinkers.com';
const fromName = process.env.EMAIL_FROM_NAME || 'Aurbit Linkers';

console.log('');
console.log('=== RESOLVED SMTP CONFIG ===');
console.log('Provider:', smtpProvider);
console.log('Host:', smtpHost || '(none)');
console.log('Port:', smtpPort || '(none)');
console.log('User:', smtpUser ? smtpUser.substring(0, 4) + '***' : '(none)');
console.log('Pass:', smtpPass ? '****' + smtpPass.slice(-4) : '(none)');
console.log('From:', `"${fromName}" <${fromEmail}>`);
console.log('==============================\n');

// ──────────────────────────────────────────────
// Create transporter (only if credentials exist)
// ──────────────────────────────────────────────
let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  // Startup SMTP verification
  transporter.verify((err, success) => {
    if (err) {
      console.error('SMTP VERIFY FAILED:', err.message || err);
      console.log('SMTP connected: false');
    } else {
      console.log('SMTP READY');
      console.log('SMTP connected: true');
    }
  });
} else {
  console.warn('Transporter NOT created — missing SMTP credentials');
}

// ──────────────────────────────────────────────
// sendResetPasswordEmail — used by auth routes
// ──────────────────────────────────────────────
async function sendResetPasswordEmail(email, name, resetLink) {
  if (!transporter) {
    console.warn('Transporter not configured — skipping send');
    return false;
  }

  try {
    const subject = 'Reset Your Aurbit Linkers Password';
    const htmlContent = `
      <html>
        <body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a;">
          <div style="max-width:600px;margin:0 auto;padding:24px;">
            <div style="text-align:left;padding-bottom:12px;">
              <h2 style="margin:0;color:#0f172a">Aurbit Linkers</h2>
            </div>
            <div style="background:#ffffff;border-radius:10px;padding:20px;border:1px solid #eef2f7">
              <p>Hi ${name || 'there'},</p>
              <p>You recently requested to reset your password for your Aurbit Linkers account. Click the button below to reset it. This link will expire in 1 hour.</p>
              <div style="text-align:center;margin:20px 0;">
                <a href="${resetLink}" style="display:inline-block;padding:12px 22px;background:linear-gradient(90deg,#2563eb,#60a5fa);color:white;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
              </div>
              <p>If the button above does not work, copy and paste the following link into your browser:</p>
              <p style="word-break:break-all;color:#334155;font-size:13px">${resetLink}</p>
              <p style="color:#64748b;font-size:13px">If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin-top:12px">Aurbit Linkers • Support: support@aurbitlinkers.com</p>
          </div>
        </body>
      </html>
    `;

    console.log('Sending SMTP reset email to:', email);
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject,
      html: htmlContent
    });
    console.log('Reset email sent:', info.messageId);
    console.log('Email sent: true');
    return true;
  } catch (err) {
    console.error('SMTP send error:', err?.message || err);
    console.log('Email sent: false');
    return false;
  }
}

// ──────────────────────────────────────────────
// sendTestEmail — called by POST /api/test-email
// ──────────────────────────────────────────────
async function sendTestEmail() {
  if (!transporter) {
    return { ok: false, error: 'Transporter not configured — missing SMTP credentials' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: fromEmail,
      subject: 'Aurbit Linkers - SMTP Test Email',
      html: '<h1>SMTP is working!</h1><p>This is a test email from Aurbit Linkers backend.</p>'
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

module.exports = { sendResetPasswordEmail, sendTestEmail };
