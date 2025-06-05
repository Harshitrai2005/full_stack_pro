export function generateVerificationOtpEmailTemplate(otp){
    return `
    <div style="background-color:#f4f6f8;padding:20px;font-family:Arial,sans-serif;">
      <div style="max-width:500px;margin:auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="margin-top:0;">OTP Verification</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#007bff;margin:20px 0;">
        ${otp}</div>
        <p>This OTP is valid for the next 15 minutes. Do not share it with anyone.</p>
        <p style="font-size:12px;color:#888;margin-top:30px;">
          If you didn’t request this, you can safely ignore this email.<br><br>
          – BOOKWORM LIBRARY MANAGEMENT SYSTEM
        </p>
      </div>
    </div>
  `
}


export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
  return `<div style="background-color:#f4f6f8;padding:20px;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="margin-top:0;">Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to set a new one:</p>
    
    <div style="text-align:center;margin:30px 0;">
      <a href="${resetPasswordUrl}" style="background-color:#007bff;color:#fff;text-decoration:none;padding:12px 24px;border-radius:5px;display:inline-block;font-size:16px;">
        Reset Password
      </a>
    </div>

    <p>This link will expire in 15 minutes for your security. If you didn’t request a password reset, please ignore this email.</p>

    <p style="font-size:12px;color:#888;margin-top:30px;">
      – BOOKWORM LIBRARY MANAGEMENT SYSTEM
    </p>
  </div>
</div>

  `
}