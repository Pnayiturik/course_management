import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); // Load environment variables

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email with the given parameters
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} [html] - HTML email content (optional)
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    // Verify connection configuration
    await transporter.verify();
    
    // Setup email data
    const mailOptions = {
      from: `"Education Platform" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text,
      html: html || text // Use HTML if provided, otherwise fallback to text
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send HTML email with template
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} templateName - Name of the email template
 * @param {object} templateData - Data to inject into template
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendTemplateEmail = async (to, subject, templateName, templateData) => {
  try {
    // In a real implementation, you would load templates from files or a database
    const templates = {
      reminder: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Activity Log Reminder</h2>
          <p>Dear ${data.name},</p>
          <p>This is a reminder to submit your activity log for week ${data.weekNumber}.</p>
          <p>The deadline is Friday at 5pm.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Education Team</p>
        </div>
      `,
      missed: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Missed Activity Log Deadline</h2>
          <p>Dear ${data.name},</p>
          <p>You missed the deadline for submitting your activity log for week ${data.weekNumber}.</p>
          <p>Please submit it as soon as possible.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Education Team</p>
        </div>
      `,
      managerAlert: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">Facilitator Log Status</h2>
          <p>Facilitator ${data.facilitatorName} has ${data.status} their activity log for week ${data.weekNumber}.</p>
          ${data.status === 'missed' ? '<p>Action may be required.</p>' : ''}
          <p style="margin-top: 30px;">Education Platform System</p>
        </div>
      `
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const html = template(templateData);
    const text = `Please view this email in an HTML-enabled client.`;

    return sendEmail(to, subject, text, html);
  } catch (error) {
    console.error('Error sending template email:', error);
    throw error;
  }
};