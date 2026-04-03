import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (email: string, name: string, type: string) => {
    console.log(`[Email] Attempting to send ${type} email to: ${email}`);

    // Create transporter inside the function to ensure a fresh connection
    // (Prevents stale connections in some Next.js environments)
    const user = (process.env.EMAIL_USER || "").replace(/"/g, "");
    const pass = (process.env.EMAIL_PASSWORD || "").replace(/"/g, "");

    console.log(`[Email] Using credentials for: ${user}`);
    if (!pass) {
        console.error("[Email] EMAIL_PASSWORD is missing or empty!");
    }

    // const transporter = nodemailer.createTransport({
    //     host: "smtp.hostinger.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: user,
    //         pass: pass,
    //     },
    // });
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false, // ✅ ADD THIS
        },
    });

    try {
        const subject = type === "Inquiry Form"
            ? "Inquiry Received - Paarsh Infotech"
            : "Thank you for contacting Paarsh Infotech";

        const mailOptions = {
            from: `"Paarsh Infotech" <info@paarshelearning.com>`,
            to: email,
            subject: subject,
            replyTo: "info@paarshelearning.com",
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

        console.log(`[Email] Sending mail via Hostinger SMTP...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("[Email] Message sent successfully:", info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error("[Email] Nodemailer error:", error);
        return { success: false, error };
    }
};