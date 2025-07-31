import { Queue } from 'bullmq';

const notificationQueue = new Queue('notifications', {
  connection: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

export default notificationQueue;
