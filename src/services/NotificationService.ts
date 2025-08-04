import notifee, { AndroidImportance } from '@notifee/react-native';
import i18n from '../config/i18n';

class NotificationService {
  async createChannel() {
    return await notifee.createChannel({
      id: 'daily',
      name: 'Daily Reminder',
      importance: AndroidImportance.HIGH,
    });
  }

  async showReminder() {
    const channelId = await this.createChannel();

    await notifee.displayNotification({
      title: i18n.t('reminder-title'),
      body: i18n.t('reminder-body'),
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
  }
}

export default new NotificationService();
