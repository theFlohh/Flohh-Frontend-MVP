# AGENT.md - Flohh Frontend MVP

## Build/Test Commands
- `npm start` - Start development server (localhost:3000)
- `npm test` - Run Jest tests in watch mode
- `npm test -- --testNamePattern="TestName"` - Run specific test
- `npm run build` - Production build to `build/` folder
- `npm run eject` - Eject from CRA (one-way operation)

## Architecture
- **Tech Stack**: React 19.1, Create React App, Tailwind CSS, Axios
- **Backend API**: https://floahh-backend.onrender.com/api (configurable in Services/Api.js)
- **Main Directories**: Components/, Pages/, Services/, Context/, Routes/
- **Authentication**: JWT token stored in localStorage, managed by AuthContext
- **Routing**: React Router with role-based protected routes (admin/client)

## Code Style
- **Files**: Use .jsx extension for React components
- **Imports**: Absolute imports from src/, group external then internal imports
- **Components**: PascalCase filenames, functional components with hooks
- **Styling**: Tailwind CSS classes, responsive design patterns
- **API**: Centralized in Services/Api.js with Axios interceptors
- **State**: Context API for global state (AuthContext), local state with useState
- **Authentication**: Protected routes via ProtectedRoute component
- **Error Handling**: Global API error handling in Axios interceptors
