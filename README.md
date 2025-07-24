# INHABIT Project

A modern React application showcasing biodiversity corridors with an interactive 3D background, fluid typography, smooth animations, and comprehensive SEO optimization.

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- GSAP for advanced animations
- React Three Fiber for 3D graphics
- Custom fluid typography system using CSS clamp
- React Helmet Async for SEO meta tag management
- Comprehensive SEO optimization with structured data

## SEO Features

### 🚀 Advanced SEO Implementation

- **Comprehensive Meta Tags**: All pages include proper title, description, keywords, and robots meta tags
- **Open Graph & Twitter Cards**: Full social media sharing optimization with proper images and descriptions
- **Structured Data (JSON-LD)**: Schema.org markup for better search engine understanding
- **Canonical URLs**: Proper canonical links to prevent duplicate content issues
- **Multilingual SEO**: Hreflang tags for English and Spanish language support
- **XML Sitemap**: Auto-generated sitemap with proper priorities and change frequencies
- **Robots.txt**: Search engine crawling guidelines
- **Web App Manifest**: PWA support with proper icons and theme colors
- **Performance Optimized**: Font preloading and optimized loading strategies

### 📱 Mobile & Accessibility

- **Apple Touch Icons**: Proper iOS app icons and status bar styling
- **Theme Colors**: Consistent brand colors across platforms
- **Skip Links**: Accessibility navigation for screen readers
- **Semantic HTML**: Proper heading structure and ARIA labels

### 🌐 Multilingual Support

- **Translation-Based SEO**: Dynamic SEO content from i18n translations
- **Language-Specific URLs**: Proper URL structure for different languages
- **Locale-Aware Open Graph**: Language-specific social media optimization

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd INHABIT
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
INHABIT/
├── src/
│   ├── components/         # React components
│   │   └── HeroBackground.tsx
│   ├── styles/
│   │   └── globals.css    # Global styles and fluid typography
│   ├── types/
│   │   └── fonts.d.ts     # Type declarations
│   └── App.tsx            # Main application component
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
└── package.json          # Project dependencies and scripts
```

## Features

- Fluid typography system using CSS clamp
- Responsive design with Tailwind CSS
- 3D animated background with Three.js
- Smooth animations with Framer Motion and GSAP
- Custom color scheme and font combinations
- Glassmorphism effects
- Mobile-friendly navigation

## Typography

The project uses three main fonts:
- Montserrat for headings
- IBM Plex Sans Condensed for subheadings
- Nunito Sans for body text

All typography is fluid and scales smoothly across different viewport sizes using CSS clamp.

## Color Scheme

- Primary: `#1B3625` (Dark Green)
- Secondary: `#DBE0D4` (Light Gray)
- Accent: `#D57300` (Orange)
- Text: `#F6FFF4` (Off White)
- Background: `#1B3625` (Dark Green)

## Browser Support

The project supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
