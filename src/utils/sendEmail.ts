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
        let subject = type === "Inquiry Form"
            ? "Inquiry Received - Paarsh Infotech"
            : "Thank you for contacting Paarsh Infotech";

        let messageBody = `
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
      `;

        if (type === "Course Inquiry") {
            subject = "Course Inquiry Received";
            messageBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #007bff;">Hello ${name},</h2>
              <p>Thank you for your interest in this course.</p>
              <p>Our team will contact you shortly.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 0.9em; color: #777;">
                Best Regards,<br />
                <strong>The Paarsh Infotech Team</strong><br />
                <a href="https://paarshinfotech.com" style="color: #007bff; text-decoration: none;">paarshinfotech.com</a>
              </p>
            </div>
            `;
        }

        const mailOptions = {
            from: `"Paarsh Infotech" <${user}>`,
            to: email,
            subject: subject,
            replyTo: user,
            html: messageBody,
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

export const sendWorkshopRegistrationEmail = async (email: string, name: string, workshopData: any) => {
    const { title, date, time, mode, location, meetingLink } = workshopData;
    const whatsappGroupLink = workshopData.whatsappGroupLink || "https://chat.whatsapp.com/KTnpNJVt2MUIaGz6wzXn65?mode=gi_t";

    console.log(`[Email] Attempting to send Workshop Confirmation for "${title}" to: ${email}`);

    if (!user || !pass) {
        console.error("[Email] EMAIL_USER or EMAIL_PASSWORD is missing!");
        return { success: false, error: "Credentials missing" };
    }

    const transporter = createTransporter();

    // Pre-compute conditional strings to avoid nested template literals
    const isOffline = mode === "offline";
    const meetingLinkHtml = (!isOffline && meetingLink)
        ? '<a href="' + meetingLink + '" class="btn">Join Meeting Link</a>'
        : '';
    
    const venueHtml = (isOffline && location)
        ? '<div class="detail-item"><span class="detail-label">Venue:</span> ' + location + '</div>'
        : '';

    try {
        const mailOptions = {
            from: `"Paarsh Infotech" <${user}>`,
            to: email,
            subject: `Registration Confirmed: ${title} - Paarsh Infotech`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background: #2B4278; color: #ffffff; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 26px; letter-spacing: 1px; }
            .content { padding: 30px; background: #ffffff; }
            .content h2 { color: #2B4278; margin-top: 0; }
            .workshop-card { background: #f8f9fa; border-left: 4px solid #01A0E2; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .workshop-title { font-size: 18px; font-weight: bold; color: #2B4278; margin-bottom: 10px; }
            .detail-item { margin: 8px 0; font-size: 15px; }
            .detail-label { font-weight: bold; color: #555; width: 80px; display: inline-block; }
            .actions { text-align: center; margin-top: 30px; }
            .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #01A0E2 0%, #007bb5 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; margin: 10px; box-shadow: 0 4px 10px rgba(1, 160, 226, 0.25); text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px; }
            .btn-whatsapp { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); box-shadow: 0 4px 10px rgba(37, 211, 102, 0.25); }
            .footer { background: #f1f3f5; padding: 20px; text-align: center; font-size: 0.85em; color: #777; }
            .footer a { color: #01A0E2; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Successful!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Congratulations! You have successfully registered for our upcoming workshop. We are excited to have you join us for this learning experience.</p>
              
              <div class="workshop-card">
                <div class="workshop-title">${title}</div>
                <div class="detail-item"><span class="detail-label">Date:</span> ${date}</div>
                <div class="detail-item"><span class="detail-label">Time:</span> ${time}</div>
                <div class="detail-item"><span class="detail-label">Mode:</span> ${mode === 'offline' ? '🏢 In-Person (Offline)' : '🎥 Online'}</div>
                ${venueHtml}
              </div>

              <p>Please join the official WhatsApp group for all future updates and materials.</p>

              <div class="actions">
                <a href="${whatsappGroupLink}" class="btn btn-whatsapp">Join WhatsApp Group</a>
                ${meetingLinkHtml}
              </div>

              <p style="margin-top: 30px;"><strong>Instructions:</strong></p>
              <ul style="padding-left: 20px;">
                ${mode === 'offline' 
                  ? '<li>Reach the venue 15 minutes before the scheduled time.</li><li>Carry your registration details (this email) for entry.</li>'
                  : '<li>Join the session 10 minutes before the scheduled time.</li><li>Ensure you have a stable internet connection.</li>'}
              </ul>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Paarsh Infotech. All rights reserved.</p>
              <p>Need help? Contact us at <a href="mailto:${user}">${user}</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("[Email] Workshop Registration email sent successfully:", info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error("[Email] Nodemailer workshop registration error:", error);
        return { success: false, error };
    }
};
