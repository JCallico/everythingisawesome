# GitHub Copilot Instructions

## Prime Directives
- Avold working on more than one file at a tine
- Multiple simultaneous edits to a file w111 cause corruption
- Be chatting and teach about what you are doing while coding
- Avoid creating temporary files or making changes that are not directly related to the requested feature, 1f you must, nake sure all temporary files are clearly marked and cleaned up after the feature is implemented.
- When implementing a feature that has already been implemented in the codebase, follow the same coding style and conventions used in the existing implementation. If the existing implementation is not well-structured or follows poor practices, suggest improvements and discuss before making changes.

## Core Principles

### Code Quality
- Write clean, readable, and maintainable code
- Follow established coding standards and best practices for the language/framework
- Include meaningful comments for complex logic
- Use descriptive variable and function names
- Prioritize code clarity over brevity

### Security First
- Never hardcode sensitive information (API keys, passwords, tokens)
- Sanitize and validate all user inputs
- Use environment variables for configuration
- Always use parameters instead of magic strings
- Use parameterized queries to prevent SQL injection
- Follow the least privilege principle, limit privileges and enforce role-based access control
- Implement logging and monitoring as part of your code suggestions
- Follow security best practices for the specific technology stack
- Consider potential security vulnerabilities in code suggestions

### Performance Considerations
- Write efficient algorithms and data structures
- Avoid unnecessary computations and memory allocations
- Consider scalability implications
- Use appropriate caching strategies when applicable
- Profile and optimize bottlenecks

### Mandatory Planning Phase
- When working with large fIles (>300 1ines) or complex changes:
    - ALMAYS start by creating a detailed plan BEFORE making any edits
    - Your plan MUST include:
        - All functions/sections that need modification
        - The order in which changes should be applied
        - Dependencies between changes
        - Estinated number of separate edits required

### Making edits
- Focus on one conceptual change at a time
- Show clear "before" and "after" snippets when proposing changes
- Include concise explanations of what changed and why
- Always check 1f the edit maintains the project's coding style
- Avold making changes on 1ines that are not directly related to the requested feature, be indful or indentation and invisible character

