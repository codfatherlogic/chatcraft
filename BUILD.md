# ChatCraft - AI-Powered Text Enhancement Desktop App

## 🚀 Build Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Available Build Commands

#### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### Production Builds

#### Build for macOS
```bash
npm run dist-mac
```
This creates:
- `ChatCraft-1.0.0.dmg` (x64 Intel Macs)
- `ChatCraft-1.0.0-arm64.dmg` (ARM64 Apple Silicon)
- `ChatCraft-1.0.0-mac.zip` (x64 Intel Macs)
- `ChatCraft-1.0.0-arm64-mac.zip` (ARM64 Apple Silicon)

#### Build for Windows
```bash
npm run dist-win
```
This creates:
- `ChatCraft Setup 1.0.0.exe` (NSIS installer for both x64 and 32-bit)
- `ChatCraft-1.0.0-win.zip` (x64 portable)
- `ChatCraft-1.0.0-ia32-win.zip` (32-bit portable)

#### Build for Both Platforms
```bash
npm run dist-all
```

### 📦 Generated Files

After building, you'll find the following files in the `dist/` folder:

#### macOS Files
- **ChatCraft-1.0.0.dmg** - DMG installer for Intel Macs
- **ChatCraft-1.0.0-arm64.dmg** - DMG installer for Apple Silicon Macs
- **ChatCraft-1.0.0-mac.zip** - Portable app for Intel Macs
- **ChatCraft-1.0.0-arm64-mac.zip** - Portable app for Apple Silicon Macs

#### Windows Files
- **ChatCraft Setup 1.0.0.exe** - Windows installer (supports both x64 and 32-bit)
- **ChatCraft-1.0.0-win.zip** - Portable app for 64-bit Windows
- **ChatCraft-1.0.0-ia32-win.zip** - Portable app for 32-bit Windows

### 🔧 Features

- **Multi-AI Provider Support**: OpenAI, Groq, DeepSeek, OpenRouter
- **Free AI Option**: OpenRouter with free models
- **Multiple Enhancement Modes**:
  - 🎯 Enhance Prompt
  - ✓ Fix Grammar  
  - 👔 Make Formal
  - 😊 Make Casual
  - 📝 Make Concise
  - 📋 Add Details
  - 💡 Improve Clarity
  - 💭 Coding Idea (NEW)
  - 🗺️ Coding RoadMap (NEW)

### 📋 Distribution

#### For macOS Users:
- **Intel Macs**: Download `ChatCraft-1.0.0.dmg`
- **Apple Silicon (M1/M2/M3)**: Download `ChatCraft-1.0.0-arm64.dmg`

#### For Windows Users:
- **Recommended**: Download `ChatCraft Setup 1.0.0.exe` (installer)
- **Portable**: Download `ChatCraft-1.0.0-win.zip` (no installation needed)

### 🔒 Code Signing Notes

The current builds are unsigned. For distribution:
- **macOS**: Users may need to right-click and select "Open" on first launch
- **Windows**: Windows Defender may show a warning on first run

For production distribution, you should:
1. Sign macOS builds with a Developer ID certificate
2. Sign Windows builds with a code signing certificate

### 🛠️ Development

```bash
# Start development mode
npm run dev

# Build React app only
npm run build

# Package without building installers
npm run pack
```

### 📁 Project Structure

```
chatcraft/
├── dist/                 # Built applications
├── build/               # React build output
├── public/              # Static files
│   ├── index.html
│   └── electron.js      # Main Electron process
├── src/                 # React source
│   ├── App.js
│   ├── App.css
│   └── preload.js       # Electron preload script
└── package.json
```

### 🎉 Ready to Use!

Your ChatCraft application is now built and ready for distribution on both macOS and Windows platforms!