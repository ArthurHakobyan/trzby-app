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

export async function sendVerificationEmail(to: string, verifyUrl: string, lang: "en" | "cs" = "cs") {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const content = lang === "en"
    ? {
        subject: "Confirm your Tržby account",
        html: `
          <p>Welcome to Tržby! Confirm your email address to activate your account.</p>
          <p><a href="${verifyUrl}">Click here to verify your email</a>. This link expires in 24 hours.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
          <p>Don't see this email? Check your spam or junk folder.</p>
        `,
      }
    : {
        subject: "Potvrďte svůj účet Tržby",
        html: `
          <p>Vítejte v Tržby! Potvrďte svou e-mailovou adresu a aktivujte si účet.</p>
          <p><a href="${verifyUrl}">Klikněte sem a ověřte svůj e-mail</a>. Odkaz vyprší za 24 hodin.</p>
          <p>Pokud jste si tento účet nevytvořili, tento e-mail můžete bez obav ignorovat.</p>
          <p>Nevidíte tento e-mail? Zkontrolujte složku Spam nebo Nevyžádaná pošta.</p>
        `,
      };

  await resend.emails.send({
    from: process.env.RESEND_FROM || "Tržby <noreply@barbertrzby.cz>",
    to,
    ...content,
  });
}
