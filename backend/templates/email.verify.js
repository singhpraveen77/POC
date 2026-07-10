export const verifyEmailTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:40px 0;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center" style="background:#2563eb;padding:30px;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
Verify Your Email
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#1f2937;">
Hello ${name},
</h2>

<p style="font-size:16px;color:#4b5563;line-height:28px;">
Welcome! Thank you for registering.
To complete your account verification, please use the One-Time Password (OTP) below.
</p>

<!-- OTP Box -->
<table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin:35px auto;">
<tr>
<td align="center"
style="
background:#eff6ff;
border:2px dashed #2563eb;
padding:20px 40px;
border-radius:12px;
font-size:36px;
font-weight:bold;
letter-spacing:10px;
color:#2563eb;">
${otp}
</td>
</tr>
</table>

<p style="font-size:15px;color:#6b7280;text-align:center;">
This OTP is valid for <strong>10 minutes</strong>.
</p>

<p style="font-size:15px;color:#6b7280;line-height:26px;">
Please do not share this code with anyone.
Our team will never ask you for your OTP.
</p>

<p style="font-size:15px;color:#6b7280;line-height:26px;">
If you didn't request this email, you can safely ignore it.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f9fafb;padding:25px;text-align:center;">

<p style="margin:0;font-size:13px;color:#9ca3af;">
This is an automated email. Please do not reply.
</p>

<p style="margin-top:10px;font-size:13px;color:#9ca3af;">
© ${new Date().getFullYear()} Your Company. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};