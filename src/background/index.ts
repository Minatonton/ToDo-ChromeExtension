// バックグラウンドサービスワーカー
// リマインダー通知とアラーム管理を処理

// 拡張機能のインストール時の初期化
chrome.runtime.onInstalled.addListener(() => {
  console.log('Calendar TODO Extension installed');

  // 通知の権限を確認
  chrome.notifications.getPermissionLevel((level) => {
    if (level !== 'granted') {
      console.log('Notification permission not granted');
    }
  });

  // デフォルトのストレージを初期化
  chrome.storage.local.get(['tasks', 'categories', 'settings'], (result) => {
    if (!result.tasks) {
      chrome.storage.local.set({ tasks: [] });
    }
    if (!result.categories) {
      const defaultCategories = [
        { id: '1', name: '仕事', color: '#4285F4', isDefault: true },
        { id: '2', name: 'プライベート', color: '#34A853', isDefault: true },
        { id: '3', name: '買い物', color: '#FBBC04', isDefault: true },
        { id: '4', name: '勉強', color: '#EA4335', isDefault: true },
        { id: '5', name: '健康', color: '#34A853', isDefault: true },
        { id: '6', name: 'その他', color: '#9E9E9E', isDefault: true },
      ];
      chrome.storage.local.set({ categories: defaultCategories });
    }
    if (!result.settings) {
      const defaultSettings = {
        theme: 'system',
        notifications: {
          enabled: true,
          sound: true,
          dailySummary: true,
          weeklyReview: false,
        },
        sync: {
          enabled: true,
        },
      };
      chrome.storage.local.set({ settings: defaultSettings });
    }
  });
});

// アラームリスナー
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm fired:', alarm.name);

  if (alarm.name.startsWith('task-reminder-')) {
    const taskId = alarm.name.replace('task-reminder-', '');
    showTaskReminder(taskId);
  } else if (alarm.name === 'daily-summary') {
    showDailySummary();
  } else if (alarm.name === 'weekly-review') {
    showWeeklyReview();
  }
});

// タスクリマインダーの表示
async function showTaskReminder(taskId: string) {
  const result = await chrome.storage.local.get('tasks');
  const tasks = result.tasks || [];
  const task = tasks.find((t: any) => t.id === taskId);

  if (task && !task.completed) {
    chrome.notifications.create(`task-${taskId}`, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: 'タスクリマインダー',
      message: task.title,
      priority: task.priority === 'high' ? 2 : 1,
      buttons: [
        { title: '完了にする' },
        { title: 'スヌーズ (15分後)' },
      ],
    });
  }
}

// 日次サマリーの表示
async function showDailySummary() {
  const result = await chrome.storage.local.get('tasks');
  const tasks = result.tasks || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter((task: any) => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate < tomorrow && !task.completed;
  });

  if (todayTasks.length > 0) {
    chrome.notifications.create('daily-summary', {
      type: 'list',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: '今日のタスク',
      message: `${todayTasks.length}件のタスクがあります`,
      items: todayTasks.slice(0, 5).map((task: any) => ({
        title: task.title,
        message: task.description || '',
      })),
    });
  }
}

// 週次レビューの表示
async function showWeeklyReview() {
  const result = await chrome.storage.local.get('tasks');
  const tasks = result.tasks || [];

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const completedTasks = tasks.filter((task: any) => {
    const updatedAt = new Date(task.updatedAt);
    return task.completed && updatedAt >= weekAgo;
  });

  const pendingTasks = tasks.filter((task: any) => !task.completed);

  chrome.notifications.create('weekly-review', {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: '週次レビュー',
    message: `今週は${completedTasks.length}件のタスクを完了しました。残り${pendingTasks.length}件のタスクがあります。`,
    priority: 0,
  });
}

// 通知ボタンのクリックリスナー
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId.startsWith('task-')) {
    const taskId = notificationId.replace('task-', '');

    if (buttonIndex === 0) {
      // タスクを完了にする
      completeTask(taskId);
    } else if (buttonIndex === 1) {
      // 15分後にスヌーズ
      chrome.alarms.create(`task-reminder-${taskId}`, {
        delayInMinutes: 15,
      });
    }

    chrome.notifications.clear(notificationId);
  }
});

// タスクを完了にする
async function completeTask(taskId: string) {
  const result = await chrome.storage.local.get('tasks');
  const tasks = result.tasks || [];
  const taskIndex = tasks.findIndex((t: any) => t.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    await chrome.storage.local.set({ tasks });
  }
}

// ストレージの変更を監視
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.tasks) {
    updateAlarms(changes.tasks.newValue);
  }

  if (namespace === 'local' && changes.settings) {
    updateNotificationSettings(changes.settings.newValue);
  }
});

// アラームの更新
async function updateAlarms(tasks: any[]) {
  // 既存のタスクアラームをクリア
  const alarms = await chrome.alarms.getAll();
  for (const alarm of alarms) {
    if (alarm.name.startsWith('task-reminder-')) {
      chrome.alarms.clear(alarm.name);
    }
  }

  // 新しいアラームを設定
  for (const task of tasks) {
    if (task.reminder?.enabled && !task.completed) {
      const reminderTime = new Date(task.reminder.time);
      if (reminderTime > new Date()) {
        chrome.alarms.create(`task-reminder-${task.id}`, {
          when: reminderTime.getTime(),
        });
      }
    }
  }
}

// 通知設定の更新
function updateNotificationSettings(settings: any) {
  // 日次サマリーの設定
  if (settings.notifications?.dailySummary) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    chrome.alarms.create('daily-summary', {
      when: tomorrow.getTime(),
      periodInMinutes: 24 * 60,
    });
  } else {
    chrome.alarms.clear('daily-summary');
  }

  // 週次レビューの設定
  if (settings.notifications?.weeklyReview) {
    const now = new Date();
    const nextMonday = new Date(now);
    const day = nextMonday.getDay();
    const daysUntilMonday = (8 - day) % 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    nextMonday.setHours(9, 0, 0, 0);

    chrome.alarms.create('weekly-review', {
      when: nextMonday.getTime(),
      periodInMinutes: 7 * 24 * 60,
    });
  } else {
    chrome.alarms.clear('weekly-review');
  }
}

export {};