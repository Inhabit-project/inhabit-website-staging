/** @type {import('million').Config} */
export default {
  // Enable automatic optimization
  auto: true,
  
  // Optimize specific components
  components: {
    // Optimize the Hero component for better performance
    Hero: {
      // Enable aggressive optimization for above-the-fold content
      aggressive: true,
      // Optimize animations
      animations: true,
    },
    
    // Optimize the MainPage component
    MainPage: {
      // Enable lazy loading optimization
      lazy: true,
      // Optimize route transitions
      routes: true,
    },
  },
  
  // Build optimizations
  build: {
    // Enable tree shaking
    treeShaking: true,
    // Enable code splitting
    codeSplitting: true,
    // Optimize bundle size
    bundleOptimization: true,
  },
  
  // Runtime optimizations
  runtime: {
    // Enable React optimizations
    react: true,
    // Enable performance monitoring
    performance: true,
  },
};

