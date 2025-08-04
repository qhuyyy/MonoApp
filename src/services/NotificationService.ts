import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../config/i18n';

class NotificationService {
  async createChannel() {
    return await notifee.createChannel({
      id: 'daily',
      name: 'Daily Reminder',
      importance: AndroidImportance.HIGH,
    });
  }

  async createBackupChannel() {
    return await notifee.createChannel({
      id: 'backup',
      name: 'Backup Reminder',
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

  async showWeeklyBackupReminder() {
    const today = new Date();
    const day = today.getDay();
    const key = `weekly_backup_${today.toDateString()}`;

    if (day === 0) {
      const alreadySent = await AsyncStorage.getItem(key);
      if (!alreadySent) {
        const channelId = await this.createBackupChannel();
        await notifee.displayNotification({
          title: i18n.t('backup-reminder-title'),
          body: i18n.t('backup-reminder-body'),
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: { id: 'default' },
          },
        });
        await AsyncStorage.setItem(key, 'true');
      }
    }
  }
}

export default new NotificationService();
