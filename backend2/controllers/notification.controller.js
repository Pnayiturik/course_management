import NotificationService from '../services/notificationService.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationService.markAsRead(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

export const testNotification = async (req, res) => {
  try {
    const { type } = req.body;
    
    let result;
    switch(type) {
      case 'reminder':
        result = await NotificationService.sendFacilitatorLogReminder(req.user.id, 1);
        break;
      case 'missed':
        result = await NotificationService.sendFacilitatorLogMissed(req.user.id, 1);
        break;
      default:
        return res.status(400).json({ error: "Invalid notification type" });
    }
    
    return res.status(200).json({ message: "Test notification queued", jobId: result.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send test notification" });
  }
};