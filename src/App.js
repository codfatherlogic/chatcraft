import React, { useState, useEffect } from 'react';
import './App.css';

const { electronAPI } = window;

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('prompt');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    groq: '',
    deepseek: '',
    openrouter: ''
  });
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [availableProviders, setAvailableProviders] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');
  const [hasAnyKey, setHasAnyKey] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    // Load saved API key on startup
    loadSettings();
    // Load saved theme
    const savedTheme = localStorage.getItem('chatcraft-theme') || 'dark';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Refresh providers when API keys change
  useEffect(() => {
    const refreshProviders = async () => {
      try {
        const providersList = await electronAPI.getAvailableProviders();
        setAvailableProviders(providersList);
      } catch (err) {
        console.error('Error refreshing providers:', err);
      }
    };
    
    if (hasAnyKey) {
      refreshProviders();
    }
  }, [hasAnyKey, apiKeys]);

  const loadSettings = async () => {
    try {
      const providers = ['openai', 'groq', 'deepseek', 'openrouter'];
      const keys = {};
      let hasKey = false;
      
      for (const provider of providers) {
        const savedKey = await electronAPI.getSetting(`${provider}.apiKey`);
        keys[provider] = savedKey || '';
        if (savedKey) hasKey = true;
      }
      
      // Load available providers
      const providersList = await electronAPI.getAvailableProviders();
      setAvailableProviders(providersList);
      
      // Set default provider to first configured one
      const configuredProvider = providersList.find(p => p.configured);
      if (configuredProvider) {
        setSelectedProvider(configuredProvider.name);
      }
      
      setApiKeys(keys);
      setHasAnyKey(hasKey);
      
      if (!hasKey) {
        setShowSettings(true); // Show settings if no API keys are configured
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const saveApiKeys = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Check if at least one API key is provided
      const hasAnyValidKey = Object.values(apiKeys).some(key => key.trim());
      if (!hasAnyValidKey) {
        setError('Please provide at least one API key');
        return;
      }
      
      // Test the selected provider's API key if it exists
      const currentKey = apiKeys[selectedProvider];
      if (currentKey) {
        // Basic format validation
        if (selectedProvider === 'groq' && !currentKey.startsWith('gsk_')) {
          setError('Groq API keys should start with "gsk_". Please check your API key.');
          return;
        }
        if ((selectedProvider === 'openai' || selectedProvider === 'deepseek') && !currentKey.startsWith('sk-')) {
          setError(`${selectedProvider.toUpperCase()} API keys should start with "sk-". Please check your API key.`);
          return;
        }
        if (selectedProvider === 'openrouter' && !currentKey.startsWith('sk-or-')) {
          setError('OpenRouter API keys should start with "sk-or-". Please check your API key.');
          return;
        }
        
        const testResult = await electronAPI.testApiKey(currentKey, selectedProvider);
        if (!testResult.success) {
          setError(`Invalid ${selectedProvider.toUpperCase()} API key: ${testResult.error}`);
          return;
        }
      }
      
      // Save all API keys
      for (const [provider, key] of Object.entries(apiKeys)) {
        if (key.trim()) {
          await electronAPI.setSetting(`${provider}.apiKey`, key.trim());
        }
      }
      
      // Reload available providers after saving
      const providersList = await electronAPI.getAvailableProviders();
      setAvailableProviders(providersList);
      
      // Set default provider to first configured one
      const configuredProvider = providersList.find(p => p.configured);
      if (configuredProvider && !providersList.find(p => p.name === selectedProvider && p.configured)) {
        setSelectedProvider(configuredProvider.name);
      }
      
      setHasAnyKey(true);
      setShowSettings(false);
      setError('');
    } catch (err) {
      setError(`Error saving API keys: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to enhance');
      return;
    }

    // Check if selected provider is configured
    const provider = availableProviders.find(p => p.name === selectedProvider);
    if (!provider || !provider.configured) {
      setError(`${selectedProvider.toUpperCase()} is not configured. Please add an API key in settings.`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const enhanced = await electronAPI.enhanceText(inputText, selectedMode, selectedProvider);
      setOutputText(enhanced);
    } catch (err) {
      setError(`Enhancement failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const getPlaceholderText = (mode) => {
    switch (mode) {
      case 'prompt':
        return "Enter your prompt here and I'll enhance it to be clearer and more effective...";
      case 'coding-idea':
        return "Describe your coding idea (e.g., 'Vue.js support for Electron', 'React Native chat app', 'Python web scraper')...";
      case 'coding-roadmap':
        return "Describe your project for a detailed roadmap (e.g., 'Build a full-stack e-commerce site', 'Create a mobile game with Unity')...";
      default:
        return "Type or paste your text here...";
    }
  };

  const getOutputPlaceholderText = (mode) => {
    switch (mode) {
      case 'prompt':
        return "Enhanced prompt will appear here...";
      case 'coding-idea':
        return "Comprehensive coding solution with architecture, tech stack, and implementation details will appear here...";
      case 'coding-roadmap':
        return "Detailed development roadmap with phases, tasks, and milestones will appear here...";
      default:
        return "Enhanced text will appear here...";
    }
  };

  const getInputLabel = (mode) => {
    switch (mode) {
      case 'prompt':
        return 'Original Prompt';
      case 'coding-idea':
        return 'Coding Idea Description';
      case 'coding-roadmap':
        return 'Project Description';
      default:
        return 'Original Text';
    }
  };

  const getButtonText = (mode, isLoading) => {
    if (isLoading) return 'Processing...';
    
    switch (mode) {
      case 'prompt':
        return 'Enhance Prompt';
      case 'coding-idea':
        return 'Generate Solution';
      case 'coding-roadmap':
        return 'Create RoadMap';
      default:
        return 'Enhance Text';
    }
  };

  const getOutputLabel = (mode) => {
    switch (mode) {
      case 'prompt':
        return 'Enhanced Prompt';
      case 'coding-idea':
        return 'Coding Solution';
      case 'coding-roadmap':
        return 'Development RoadMap';
      default:
        return 'Enhanced Text';
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('chatcraft-theme', newTheme);
  };

  const modes = [
    { value: 'prompt', label: 'Enhance Prompt', icon: '🎯' },
    { value: 'grammar', label: 'Fix Grammar', icon: '✓' },
    { value: 'formal', label: 'Make Formal', icon: '👔' },
    { value: 'casual', label: 'Make Casual', icon: '😊' },
    { value: 'concise', label: 'Make Concise', icon: '📝' },
    { value: 'detailed', label: 'Add Details', icon: '📋' },
    { value: 'clear', label: 'Improve Clarity', icon: '💡' },
    { value: 'coding-idea', label: 'Coding Idea', icon: '💭' },
    { value: 'coding-roadmap', label: 'Coding RoadMap', icon: '🗺️' }
  ];

  if (showSettings) {
    return (
      <div className="app">
        <div className="settings-container">
          <div className="settings-header">
            <h2>AI Provider Setup</h2>
            <p>Configure your AI provider API keys for text and prompt enhancement. You can provide keys for multiple providers.</p>
          </div>
          
          <div className="providers-section">
            <h3>API Keys (Optional - provide any you have)</h3>
            
            <div className="form-group">
              <label htmlFor="openaiKey">
                <span className="provider-icon">🤖</span>
                OpenAI API Key:
              </label>
              <input
                id="openaiKey"
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                placeholder="sk-..."
                className="api-key-input"
              />
              <small>
                Get your API key from{' '}
                <a href="#" onClick={() => window.open('https://platform.openai.com/api-keys')}>
                  OpenAI Dashboard
                </a>
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="groqKey">
                <span className="provider-icon">⚡</span>
                Groq API Key:
              </label>
              <input
                id="groqKey"
                type="password"
                value={apiKeys.groq}
                onChange={(e) => setApiKeys({...apiKeys, groq: e.target.value})}
                placeholder="gsk_..."
                className="api-key-input"
              />
              <small>
                Get your API key from{' '}
                <a href="#" onClick={() => window.open('https://console.groq.com/keys')}>
                  Groq Console
                </a>
                {' '}(Note: Groq API keys start with 'gsk_')
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="deepseekKey">
                <span className="provider-icon">🧠</span>
                DeepSeek API Key:
              </label>
              <input
                id="deepseekKey"
                type="password"
                value={apiKeys.deepseek}
                onChange={(e) => setApiKeys({...apiKeys, deepseek: e.target.value})}
                placeholder="sk-..."
                className="api-key-input"
              />
              <small>
                Get your API key from{' '}
                <a href="#" onClick={() => window.open('https://platform.deepseek.com/api_keys')}>
                  DeepSeek Platform
                </a>
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="openrouterKey">
                <span className="provider-icon">🌐</span>
                OpenRouter API Key:
              </label>
              <input
                id="openrouterKey"
                type="password"
                value={apiKeys.openrouter}
                onChange={(e) => setApiKeys({...apiKeys, openrouter: e.target.value})}
                placeholder="sk-or-..."
                className="api-key-input"
              />
              <small>
                Get your API key from{' '}
                <a href="#" onClick={() => window.open('https://openrouter.ai/keys')}>
                  OpenRouter
                </a>
                {' '}(Free models available - no credit required!)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="defaultProvider">Default Provider:</label>
              <select 
                id="defaultProvider"
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="provider-select"
              >
                <option value="openai">🤖 OpenAI {apiKeys.openai ? '✓' : ''}</option>
                <option value="groq">⚡ Groq {apiKeys.groq ? '✓' : ''}</option>
                <option value="deepseek">🧠 DeepSeek {apiKeys.deepseek ? '✓' : ''}</option>
                <option value="openrouter">🌐 OpenRouter {apiKeys.openrouter ? '✓' : ''}</option>
              </select>
              <small>Choose your preferred AI provider for text enhancement</small>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="settings-actions">
            <button 
              onClick={saveApiKeys} 
              disabled={isLoading || !Object.values(apiKeys).some(key => key.trim())}
              className="primary-button"
            >
              {isLoading ? 'Testing & Saving...' : 'Save & Continue'}
            </button>
            {hasAnyKey && (
              <button 
                onClick={() => setShowSettings(false)}
                className="secondary-button"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ChatCraft</h1>
        <div className="header-actions">
          <button 
            onClick={toggleTheme}
            className="theme-toggle-button"
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="settings-button"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="controls">
          <div className="left-controls">
            <div className="mode-selector">
              <label>Enhancement Mode:</label>
              <select 
                value={selectedMode} 
                onChange={(e) => setSelectedMode(e.target.value)}
                className="mode-select"
              >
                {modes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {mode.icon} {mode.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="provider-selector">
              <label>AI Provider:</label>
              <select 
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="provider-select"
              >
                {availableProviders.map(provider => (
                  <option 
                    key={provider.name} 
                    value={provider.name}
                    disabled={!provider.configured}
                  >
                    {provider.label} {provider.configured ? '✓' : '❌'}
                  </option>
                ))}
              </select>
              {availableProviders.length > 0 && (
                <span className="provider-status">
                  {availableProviders.find(p => p.name === selectedProvider)?.configured ? 
                    <span className="status-configured">✓ Ready</span> : 
                    <span className="status-not-configured">❌ Not configured</span>
                  }
                </span>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={enhanceText}
              disabled={isLoading || !inputText.trim()}
              className="enhance-button primary-button"
            >
              {getButtonText(selectedMode, isLoading)}
            </button>
            <button 
              onClick={clearAll}
              className="clear-button secondary-button"
            >
              Clear All
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        
        {!hasAnyKey && (
          <div className="info-message">
            📝 Please configure at least one AI provider in settings to start enhancing text.
          </div>
        )}

        <div className="text-areas">
          <div className="text-panel">
            <div className="panel-header">
              <h3>{getInputLabel(selectedMode)}</h3>
              <span className="char-count">{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getPlaceholderText(selectedMode)}
              className="text-input"
              rows={12}
            />
          </div>

          <div className="text-panel">
            <div className="panel-header">
              <h3>{getOutputLabel(selectedMode)}</h3>
              <div className="panel-actions">
                <span className="char-count">{outputText.length} chars</span>
                {outputText && (
                  <button 
                    onClick={copyToClipboard}
                    className="copy-button"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={getOutputPlaceholderText(selectedMode)}
              className="text-output"
              rows={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;