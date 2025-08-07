# 🚀 Everything Is Awesome - Development & Deployment Guide

This comprehensive guide covers both local development setup and production deployment for the "Everything Is Awesome" cross-platform application.

## 📋 Table of Contents

- [Quick Start Development](#-quick-start-development)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Mobile Development](#-mobile-development)
- [Shared Libraries](#-shared-libraries)
- [Environment Configuration](#-environment-configuration)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start Development

### Prerequisites
- **Node.js 22+** - Required for all components
- **npm** - Package manager
- **Expo CLI** - For mobile development: `npm install -g @expo/cli`
- **Git** - Version control

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/JCallico/everythingisawesome.git
cd everythingisawesome

# Install all dependencies (root, client, mobile, server, packages)
npm run install-all

# Create environment file from template
cp .env.example .env
# Edit .env with your API keys (see Environment Configuration section)
```

### Start Development Servers

**Web + Server (Most Common):**
```bash
npm run dev
# Web: http://localhost:3000
# API: http://localhost:3001
```

**Mobile + Server:**
```bash
npm run dev:mobile
# Mobile: Use Expo app to scan QR code
# API: http://localhost:3001
```

**Everything (Web + Mobile + Server):**
```bash
npm run dev:all
# Web: http://localhost:3000
# Mobile: Use Expo app to scan QR code  
# API: http://localhost:3001
```

**Platform-Specific Mobile:**
```bash
npm run dev:ios     # iOS simulator + server
npm run dev:android # Android emulator + server
```

## 📁 Project Structure

### Root Level Organization
```
everythingisawesome/
├── client/                 # React Web Application (port 3000)
├── mobile/                 # React Native Mobile App
├── server/                 # Node.js Backend API (port 3001)
├── packages/               # Shared Libraries (Monorepo)
├── data/                   # Persistent Data Storage
├── docs/                   # Documentation
├── android/                # Android build configuration
└── .github/workflows/      # CI/CD Pipeline
```

### Key Development Folders
- **`client/src/`** - React web components, services, and styles
- **`mobile/src/`** - React Native screens, components, and services
- **`server/`** - Express API routes, jobs, and utilities
- **`packages/shared-*/`** - Cross-platform shared libraries
- **`data/`** - JSON news files and generated images

### Shared Libraries Architecture
```
packages/
├── shared-api/         # Platform-agnostic API layer
├── shared-components/  # Reusable UI components
├── shared-constants/   # Application constants
├── shared-docs/        # Documentation utilities
├── shared-hooks/       # Custom React hooks
├── shared-types/       # TypeScript/JSDoc types
├── shared-utils/       # Common utility functions
└── shared/             # Core shared functionality
```

## 💻 Local Development

### Web Development Workflow
1. **Start development server:** `npm run dev`
2. **Open browser:** Navigate to http://localhost:3000
3. **Live reload:** Changes automatically reflected
4. **API testing:** Backend available at http://localhost:3001

### Development Commands
```bash
# Build production version locally
npm run build

# Start production server locally
npm start

# Fetch latest news data
npm run fetch-news

# Generate themed fallback images
npm run generate-themed-fallbacks

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Style & Standards
- **ESLint configuration** - Consistent code formatting
- **Modern ES6+ syntax** - async/await, destructuring, modules
- **React Hooks** - Functional components preferred
- **Responsive design** - Mobile-first approach
- **Glassmorphism UI** - Consistent design language

## 📱 Mobile Development

### Setup & Prerequisites
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# For iOS development (macOS only)
# Install Xcode from App Store

# For Android development
# Install Android Studio and configure emulator
```

### Mobile Development Workflow
1. **Start mobile server:** `npm run dev:mobile`
2. **Test on device:** Install Expo Go app and scan QR code
3. **Test on simulator:** Use iOS Simulator or Android Emulator
4. **Web preview:** Navigate to http://localhost:19006

### Mobile-Specific Commands
```bash
# Platform-specific development
npm run dev:ios          # iOS simulator + server
npm run dev:android      # Android emulator + server

# Mobile app commands (run from /mobile directory)
cd mobile
npm start                # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run web version
```

### Mobile Testing Strategy
1. **Physical Device Testing:**
   - Install Expo Go app
   - Scan QR code from development server
   - Test on actual iOS and Android devices

2. **Simulator Testing:**
   - iOS Simulator (macOS only)
   - Android Emulator (cross-platform)
   - Web browser for React Native Web

3. **Cross-Platform Features:**
   - Swipe gestures and touch interactions
   - Haptic feedback (device-specific)
   - Native sharing functionality
   - Platform-specific UI adaptations

## 🔄 Shared Libraries

### Development Strategy
The monorepo uses shared libraries to maintain consistency across web and mobile platforms:

### Key Shared Packages
- **`shared-api`** - Centralized API calls and data fetching
- **`shared-utils`** - Common utility functions (date formatting, text processing)
- **`shared-constants`** - Application constants and configuration
- **`shared-types`** - Type definitions for consistent data structures
- **`shared-hooks`** - Custom React hooks for common functionality

### Using Shared Libraries
```javascript
// In web (client/src/components/...)
import { fetchNewsData } from '@everythingisawesome/shared-api';

// In mobile (mobile/src/screens/...)
import { formatDate } from '@everythingisawesome/shared-utils';
```

### Adding New Shared Code
1. **Identify common functionality** between web and mobile
2. **Create in appropriate shared package** (`packages/shared-*/`)
3. **Export from package index.js**
4. **Import in consuming applications**
5. **Test on both platforms**

## 🔧 Environment Configuration

### Required Environment Variables
Create a `.env` file in the root directory:

```env
# Required for news fetching and AI analysis
GROK_API_KEY=your_grok_api_key_here
NEWS_API_KEY=your_news_api_key_here

# AI Model Configuration (optional - defaults provided)
GROK_MODEL=grok-3-latest
GROK_IMAGE_MODEL=grok-2-image

# Optional - Development settings
NODE_ENV=development
PORT=3001

# Optional - API limits (cost management)
MAX_ARTICLES_TO_PROCESS=50
```

### API Key Setup
1. **Grok API Key:**
   - Sign up at [x.ai](https://x.ai)
   - Navigate to API section
   - Generate API key
   - Add to `.env` as `GROK_API_KEY`

2. **AI Model Configuration:**
   - `GROK_MODEL` - Text analysis model (default: grok-3-latest)
   - `GROK_IMAGE_MODEL` - Image generation model (default: grok-2-image)
   - These can be updated when newer models become available

3. **NewsAPI Key:**
   - Sign up at [newsapi.org](https://newsapi.org)
   - Get free API key (100 requests/day)
   - Add to `.env` as `NEWS_API_KEY`

### Environment-Specific Configuration
- **Development:** Uses `.env` file for local development
- **Production:** Uses Azure App Service settings
- **Testing:** Uses test-specific environment variables

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Platform-specific tests
cd client && npm test    # Web app tests
cd mobile && npm test    # Mobile app tests
cd server && npm test    # Server tests
```

### Test Structure
- **Unit Tests:** Individual component and function testing
- **Integration Tests:** API endpoint and data flow testing
- **Cross-Platform Tests:** Shared library functionality
- **Mobile Tests:** React Native component testing

### Quality Assurance
- **ESLint:** Code quality and consistency
- **Jest:** JavaScript testing framework
- **React Testing Library:** React component testing
- **Manual Testing:** Cross-platform functionality validation

## 🚀 Production Deployment

### Azure Cloud Deployment

**Live Application:** [https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/](https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/)

### Deployment Architecture
- **Platform:** Azure Web App (Windows App Service Plan)
- **Runtime:** Node.js 22
- **Build:** Automated via GitHub Actions
- **Storage:** Persistent data in `/data` folder
- **SSL:** Automatic HTTPS with Azure certificates

### Required Azure App Service Settings
Configure these in Azure Portal → App Service → Configuration:

```env
NODE_ENV=production
GROK_API_KEY=your_actual_grok_api_key
GROK_MODEL=grok-3-latest
GROK_IMAGE_MODEL=grok-2-image
NEWS_API_KEY=your_actual_news_api_key
WEBSITE_NODE_DEFAULT_VERSION=~22
```

### GitHub Secrets Configuration
Configure these in GitHub Repository → Settings → Secrets:

- `GROK_API_KEY` - Your X.AI Grok API key
- `NEWS_API_KEY` - Your NewsAPI.org key
- `AZURE_WEBAPP_PUBLISH_PROFILE` - Azure deployment profile (auto-configured)

**Note:** GROK_MODEL and GROK_IMAGE_MODEL are configured in the deployment workflow with default values and can be customized in Azure App Service settings if needed.

## 🔄 CI/CD Pipeline

### Automated Deployment Workflow

The project uses GitHub Actions for comprehensive CI/CD with manual approval gates:

### Pipeline Stages

**1. Build & Quality Gates:**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   BUILD JOB     │───▶│ PRE-APPROVAL     │───▶│ APPROVAL JOB    │
│                 │    │   SUMMARY        │    │                 │
│ • Install deps  │    │                  │    │ • Manual gate   │
│ • Run linting   │    │ • Generate       │    │ • Review info   │
│ • Build client  │    │   review summary │    │ • Approve/Reject│
│ • Build mobile  │    │ • Display status │    │                 │
│ • Run tests     │    │                  │    │                 │
│ • Upload build  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   DEPLOY JOB    │
                                                │                 │
                                                │ • Download      │
                                                │   artifacts     │
                                                │ • Deploy to     │
                                                │   Azure         │
                                                │ • Verify        │
                                                └─────────────────┘
```

**2. Multi-Platform Validation:**
- ✅ **Web Application:** React build, ESLint, testing
- ✅ **Mobile Application:** React Native validation, Expo configuration
- ✅ **Server:** Node.js API validation and testing
- ✅ **Shared Libraries:** Cross-platform compatibility checks

**3. Manual Approval Gate:**
- 📋 **Pre-Approval Summary:** Comprehensive build status review
- 🔐 **Human Review:** Manual approval required before production deployment
- 📊 **Quality Gate Results:** Detailed status of all platform validations

### Setting Up Manual Approval

**Step 1: Create GitHub Environment**
1. Go to repository **Settings** → **Environments**
2. Click **New environment**, name it `production`
3. Enable **Required reviewers** protection rule
4. Add team members who can approve deployments

**Step 2: Approval Process**
1. **Build completes** → Pre-approval summary generated
2. **Review required** → GitHub notifies configured reviewers
3. **Manual review** → Reviewer examines build summary and quality gates
4. **Approve/Reject** → Deployment proceeds or stops based on decision

### Deployment Features
- ✅ **Data Persistence:** News data and generated images survive deployments
- ✅ **Zero Downtime:** Rolling deployment with health checks
- ✅ **Rollback Capability:** Previous versions maintained for quick rollback
- ✅ **Environment Variables:** Secure configuration management
- ✅ **Monitoring:** Application health and performance tracking

## 🔍 Troubleshooting

### Common Development Issues

**1. API Keys Not Working:**
```bash
# Check environment variables are loaded
node -e "console.log(process.env.GROK_API_KEY ? 'Grok API key loaded' : 'Missing Grok API key')"
node -e "console.log(process.env.NEWS_API_KEY ? 'News API key loaded' : 'Missing News API key')"

# Verify .env file exists and has correct format
cat .env
```

**2. Mobile App Not Starting:**
```bash
# Clear Expo cache
npx expo start -c

# Reset Metro bundler
npx react-native start --reset-cache

# Check Expo CLI version
npx expo --version
```

**3. Port Conflicts:**
```bash
# Kill processes on ports 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Or use different ports
npm run dev -- --port 3002
```

**4. Shared Package Issues:**
```bash
# Reinstall all dependencies
npm run install-all

# Check package linking
ls -la node_modules/@everythingisawesome/
```

### Deployment Troubleshooting

**1. Build Failures:**
- Check GitHub Actions logs for specific error messages
- Verify all environment variables are configured in Azure
- Ensure Node.js version compatibility (22.x required)

**2. Manual Approval Issues:**
- Verify GitHub Environment is configured with required reviewers
- Check notification settings for approval alerts
- Ensure reviewer has proper repository permissions

**3. Azure Deployment Issues:**
```bash
# Test Azure CLI connection
az webapp show --name everythingisawesome --resource-group your-rg

# Check application logs
az webapp log tail --name everythingisawesome --resource-group your-rg

# Verify environment variables
az webapp config appsettings list --name everythingisawesome --resource-group your-rg
```

### Performance Optimization

**Development:**
- Use `npm run dev` for faster development builds
- Enable hot module replacement for instant updates
- Use React DevTools for component debugging

**Production:**
- Optimize bundle size with code splitting
- Enable compression for faster loading
- Use CDN for static assets
- Monitor performance with Azure Application Insights

### Getting Help

**Documentation:**
- Main README.md - Project overview and features
- Individual package READMEs - Component-specific documentation
- Code comments - Inline documentation for complex logic

**External Resources:**
- [React Documentation](https://reactjs.org/docs) - Web development
- [React Native Documentation](https://reactnative.dev/docs) - Mobile development
- [Expo Documentation](https://docs.expo.dev/) - Mobile platform tools
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/) - Deployment platform

---

## 🎯 Development Best Practices

### Code Organization
- **Consistent naming:** Use camelCase for variables, PascalCase for components
- **File structure:** Group related functionality together
- **Import order:** External dependencies first, then internal modules
- **Comments:** Document complex logic and business rules

### Cross-Platform Development
- **Shared logic:** Use shared libraries for common functionality
- **Platform-specific code:** Keep platform differences minimal and well-documented
- **Testing:** Validate functionality on both web and mobile platforms
- **Performance:** Consider mobile constraints when designing features

### Security
- **Environment variables:** Never commit API keys or sensitive data
- **Input validation:** Sanitize all user inputs and API responses
- **HTTPS:** Always use secure connections in production
- **Dependencies:** Keep packages updated and audit for vulnerabilities

---

✨ **Ready to Build Something Awesome!** This guide provides everything you need for local development and production deployment of the cross-platform "Everything Is Awesome" application.
