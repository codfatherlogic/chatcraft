# ChatCraft Theme & Icon Documentation

## 🎨 Theme System

ChatCraft now features a comprehensive dual-theme system with modern design elements.

### Theme Options

#### 🌙 Dark Theme (Default)
- **Primary Background**: `#0f0f23` (Deep navy blue)
- **Secondary Background**: `#1a1a2e` (Slightly lighter navy)
- **Accent Background**: `#16213e` (Accent navy)
- **Glass Effect**: `rgba(26, 26, 46, 0.85)` with 20px blur
- **Primary Text**: `#ffffff` (Pure white)
- **Secondary Text**: `#b8bcc8` (Light gray)
- **Accent Color**: `#6c63ff` (Purple)

#### ☀️ Light Theme
- **Primary Background**: `#ffffff` (Pure white)
- **Secondary Background**: `#f8fafc` (Very light gray)
- **Accent Background**: `#f1f5f9` (Light blue-gray)
- **Glass Effect**: `rgba(255, 255, 255, 0.85)` with 20px blur
- **Primary Text**: `#1e293b` (Dark slate)
- **Secondary Text**: `#64748b` (Medium gray)
- **Accent Color**: `#6366f1` (Indigo)

### Theme Features

✨ **Glass Morphism Design**
- Translucent backgrounds with backdrop blur effects
- Subtle borders and shadows
- Smooth transitions between elements

🎯 **Smart Color System**
- CSS custom properties for consistent theming
- Automatic contrast adjustments
- Semantic color naming

🔄 **Theme Toggle**
- Quick toggle button in header (☀️/🌙)
- Persistent theme preference storage
- Smooth transitions between themes

### Using the Theme System

The theme system uses CSS custom properties (variables) for easy customization:

```css
:root {
  --primary-bg: #0f0f23;
  --accent-color: #6c63ff;
  /* ... more variables */
}

[data-theme="light"] {
  --primary-bg: #ffffff;
  --accent-color: #6366f1;
  /* ... light theme overrides */
}
```

## 🖼️ Custom Icons

### Icon Design Elements

**🎨 Design Style**
- Modern, minimalist with subtle 3D elements
- Glass morphism effects with gradients
- Tech/AI-inspired visual language

**🎯 Core Elements**
- **Chat Bubble**: Represents conversation and communication
- **Gear/Cog**: Symbolizes crafting and enhancement
- **Sparkles**: Indicates AI magic and transformation
- **CC Monogram**: ChatCraft brand identity
- **Gradient Background**: Purple to blue gradient matching the app theme

### Icon Specifications

**📏 Sizes & Formats**
- **Primary Icon**: 1024x1024px SVG (`icon.svg`)
- **Medium Icon**: 512x512px SVG (`icon-512.svg`)
- **Small Icon**: 256x256px SVG (`icon-256.svg`)

**🎨 Color Palette**
- **Primary Gradient**: `#6c63ff` → `#4c46d6`
- **Chat Bubble**: White with subtle transparency
- **Gear**: Golden yellow (`#fbbf24`)
- **Sparkles**: Pure white with glow effect
- **Text**: White with text shadow

### Icon Files Location

```
assets/icons/
├── icon.svg          # 1024x1024 - Main application icon
├── icon-512.svg      # 512x512 - Medium size icon
└── icon-256.svg      # 256x256 - Small size icon
```

## 🛠️ Customization Guide

### 1. Changing Colors

Edit the CSS custom properties in `src/App.css`:

```css
:root {
  --accent-color: #your-color-here;
  --primary-bg: #your-background-here;
}
```

### 2. Adding New Themes

Create a new theme by adding a data attribute selector:

```css
[data-theme="your-theme"] {
  --primary-bg: #your-color;
  --accent-color: #your-accent;
  /* ... more overrides */
}
```

### 3. Modifying Icons

1. Edit the SVG files in `assets/icons/`
2. Update the `package.json` build configuration if needed
3. Rebuild the application

### 4. Theme Toggle Implementation

The theme toggle is implemented in `App.js`:

```javascript
const toggleTheme = () => {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setCurrentTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('chatcraft-theme', newTheme);
};
```

## 🚀 Build Integration

The enhanced theme and custom icons are automatically included in the build process:

```bash
# Build with new theme and icons
npm run dist-mac    # macOS with custom icons
npm run dist-win    # Windows with custom icons
npm run dist-all    # Both platforms
```

## 📱 Platform-Specific Features

### macOS
- Uses the high-resolution SVG icon for Retina displays
- Supports both Intel and Apple Silicon architectures
- Integrates with macOS dark/light mode preferences

### Windows
- Optimized icon for Windows taskbar and file explorer
- Supports both 64-bit and 32-bit architectures
- Compatible with Windows 10/11 design guidelines

## 🎯 Best Practices

1. **Theme Consistency**: Always use CSS custom properties for colors
2. **Icon Quality**: Use vector formats (SVG) for scalability
3. **Performance**: Minimize CSS complexity for smooth transitions
4. **Accessibility**: Ensure sufficient contrast in both themes
5. **User Experience**: Persist theme preferences across sessions

## 🔧 Troubleshooting

**Theme not switching?**
- Check if `data-theme` attribute is set on `<html>` element
- Verify CSS custom properties are properly defined

**Icons not showing in build?**
- Ensure icon files exist in `assets/icons/` directory
- Check `package.json` build configuration paths

**Colors look wrong?**
- Verify CSS custom property names match usage
- Check for typos in color values (must be valid CSS colors)

---

Your ChatCraft application now features a professional, modern theme system with custom icons that reflect the AI-powered nature of the application! 🎉