import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ChromeStorageService } from '@/utils/storage';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'data'>('general');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4285F4');

  const handleExportData = async () => {
    const tasks = await ChromeStorageService.getTasks();
    const data = {
      tasks,
      categories,
      settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-todo-backup-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tasks) {
          await ChromeStorageService.saveTasks(data.tasks);
          useStore.setState({ tasks: data.tasks });
        }
        if (data.categories) {
          await ChromeStorageService.saveCategories(data.categories);
          useStore.setState({ categories: data.categories });
        }
        if (data.settings) {
          await ChromeStorageService.saveSettings(data.settings);
          useStore.setState({ settings: data.settings });
        }
        alert('データのインポートが完了しました');
      } catch (error) {
        alert('データのインポートに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    addCategory({
      name: newCategoryName,
      color: newCategoryColor,
      isDefault: false,
    });

    setNewCategoryName('');
    setNewCategoryColor('#4285F4');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">設定</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 ${
              activeTab === 'general'
                ? 'border-b-2 border-primary-light dark:border-primary-dark'
                : ''
            }`}
          >
            一般
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 ${
              activeTab === 'categories'
                ? 'border-b-2 border-primary-light dark:border-primary-dark'
                : ''
            }`}
          >
            カテゴリ
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 ${
              activeTab === 'data'
                ? 'border-b-2 border-primary-light dark:border-primary-dark'
                : ''
            }`}
          >
            データ
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">テーマ</h3>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    updateSettings({
                      theme: e.target.value as typeof settings.theme,
                    })
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="light">ライト</option>
                  <option value="dark">ダーク</option>
                  <option value="system">システム設定に従う</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">通知</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.enabled}
                      onChange={(e) =>
                        updateSettings({
                          notifications: {
                            ...settings.notifications,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="text-sm">通知を有効にする</span>
                  </label>

                  <label className="flex items-center gap-2 ml-6">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sound}
                      onChange={(e) =>
                        updateSettings({
                          notifications: {
                            ...settings.notifications,
                            sound: e.target.checked,
                          },
                        })
                      }
                      disabled={!settings.notifications.enabled}
                    />
                    <span className="text-sm">通知音を鳴らす</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.dailySummary}
                      onChange={(e) =>
                        updateSettings({
                          notifications: {
                            ...settings.notifications,
                            dailySummary: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="text-sm">日次サマリー (毎朝9時)</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReview}
                      onChange={(e) =>
                        updateSettings({
                          notifications: {
                            ...settings.notifications,
                            weeklyReview: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="text-sm">週次レビュー (毎週月曜9時)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">同期</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.sync.enabled}
                    onChange={(e) =>
                      updateSettings({
                        sync: {
                          ...settings.sync,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-sm">Chromeアカウント間で同期する</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="新しいカテゴリ名"
                  className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <button onClick={handleAddCategory} className="btn-primary">
                  追加
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={category.color}
                        onChange={(e) =>
                          updateCategory(category.id, { color: e.target.value })
                        }
                        className="w-8 h-8 border rounded cursor-pointer"
                        disabled={category.isDefault}
                      />
                      <span>{category.name}</span>
                      {category.isDefault && (
                        <span className="text-xs text-gray-500">(デフォルト)</span>
                      )}
                    </div>
                    {!category.isDefault && (
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">エクスポート</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  すべてのタスク、カテゴリ、設定をJSON形式でエクスポートします。
                </p>
                <button onClick={handleExportData} className="btn-primary">
                  データをエクスポート
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">インポート</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  エクスポートしたJSONファイルからデータを復元します。
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-white hover:file:opacity-90"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">データ削除</h3>
                <p className="text-sm text-red-600 mb-2">
                  警告: この操作は取り消せません。すべてのデータが削除されます。
                </p>
                <button
                  onClick={async () => {
                    if (
                      confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')
                    ) {
                      await ChromeStorageService.clearAll();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  すべてのデータを削除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
}

export default SettingsModal;