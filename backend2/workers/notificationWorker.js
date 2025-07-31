import { Worker } from 'bullmq';
import { sendEmail } from '../services/emailService.js';
import db from '../models/index.js';

const worker = new Worker('notifications', async (job) => {
  const { type, userId, data } = job.data;

  try {
    const user = await db.User.findByPk(userId, {
      include: [db.Facilitator, db.Manager, db.Student]
    });

    if (!user) throw new Error(`User ${userId} not found`);

    let notification;
    let emailContent;

    switch(type) {
      case 'facilitator_log_reminder':
        notification = {
          title: 'Activity Log Reminder',
          message: `Please submit your activity log for week ${data.weekNumber}`,
          type: 'reminder'
        };
        emailContent = {
          subject: 'Activity Log Submission Reminder',
          text: `Dear ${user.first_name},\n\nThis is a reminder to submit your activity log for week ${data.weekNumber}.\n\nBest regards,\nThe Education Team`
        };
        break;

      case 'facilitator_log_missed':
        notification = {
          title: 'Missed Activity Log Deadline',
          message: `You missed the deadline for week ${data.weekNumber}`,
          type: 'alert'
        };
        emailContent = {
          subject: 'Missed Activity Log Deadline',
          text: `Dear ${user.first_name},\n\nYou missed the deadline for submitting your activity log for week ${data.weekNumber}.\n\nBest regards,\nThe Education Team`
        };
        break;

      case 'manager_alert':
        notification = {
          title: 'Facilitator Log Status',
          message: `Facilitator ${user.first_name} ${user.last_name} has ${data.status} their activity log for week ${data.weekNumber}`,
          type: 'alert'
        };
        emailContent = {
          subject: 'Facilitator Log Status Update',
          text: `Facilitator ${user.first_name} ${user.last_name} has ${data.status} their activity log for week ${data.weekNumber}.`
        };
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    await db.Notification.create({
      user_id: userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_read: false,
      metadata: JSON.stringify(data)
    });

    await sendEmail(user.email, emailContent.subject, emailContent.text);
    return { success: true, userId, notification };
  } catch (error) {
    console.error(`Notification failed for job ${job.id}:`, error);
    throw error;
  }
}, {
  connection: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
});

worker.on('completed', (job) => {
  console.log(`Notification job ${job.id} completed for user ${job.data.userId}`);
});

worker.on('failed', (job, err) => {
  console.error(`Notification job ${job.id} failed:`, err);
});

export default worker;
