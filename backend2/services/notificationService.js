import notificationQueue from '../queues/notificationQueue.js';
import db from '../models/index.js';

class NotificationService {
  static async sendFacilitatorLogReminder(facilitatorId, weekNumber) {
    return notificationQueue.add('facilitator_log_reminder', {
      type: 'facilitator_log_reminder',
      userId: facilitatorId,
      data: { weekNumber }
    });
  }

  static async sendFacilitatorLogMissed(facilitatorId, weekNumber) {
    return notificationQueue.add('facilitator_log_missed', {
      type: 'facilitator_log_missed',
      userId: facilitatorId,
      data: { weekNumber }
    });
  }

  static async sendManagerAlert(managerId, facilitatorId, weekNumber, status) {
    return notificationQueue.add('manager_alert', {
      type: 'manager_alert',
      userId: managerId,
      data: { facilitatorId, weekNumber, status }
    });
  }

  static async getUserNotifications(userId, limit = 10) {
    return db.Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit
    });
  }

  static async markAsRead(notificationId) {
    return db.Notification.update(
      { is_read: true },
      { where: { id: notificationId } }
    );
  }
}

export default NotificationService;