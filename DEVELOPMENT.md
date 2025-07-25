# Everything Is Awesome - Development Guide

## Quick Reference

### Start Development
```bash
# Web + Server
npm run dev

# Mobile + Server  
npm run dev:mobile

# Everything
npm run dev:all
```

### Project URLs
- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **Mobile**: Use Expo app or http://localhost:19006 (web preview)

### Key Folders
- `client/` - React web app
- `mobile/` - React Native mobile app
- `server/` - Express API & jobs
- `shared/` - Common utilities
- `data/` - News data storage

### Environment Variables
Create `.env` file in root with:
```
GROK_API_KEY=your_grok_api_key
NEWS_API_KEY=your_news_api_key
```

### Mobile Testing
1. Install Expo app on phone
2. Run `npm run dev:mobile`
3. Scan QR code with Expo app

### Shared Code Strategy
- API logic in `shared/api.js`
- Utilities in `shared/utils.js`
- Types in `shared/types.js`
- Platform-specific implementations in respective folders

### Common Commands
```bash
npm run install-all          # Install all dependencies
npm run fetch-news           # Fetch latest news
npm run generate-themed-fallbacks  # Generate fallback images
```
