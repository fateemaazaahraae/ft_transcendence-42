import nodemailer from "nodemailer"

console.log("----> EMAIL_USER:", process.env.EMAIL_USER);
console.log("----> EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "MISSING");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function send2FACode(Email, Code) {
    console.log("Sending 2FA to:", Email, "Code:", Code);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject: "Your 2FA Verification Code",
        text: `Your verification code is: ${Code}`
    })
}

export function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password reset request",
        text: `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,

    })
}