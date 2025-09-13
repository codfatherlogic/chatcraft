# ChatCraft

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-27.x-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

ChatCraft is a powerful, cross-platform desktop application that enhances your prompts and provides AI-powered coding assistance. Built with Electron and React, it supports multiple AI providers and offers a beautiful dual-theme interface.

## ✨ Features

### 🎯 **Multiple Enhancement Modes**
- **Prompt Enhancement**: Transform basic prompts into detailed, effective instructions
- **Coding Idea**: Get comprehensive implementation guides from brief project descriptions  
- **Coding RoadMap**: Generate structured development plans with phases and milestones

### 🤖 **Multi-AI Provider Support**
- **OpenAI** (GPT-3.5-turbo, GPT-4)
- **Groq** (Llama-3.1-8b-instant)
- **DeepSeek** (DeepSeek-Chat)
- **OpenRouter** (Free models available)

### 🎨 **Beautiful Interface**
- **Dual Theme System**: Dark and Light modes with smooth transitions
- **Glass Morphism Effects**: Modern, sleek UI design
- **Responsive Layout**: Adapts to different screen sizes
- **Real-time Provider Status**: Visual indicators for configured providers

### 🔒 **Secure & Private**
- **Local Storage**: All API keys stored securely on your device
- **No Data Collection**: Your conversations never leave your machine
- **Optional Configuration**: Use any subset of available providers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codfatherlogic/chatcraft.git
   cd chatcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   # Build React app
   npm run build
   
   # Create distributable packages
   npm run dist-all    # All platforms
   npm run dist-mac    # macOS only
   npm run dist-win    # Windows only
   ```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Electron app in production mode |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build React app for production |
| `npm run dist` | Create distributable for current platform |
| `npm run dist-all` | Create distributables for macOS and Windows |
| `npm run dist-mac` | Create macOS distributables (DMG + ZIP) |
| `npm run dist-win` | Create Windows distributables (EXE + ZIP) |
| `npm run pack` | Package app without creating installers |

## 🏗️ Project Structure

```
chatcraft/
├── public/
│   ├── electron.js      # Main Electron process (Legacy)
│   └── index.html       # HTML template
├── src/
│   ├── main.js          # Main Electron process
│   ├── preload.js       # Preload script for IPC
│   ├── App.js           # Main React component
│   ├── App.css          # Styles with theme system
│   └── index.js         # React entry point
├── assets/              # Static assets
├── BUILD.md             # Build instructions
├── THEME.md             # Theme customization guide
└── package.json         # Project configuration
```

## ⚙️ Configuration

### API Keys Setup

1. **Launch the application**
2. **Configure providers** in the settings panel
3. **Add API keys** for your preferred providers:

   - **OpenAI**: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)
   - **Groq**: Get from [Groq Console](https://console.groq.com/)
   - **DeepSeek**: Get from [DeepSeek Platform](https://platform.deepseek.com/)
   - **OpenRouter**: Get from [OpenRouter](https://openrouter.ai/) (free models available)

### Theme Customization

ChatCraft supports extensive theme customization. See [THEME.md](THEME.md) for detailed customization options.

## 🖥️ Supported Platforms

### macOS
- **Intel (x64)**: ChatCraft-1.0.0.dmg, ChatCraft-1.0.0-mac.zip
- **Apple Silicon (ARM64)**: ChatCraft-1.0.0-arm64.dmg, ChatCraft-1.0.0-arm64-mac.zip

### Windows  
- **64-bit**: ChatCraft Setup 1.0.0.exe, ChatCraft-1.0.0-win.zip
- **32-bit**: ChatCraft-1.0.0-ia32-win.zip

### Linux
- Support planned for future releases

## 🔧 Development

### Architecture
- **Frontend**: React 18.x with modern hooks
- **Desktop Framework**: Electron 27.x  
- **AI Integration**: OpenAI SDK with multi-provider support
- **Storage**: File-based configuration with local encryption
- **IPC**: Secure Inter-Process Communication between main and renderer

### Building from Source

1. **Development build**
   ```bash
   npm run dev
   ```

2. **Production build**
   ```bash
   npm run build
   npm run dist-all
   ```

3. **Platform-specific builds**
   ```bash
   # macOS (requires macOS)
   npm run dist-mac
   
   # Windows (works on any platform with wine)
   npm run dist-win
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/) and [React](https://reactjs.org/)
- AI powered by [OpenAI](https://openai.com/), [Groq](https://groq.com/), [DeepSeek](https://deepseek.com/), and [OpenRouter](https://openrouter.ai/)
- Icons and design inspiration from modern UI/UX principles

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/codfatherlogic/chatcraft/issues)
3. Create a [new issue](https://github.com/codfatherlogic/chatcraft/issues/new) if needed

---

**Made with ❤️ for developers and AI enthusiasts**