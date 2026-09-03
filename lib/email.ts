import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM || "Tržby <noreply@barbertrzby.cz>",
    to,
    subject: "Reset your Tržby password",
    html: `
      <p>Someone requested a password reset for your Tržby account.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM || "Tržby <noreply@barbertrzby.cz>",
    to,
    subject: "Confirm your Tržby account",
    html: `
      <p>Welcome to Tržby! Confirm your email address to activate your account.</p>
      <p><a href="${verifyUrl}">Click here to verify your email</a>. This link expires in 24 hours.</p>
      <p>If you didn't create this account, you can safely ignore this email.</p>
    `,
  });
}