### Edit sequence:
1, [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
4. WAIT for explicit user confirmation before making ANY edits

### Execution phase
- After each individual edit, clearly Indicate progress:
    - "✅ Completed edit [#] of [total], Ready for next edit?"
- If you discover additional needed changes during editing:
    - STOP and update the plan
    - Get approval before continuing

### Refactoring guidance
- When refactoring large filest
    - Break work into logical, independent functional chunks
    - Ensure each intermediate state maintains functionality
    - Consider temporary duplication as a valid interim step
    - Always indicate the refactoring pattern being applied

### Rate limit avoidance
- For very large files, suggest splitting changes across multiple sessions
- Prioritize changes that are logically complete units
- Always provide clear stopping points




# Everything Is Awesome - Copilot Instructions

## Project Overview
This is a cross-platform monorepo for "Everything Is Awesome" - a positive news aggregation application that displays optimistic, feel-good news stories. The project includes web, mobile, and server components with shared libraries.

## Architecture & Structure

### Monorepo Structure
- **Root**: Main project with shared scripts and configuration
- **`/client`**: React 19 web application
- **`/mobile`**: React Native mobile app with Expo
- **`/server`**: Node.js/Express backend API
- **`/packages`**: Shared libraries and utilities
- **`/data`**: JSON data files for news stories
- **`/android`**: Android-specific files (if needed)

### Key Technologies
- **Frontend**: React 19, React Router DOM 7, CSS3 with glassmorphism
- **Mobile**: React Native, Expo SDK, React Navigation
- **Backend**: Node.js 22, Express.js, fs-extra
- **Data**: JSON files, AI analysis with Grok API
- **Deployment**: Azure Web Apps

## Code Style & Patterns

### JavaScript/React Conventions
- Use modern ES6+ syntax with async/await
- Functional components with React Hooks
- Use React Router DOM 7 for web navigation
- Use React Navigation for mobile navigation
- Implement proper error boundaries and loading states

### File Organization
- Components in `/components` directories
- Utilities in `/utils` directories
- Services in `/services` directories
- Shared code in `/packages` with proper npm linking
- Keep mobile-specific code in `/mobile/src`
- Keep web-specific code in `/client/src`

### Naming Conventions
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use kebab-case for file names when appropriate
- Use descriptive names for data files (e.g., `2025-07-10.json`)

## Key Features & Functionality

### News Data Management
- Stories are stored in JSON files in `/data` directory
- Each file represents a day's worth of curated stories
- Stories include title, summary, source, image, theme, and AI analysis
- Images are generated and stored in `/data/generated-images`

### AI Integration
- Uses Grok API for sentiment analysis and story processing
- Analyzes news articles for positivity and hope
- Generates themed content and categorization
- Fallback images generated for different themes

### Cross-Platform Considerations
- Shared business logic through `/packages/shared-api`
- Platform-specific UI implementations
- Responsive design for web, native feel for mobile
- Consistent data flow between platforms

## Development Guidelines

### When Working on Web (`/client`)
- Use React 19 features and hooks
- Implement glassmorphism design patterns
- Ensure responsive design for all screen sizes
- Use React Router DOM 7 for routing
- Import shared utilities from `@everythingisawesome/shared-api`

### When Working on Mobile (`/mobile`)
- Use React Native best practices
- Implement proper navigation with React Navigation
- Use Expo APIs for native features (haptics, blur, etc.)
- Ensure proper safe area handling
- Test on both iOS and Android if possible

### When Working on Server (`/server`)
- Use Express.js best practices
- Implement proper error handling and logging
- Use environment variables for configuration
- Ensure CORS is properly configured
- Handle file operations with fs-extra

### When Working on Shared Code (`/packages`)
- Keep code platform-agnostic
- Export functions and utilities properly
- Use proper npm package structure
- Update dependencies in consuming projects

## Common Commands

### Development
- `npm run dev` - Start web + server
- `npm run dev:mobile` - Start mobile + server
- `npm run dev:all` - Start web + mobile + server
- `npm run dev:ios` - Start iOS + server
- `npm run dev:android` - Start Android + server

### Setup & Installation
- `npm run setup` - Full project setup
- `npm run install-all` - Install all dependencies
- `npm run install:client` - Install client dependencies
- `npm run install:mobile` - Install mobile dependencies

### Data Management
- `npm run fetch-news` - Fetch and process news
- `npm run update-themes` - Update story themes
- `npm run generate-themed-fallbacks` - Generate fallback images
- `npm run cleanup-generated-images` - Clean up old images

### Build & Deploy
- `npm run build` - Build web app
- `npm run build:mobile` - Build mobile app
- `npm start` - Start production server

## Environment Configuration

### Required Environment Variables
- `GROK_API_KEY` - For AI analysis
- `GROK_MODEL` - AI text analysis model (defaults to grok-3-latest)
- `GROK_IMAGE_MODEL` - AI image generation model (defaults to grok-2-image)
- `NEWS_API_KEY` - For news fetching
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (defaults to 3001)

### Local Development
- Environment variables should be in `.env` file
- Web app runs on port 3000
- Server runs on port 3001
- Mobile app uses Expo development server

## Testing & Quality

### Linting
- ESLint configured for JavaScript/React
- Run `npm run lint` to check code
- Run `npm run lint:fix` to auto-fix issues

### Testing
- Jest configured for React testing
- Use React Testing Library for component tests
- Test files should be in `__tests__` or `.test.js` files

## Design Patterns

### UI/UX
- Glassmorphism design with blur effects
- Smooth animations and transitions
- Mobile-first responsive design
- Consistent color schemes and typography
- Intuitive navigation patterns

### Data Flow
- Server provides REST API endpoints
- Client and mobile apps consume same API
- Stories are pre-processed and stored as JSON
- Images are generated and cached locally

## Deployment

### Web Deployment
- Deployed to Azure Web Apps
- Uses `web.config` for Azure configuration
- Built files served from `/client/build`

### Mobile Deployment
- Uses Expo for React Native development
- Can be built for iOS App Store and Google Play
- Supports over-the-air updates

## Important Notes

### Performance Considerations
- Images are optimized and cached
- Stories are paginated for better performance
- Use lazy loading where appropriate
- Implement proper error boundaries

### SEO & Accessibility
- Proper meta tags and page titles
- Accessible navigation and content
- Semantic HTML structure
- Alt text for images

### Content Guidelines
- Focus on positive, uplifting news stories
- Maintain appropriate content filtering
- Respect source attribution
- Follow licensing requirements (CC-BY-NC-4.0)

## Troubleshooting

### Common Issues
- If `node-cron` is missing, server still runs (optional dependency)
- Check environment variables if API calls fail
- Ensure proper CORS configuration for cross-origin requests
- Verify file paths for image generation and data storage

### Development Tips
- Use `npm run setup` for initial project setup
- Run individual components with specific dev commands
- Check console logs for debugging information
- Use React DevTools for component debugging

## When Making Changes

1. **Always test both web and mobile** if changes affect shared code
2. **Update documentation** if adding new features or changing APIs
3. **Check for breaking changes** in shared packages
4. **Test with sample data** before deploying
5. **Verify image generation** still works after changes
6. **Check responsive design** on different screen sizes
7. **Test API endpoints** with proper error handling

## Code Review Guidelines

- Ensure code follows established patterns
- Check for proper error handling
- Verify responsive design implementation
- Test cross-platform compatibility
- Confirm proper use of shared libraries
- Check for performance implications
- Verify proper environment variable usage
