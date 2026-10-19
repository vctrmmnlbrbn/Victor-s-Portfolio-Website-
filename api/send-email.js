const nodemailer = require('nodemailer');

const allowedRecipients = new Set([
    'victoremmanuelburbano@gmail.com',
    'victoremmanuelburbano@outlook.com',
]);

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeText(value) {
    return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

function sendJson(res, statusCode, payload) {
    Object.entries(getCorsHeaders()).forEach(([header, value]) => {
        res.setHeader(header, value);
    });

    res.status(statusCode).json(payload);
}

function parseBody(body) {
    if (!body) {
        return {};
    }

    if (typeof body === 'string') {
        return JSON.parse(body);
    }

    return body;
}

module.exports = async function handler(req, res) {
    Object.entries(getCorsHeaders()).forEach(([header, value]) => {
        res.setHeader(header, value);
    });

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    try {
        const body = parseBody(req.body);
        const recipient = sanitizeText(body.recipient);
        const recipientLabel = sanitizeText(body.recipientLabel) || 'Portfolio';
        const name = sanitizeText(body.name);
        const email = sanitizeText(body.email);
        const subject = sanitizeText(body.subject);
        const message = String(body.message || '').trim();

        if (!allowedRecipients.has(recipient)) {
            return sendJson(res, 400, { error: 'Invalid recipient.' });
        }

        if (!name || !email || !subject || !message) {
            return sendJson(res, 400, { error: 'Missing required fields.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendJson(res, 400, { error: 'Invalid email address.' });
        }

        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number(process.env.SMTP_PORT || 465);
        const smtpSecure = String(process.env.SMTP_SECURE || 'true') !== 'false';
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const mailFrom = process.env.MAIL_FROM || smtpUser;
        const mailFromName = process.env.MAIL_FROM_NAME || 'Victor Emmanuel Burbano';

        if (!smtpHost || !smtpUser || !smtpPass || !mailFrom) {
            return sendJson(res, 500, { error: 'SMTP is not configured.' });
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const cleanSubject = subject.replace(/[\r\n]+/g, ' ');
        const textBody = [
            `Recipient: ${recipientLabel}`,
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            message,
        ].join('\n');
        const htmlBody = `
            <p><strong>Recipient:</strong> ${escapeHtml(recipientLabel)}</p>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `;

        await transporter.sendMail({
            from: `"${mailFromName}" <${mailFrom}>`,
            to: recipient,
            replyTo: email,
            subject: `[Portfolio] ${cleanSubject}`,
            text: textBody,
            html: htmlBody,
        });

        return sendJson(res, 200, { ok: true });
    } catch (error) {
        console.error('SMTP send failed:', error);
        return sendJson(res, 500, {
            error: 'Failed to send message.',
        });
    }
};
