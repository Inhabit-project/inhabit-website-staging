# Load Components

This folder contains all loading-related components and transitions for the application.

## Components

### `Loader.tsx`
- **Purpose**: Main application loader for the hero component only
- **Usage**: Shows on main page reload with progress animation and earth graphic
- **Props**: 
  - `onLoadingComplete?: () => void` - Callback when loading completes
  - `isMainHeroLoader?: boolean` - Explicit flag to ensure it only works for main hero

### `SubLoader.tsx`
- **Purpose**: General-purpose loading spinner for data fetching states
- **Usage**: Used throughout the app for API calls and content loading
- **Props**:
  - `isLoading: boolean` - Controls visibility of the loader
- **Styles**: Uses `SubLoader.css` for animations

### `PageTransition.tsx`
- **Purpose**: Smooth page transitions between routes
- **Usage**: Handles the covering/revealing animation during navigation
- **Props**:
  - `in: boolean` - true for reveal transition, false for cover transition
  - `onComplete?: () => void` - Callback when transition completes

## Styles

### `SubLoader.css`
- Contains all animations and styles specific to the SubLoader component
- Includes backdrop blur effects and loading animations

## Usage

```typescript
// Import individual components
import { Loader, SubLoader, PageTransition } from '@/load';

// Or import directly
import Loader from '@/load/Loader';
import SubLoader from '@/load/SubLoader';
import PageTransition from '@/load/PageTransition';
```

## File Structure
```
src/load/
├── README.md          # This documentation
├── index.ts           # Export declarations
├── Loader.tsx         # Main hero loader
├── SubLoader.tsx      # General loading spinner  
├── SubLoader.css      # SubLoader styles
└── PageTransition.tsx # Page transition component
``` 