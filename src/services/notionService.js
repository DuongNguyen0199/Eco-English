// Key constants for localStorage
const STORAGE_NOTION_KEY = 'emmi_notion_api_key';
const STORAGE_NOTION_DB = 'emmi_notion_database_id';
const STORAGE_MOCK_MODE = 'emmi_mock_mode';

/**
 * Default mock tasks matching exact prompt requirements
 */
export const DEFAULT_MOCK_TASKS = [
  {
    id: 'mock-1',
    title: 'Học tiếng anh qua app Duolingo 5 phút',
    status: 'Cần làm',
    priority: 'Cao',
    duration: '5 phút',
    category: 'Học tập',
    icon: '🦉',
    notionUrl: 'https://notion.so'
  },
  {
    id: 'mock-2',
    title: 'Học tiếng anh qua app The Coach 15 phút',
    status: 'Cần làm',
    priority: 'Cao',
    duration: '15 phút',
    category: 'Học tập',
    icon: '🎓',
    notionUrl: 'https://notion.so'
  },
  {
    id: 'mock-3',
    title: 'Sản xuất video youtube',
    status: 'Đang làm',
    priority: 'Ưu tiên',
    duration: '60 phút',
    category: 'Công việc',
    icon: '🎬',
    notionUrl: 'https://notion.so'
  },
  {
    id: 'mock-4',
    title: 'Đọc sách kỹ năng 15 phút',
    status: 'Cần làm',
    priority: 'Trung bình',
    duration: '15 phút',
    category: 'Cá nhân',
    icon: '📖',
    notionUrl: 'https://notion.so'
  }
];

/**
 * Retrieve saved settings from localStorage
 */
export function getSavedNotionConfig() {
  return {
    apiKey: localStorage.getItem(STORAGE_NOTION_KEY) || '',
    databaseId: localStorage.getItem(STORAGE_NOTION_DB) || '',
    useMock: localStorage.getItem(STORAGE_MOCK_MODE) !== 'false' // default to true if not set
  };
}

/**
 * Save settings to localStorage
 */
export function saveNotionConfig(apiKey, databaseId, useMock = true) {
  localStorage.setItem(STORAGE_NOTION_KEY, apiKey.trim());
  localStorage.setItem(STORAGE_NOTION_DB, databaseId.trim());
  localStorage.setItem(STORAGE_MOCK_MODE, useMock ? 'true' : 'false');
}

/**
 * Fetch tasks from Notion API or return fallback mock tasks
 */
export async function fetchTodayTasks() {
  const config = getSavedNotionConfig();

  // If mock mode is explicitly enabled or config is missing, return mock data
  if (config.useMock || !config.apiKey || !config.databaseId) {
    // Return mock tasks with slight artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      isMock: true,
      tasks: DEFAULT_MOCK_TASKS,
      speechResponse: formatEmmiSpeechResponse(DEFAULT_MOCK_TASKS)
    };
  }

  try {
    // Notion database query endpoint
    // Using api.notion.com via fetch
    const cleanDbId = config.databaseId.replace(/-/g, '');
    const url = `https://api.notion.com/v1/databases/${cleanDbId}/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Filter out completed tasks if status exists, or fetch top 100
        page_size: 20
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Notion API Error: ${response.status}`);
    }

    const data = await response.json();
    const parsedTasks = parseNotionResults(data.results);

    // Fallback to mock if database query returned no tasks
    const tasksToUse = parsedTasks.length > 0 ? parsedTasks : DEFAULT_MOCK_TASKS;

    return {
      success: true,
      isMock: parsedTasks.length === 0,
      tasks: tasksToUse,
      speechResponse: formatEmmiSpeechResponse(tasksToUse)
    };

  } catch (error) {
    console.warn('Fell back to mock tasks due to Notion API error:', error.message);
    return {
      success: false,
      error: error.message,
      isMock: true,
      tasks: DEFAULT_MOCK_TASKS,
      speechResponse: formatEmmiSpeechResponse(DEFAULT_MOCK_TASKS)
    };
  }
}

/**
 * Parse Notion raw JSON page results into clean Task objects
 */
function parseNotionResults(results) {
  if (!Array.isArray(results)) return [];

  return results.map(item => {
    const props = item.properties || {};
    
    // Extract title (Look for Name, Task, Title, or first title property)
    let title = 'Công việc không tên';
    for (const key in props) {
      if (props[key].type === 'title' && props[key].title?.length > 0) {
        title = props[key].title.map(t => t.plain_text).join('');
        break;
      }
    }

    // Extract Status / Select property
    let status = 'Chưa hoàn thành';
    if (props['Status']?.status?.name) {
      status = props['Status'].status.name;
    } else if (props['Trạng thái']?.select?.name) {
      status = props['Trạng thái'].select.name;
    } else if (props['Checkbox']?.checkbox) {
      status = props['Checkbox'].checkbox ? 'Hoàn thành' : 'Cần làm';
    }

    // Extract Duration / Time if present
    let duration = '';
    if (props['Thời gian']?.rich_text?.length > 0) {
      duration = props['Thời gian'].rich_text.map(t => t.plain_text).join('');
    } else if (props['Duration']?.number) {
      duration = `${props['Duration'].number} phút`;
    }

    // Icon
    let icon = '📌';
    if (item.icon?.emoji) {
      icon = item.icon.emoji;
    }

    return {
      id: item.id,
      title: title.trim(),
      status: status,
      duration: duration,
      icon: icon,
      notionUrl: item.url || `https://notion.so/${item.id.replace(/-/g, '')}`
    };
  });
}

/**
 * Format task list into Emmi's exact signature Vietnamese greeting
 * Request example: "thưa chủ nhân, nay có những task học tiếng anh qua app Duolinggo 5 phút, học tiếng anh qua app The Coach 15 phút. Sản xuất video youtube,.."
 */
export function formatEmmiSpeechResponse(tasks) {
  if (!tasks || tasks.length === 0) {
    return "Thưa chủ nhân, hôm nay chủ nhân không có task nào cả. Hãy nghỉ ngơi và thư giãn nhé!";
  }

  const taskDescriptions = tasks.map(t => {
    return t.duration ? `${t.title} (${t.duration})` : t.title;
  });

  if (taskDescriptions.length === 1) {
    return `Thưa chủ nhân, nay có task ${taskDescriptions[0]}.`;
  }

  const mainList = taskDescriptions.slice(0, taskDescriptions.length - 1).join(', ');
  const lastTask = taskDescriptions[taskDescriptions.length - 1];

  return `Thưa chủ nhân, nay có những task ${mainList} và ${lastTask}.`;
}

/**
 * Helper to test Notion connection with provided credentials
 */
export async function testNotionConnection(apiKey, databaseId) {
  try {
    const cleanDbId = databaseId.replace(/-/g, '');
    const url = `https://api.notion.com/v1/databases/${cleanDbId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.message || `HTTP ${response.status}` };
    }

    const db = await response.json();
    const dbName = db.title?.map(t => t.plain_text).join('') || 'Database Notion';
    return { success: true, dbName };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
