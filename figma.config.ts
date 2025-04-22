import { defineConfig } from '@motion-canvas/project';

export default defineConfig({
  // Your Figma access token
  figma: {
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
    fileId: '3846:33500', // Your Figma file ID from the URL
    nodeId: '3846:33501', // The node ID of your main frame
  },
  
  // Project metadata
  name: 'INHABIT',
  description: 'Global Corridor of Biodiversity',
  
  // Output configuration
  output: {
    path: './src/motion',
    resolution: {
      width: 1920,
      height: 1080,
    },
  },
  
  // Scene configuration
  scenes: [
    {
      name: 'Hero',
      component: () => import('./src/scenes/Hero.tsx'),
      timelineLength: 5, // Duration in seconds
    },
  ],
  
  // Animation configuration
  animation: {
    fps: 60,
    defaultEasing: 'easeInOutCubic',
  },
}); 