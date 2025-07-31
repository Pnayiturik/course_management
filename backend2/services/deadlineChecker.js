import db from '../models/index.js';
import NotificationService from './notificationService.js';
import cron from 'node-cron';

class DeadlineChecker {
  static async checkFacilitatorLogDeadlines() {
    try {
      // Get current week number (you'll need to implement this based on your system)
      const currentWeek = this.getCurrentWeekNumber();
      
      // Get all active facilitators
      const facilitators = await db.User.findAll({
        where: { role: 'facilitator' },
        include: [db.Facilitator]
      });
      
      // Check each facilitator's logs
      for (const facilitator of facilitators) {
        const log = await db.ActivityLog.findOne({
          where: {
            week_number: currentWeek,
            user_id: facilitator.id
          }
        });
        
        // If log not submitted and deadline passed (Friday 5pm)
        if (!log && this.isDeadlinePassed()) {
          await NotificationService.sendFacilitatorLogMissed(facilitator.id, currentWeek);
          
          // Also notify managers
          const managers = await db.User.findAll({
            where: { role: 'manager' }
          });
          
          for (const manager of managers) {
            await NotificationService.sendManagerAlert(
              manager.id,
              facilitator.id,
              currentWeek,
              'missed'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error checking facilitator deadlines:', error);
    }
  }

  static async checkUpcomingDeadlines() {
    try {
      const currentWeek = this.getCurrentWeekNumber();
      const facilitators = await db.User.findAll({
        where: { role: 'facilitator' },
        include: [db.Facilitator]
      });
      
      // If it's Thursday (day before deadline)
      if (this.isDayBeforeDeadline()) {
        for (const facilitator of facilitators) {
          const log = await db.ActivityLog.findOne({
            where: {
              week_number: currentWeek,
              user_id: facilitator.id
            }
          });
          
          if (!log) {
            await NotificationService.sendFacilitatorLogReminder(facilitator.id, currentWeek);
          }
        }
      }
    } catch (error) {
      console.error('Error checking upcoming deadlines:', error);
    }
  }

  static getCurrentWeekNumber() {
    // Implement your week number logic
    return Math.ceil((new Date().getDate() + new Date().getDay()) / 7);
  }

  static isDeadlinePassed() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 5 = Friday
    const hour = now.getHours();
    
    // Friday after 5pm
    return day === 5 && hour >= 17;
  }

  static isDayBeforeDeadline() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Thursday after 9am
    return day === 4 && hour >= 9;
  }

  static startCronJobs() {
    // Check for missed deadlines every hour
    cron.schedule('0 * * * *', () => this.checkFacilitatorLogDeadlines());
    
    // Check for upcoming deadlines every hour on Thursday
    cron.schedule('0 * * * 4', () => this.checkUpcomingDeadlines());
  }
}

export default DeadlineChecker;