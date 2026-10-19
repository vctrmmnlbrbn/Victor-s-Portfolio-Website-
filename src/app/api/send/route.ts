import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const allowedRecipients = new Set([
  'victoremmanuelburbano@gmail.com',
  'victoremmanuelburbano@outlook.com',
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim().toLowerCase(),
].filter((recipient): recipient is string => Boolean(recipient)));

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (
      typeof to !== 'string' ||
      typeof subject !== 'string' ||
      typeof html !== 'string' ||
      !subject.trim() ||
      !html.trim()
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const recipient = to.trim().toLowerCase();
    if (!allowedRecipients.has(recipient)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipient' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: recipient,
      subject: subject.trim().replace(/[\r\n]+/g, ' '),
      html,
    });

    if (error) {
      console.error('Contact email send failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact email request failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}
