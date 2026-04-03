import nodemailer from 'nodemailer';

const user = (process.env.EMAIL_USER || "").replace(/"/g, "");
const pass = (process.env.EMAIL_PASSWORD || "").replace(/"/g, "");

const createTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};

export const sendConfirmationEmail = async (email: string, name: string, type: string) => {
    console.log(`[Email] Attempting to send ${type} confirmation email to: ${email}`);

    if (!user || !pass) {
        console.error("[Email] EMAIL_USER or EMAIL_PASSWORD is missing!");
        return { success: false, error: "Credentials missing" };
    }

    const transporter = createTransporter();

    try {
        const subject = type === "Inquiry Form"
            ? "Inquiry Received - Paarsh Infotech"
            : "Thank you for contacting Paarsh Infotech";

        const mailOptions = {
            from: `"Paarsh Infotech" <${user}>`,
            to: email,
            subject: subject,
            replyTo: user,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">Hello ${name},</h2>
          <p>Thank you for reaching out to <strong>Paarsh Infotech</strong>!</p>
          <p>We have successfully received your ${type === "Inquiry Form" ? "course inquiry" : "message"}. Our team is reviewing your details and will get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #777;">
            Best Regards,<br />
            <strong>The Paarsh Infotech Team</strong><br />
            <a href="https://paarshinfotech.com" style="color: #007bff; text-decoration: none;">paarshinfotech.com</a>
          </p>
        </div>
      `,
        };

        console.log(`[Email] Sending confirmation mail via Gmail SMTP...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("[Email] Confirmation sent successfully:", info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error("[Email] Nodemailer confirmation error:", error);
        return { success: false, error };
    }
};

export const sendAdminNotificationEmail = async (data: any) => {
    const { name, email, phone, message, course, type } = data;
    console.log(`[Email] Attempting to send Admin Notification for ${type} from: ${email}`);

    if (!user || !pass) {
        console.error("[Email] EMAIL_USER or EMAIL_PASSWORD is missing!");
        return { success: false, error: "Credentials missing" };
    }

    const transporter = createTransporter();

    try {
        const mailOptions = {
            from: `"Website Notification" <${user}>`,
            to: user, // Send to yourself
            subject: `New ${type}: ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2B4278; border-bottom: 2px solid #01A0E2; padding-bottom: 10px;">New ${type} Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${course ? `<p><strong>Interested Course:</strong> ${course}</p>` : ''}
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #999;">Sent from Paarsh E-learning Website</p>
        </div>
      `,
        };

        console.log(`[Email] Sending admin notification via Gmail SMTP...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("[Email] Admin notification sent successfully:", info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error("[Email] Nodemailer admin error:", error);
        return { success: false, error };
    }
};