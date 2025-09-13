const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
// Check if in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const OpenAI = require('openai');

// Simple file-based storage as fallback
const STORAGE_PATH = path.join(os.homedir(), '.chatcraft-config.json');

const store = {
  get: (key) => {
    try {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8');
      const config = JSON.parse(data);
      return config[key];
    } catch (error) {
      return null;
    }
  },
  set: (key, value) => {
    try {
      let config = {};
      try {
        const data = fs.readFileSync(STORAGE_PATH, 'utf8');
        config = JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is invalid, start with empty config
      }
      config[key] = value;
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  }
};

let mainWindow;
let aiClients = {
  openai: null,
  groq: null,
  deepseek: null
};

// Initialize AI clients
function initializeAIClients() {
  // OpenAI
  const openaiKey = store.get('openai.apiKey');
  if (openaiKey) {
    aiClients.openai = new OpenAI({
      apiKey: openaiKey,
    });
  }
  
  // Groq
  const groqKey = store.get('groq.apiKey');
  if (groqKey) {
    aiClients.groq = new OpenAI({
      apiKey: groqKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  
  // DeepSeek
  const deepseekKey = store.get('deepseek.apiKey');
  if (deepseekKey) {
    aiClients.deepseek = new OpenAI({
      apiKey: deepseekKey,
      baseURL: 'https://api.deepseek.com/v1',
    });
  }
  
  // OpenRouter
  const openrouterKey = store.get('openrouter.apiKey');
  if (openrouterKey) {
    aiClients.openrouter = new OpenAI({
      apiKey: openrouterKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// App event listeners
app.whenReady().then(() => {
  createWindow();
  initializeAIClients();
  
  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-setting', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-setting', (event, key, value) => {
  store.set(key, value);
  // Reinitialize AI clients when API keys change
  if (key.endsWith('.apiKey')) {
    initializeAIClients();
  }
});

ipcMain.handle('enhance-text', async (event, { text, mode, provider = 'openai' }) => {
  const client = aiClients[provider];
  if (!client) {
    throw new Error(`${provider.toUpperCase()} API key not configured`);
  }

  try {
    let prompt;
    switch (mode) {
      case 'prompt':
        prompt = `You are an expert AI prompt engineer. Enhance this prompt to be clearer, more specific, and more effective. Make it structured and detailed so that any AI can understand exactly what is being asked. Provide only the enhanced prompt without explanations:\n\n${text}`;
        break;
      case 'grammar':
        prompt = `Fix grammar, spelling, and punctuation errors in this text while preserving the original meaning and tone:\n\n${text}`;
        break;
      case 'formal':
        prompt = `Rewrite this text in a more formal and professional tone:\n\n${text}`;
        break;
      case 'casual':
        prompt = `Rewrite this text in a more casual and friendly tone:\n\n${text}`;
        break;
      case 'concise':
        prompt = `Make this text more concise while keeping all important information:\n\n${text}`;
        break;
      case 'detailed':
        prompt = `Expand this text with more detail and explanation:\n\n${text}`;
        break;
      case 'clear':
        prompt = `Improve the clarity and readability of this text:\n\n${text}`;
        break;
      case 'coding-idea':
        prompt = `You are an expert software architect and full-stack developer. I need a comprehensive coding solution for: "${text}"

Please provide:

1. **Project Overview**: Brief description of what we're building
2. **Technology Stack**: Recommended technologies, frameworks, and tools
3. **Architecture**: High-level system design and component structure
4. **Core Features**: Main functionalities to implement
5. **Implementation Logic**: Detailed steps and code structure
6. **Key Components**: Important files/modules to create
7. **Integration Points**: How different parts connect
8. **Best Practices**: Important considerations and recommendations
9. **Potential Challenges**: Common issues and solutions
10. **Next Steps**: How to get started

Make it comprehensive, practical, and ready for implementation.`;
        break;
      case 'coding-roadmap':
        prompt = `You are an expert project manager and senior developer. Create a detailed coding roadmap for: "${text}"

Please provide a structured development plan with:

## 🏁 Project Setup Phase
- Environment setup
- Tool installation
- Project initialization

## 🏗️ Development Phases
Break down into logical phases with:
- Phase objectives
- Key deliverables
- Estimated timeline
- Prerequisites

## 📝 Task Breakdown
For each phase, provide:
- Specific tasks to complete
- Order of implementation
- Dependencies between tasks
- Difficulty level

## 🛠️ Technical Milestones
- Core functionality checkpoints
- Testing phases
- Integration points
- Deployment stages

## 📊 Progress Tracking
- How to measure progress
- Key indicators of success
- Common blockers and solutions

Make it actionable, time-bound, and suitable for developers of different skill levels.`;
        break;
      default:
        prompt = `Improve this text for better grammar and clarity:\n\n${text}`;
    }

    // Choose model based on provider
    let model;
    switch (provider) {
      case 'openai':
        model = 'gpt-3.5-turbo';
        break;
      case 'groq':
        model = 'llama-3.1-8b-instant';
        break;
      case 'deepseek':
        model = 'deepseek-chat';
        break;
      case 'openrouter':
        model = 'meta-llama/llama-3.2-3b-instruct:free';
        break;
      default:
        model = 'gpt-3.5-turbo';
    }

    const systemMessage = mode === 'prompt' 
      ? "You are an expert AI prompt engineer. Enhance prompts to be clearer, more specific, and more effective. Provide only the enhanced prompt without explanations or additional comments."
      : "You are a helpful writing assistant. Provide only the improved text without explanations or additional comments.";

    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`${provider.toUpperCase()} API error: ${error.message}`);
  }
});

ipcMain.handle('get-available-providers', () => {
  const availableProviders = [];
  
  if (aiClients.openai) {
    availableProviders.push({ name: 'openai', label: '🤖 OpenAI', configured: true });
  } else {
    availableProviders.push({ name: 'openai', label: '🤖 OpenAI', configured: false });
  }
  
  if (aiClients.groq) {
    availableProviders.push({ name: 'groq', label: '⚡ Groq', configured: true });
  } else {
    availableProviders.push({ name: 'groq', label: '⚡ Groq', configured: false });
  }
  
  if (aiClients.deepseek) {
    availableProviders.push({ name: 'deepseek', label: '🧠 DeepSeek', configured: true });
  } else {
    availableProviders.push({ name: 'deepseek', label: '🧠 DeepSeek', configured: false });
  }
  
  if (aiClients.openrouter) {
    availableProviders.push({ name: 'openrouter', label: '🌐 OpenRouter', configured: true });
  } else {
    availableProviders.push({ name: 'openrouter', label: '🌐 OpenRouter', configured: false });
  }
  
  return availableProviders;
});

ipcMain.handle('test-api-key', async (event, apiKey, provider = 'openai') => {
  try {
    let testClient;
    let model;
    
    switch (provider) {
      case 'openai':
        testClient = new OpenAI({ apiKey });
        model = 'gpt-3.5-turbo';
        break;
      case 'groq':
        testClient = new OpenAI({ 
          apiKey, 
          baseURL: 'https://api.groq.com/openai/v1' 
        });
        model = 'llama-3.1-8b-instant';
        break;
      case 'deepseek':
        testClient = new OpenAI({ 
          apiKey, 
          baseURL: 'https://api.deepseek.com/v1' 
        });
        model = 'deepseek-chat';
        break;
      case 'openrouter':
        testClient = new OpenAI({ 
          apiKey, 
          baseURL: 'https://openrouter.ai/api/v1' 
        });
        model = 'meta-llama/llama-3.2-3b-instruct:free'; // Free model
        break;
      default:
        throw new Error('Unsupported provider');
    }
    
    await testClient.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    return { success: true };
  } catch (error) {
    console.error(`API test failed for ${provider}:`, error);
    let errorMessage = error.message;
    
    // Provide more specific error messages for different providers
    if (provider === 'groq') {
      errorMessage = errorMessage.replace('platform.openai.com', 'console.groq.com');
      errorMessage = errorMessage.replace('OpenAI', 'Groq');
    } else if (provider === 'deepseek') {
      errorMessage = errorMessage.replace('platform.openai.com', 'platform.deepseek.com');
      errorMessage = errorMessage.replace('OpenAI', 'DeepSeek');
    }
    
    return { success: false, error: errorMessage };
  }
});