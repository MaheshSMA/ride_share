const nodemailer = require('nodemailer');

let transporter;

// Initialize test transporter inside async function
async function initMail() {
  try {
    // 1. Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();

    // 2. Create transporter
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Test email account created:");
    console.log("User:", testAccount.user);
    console.log("Pass:", testAccount.pass);
  } catch (error) {
    console.error("Error initializing mail service:", error);
  }
}

// Call the init function immediately
initMail();


// -------------------------
// Send verification email
// -------------------------
const sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    const mailOptions = {
      from: `"Mail EL App" <no-reply@example.com>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial; line-height: 1.6;">
          <h2>Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Click below to verify:</p>
          <a href="${verificationUrl}" 
             style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
            Verify Email
          </a>
          <p>Or paste this link:</p>
          <p>${verificationUrl}</p>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Verification email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};


module.exports = {
  sendVerificationEmail
};
