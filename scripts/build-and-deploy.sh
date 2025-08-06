#!/bin/bash

echo "🚀 Building project with optimized caching..."

# Build the project
bun run build

# Run the CSS replacement script
node scripts/replace-css-hash.js

echo "✅ Build completed with optimized caching"

# If running in Docker, rebuild the container
if [ -f "docker-compose.yml" ]; then
    echo "🐳 Rebuilding Docker container..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Container rebuilt and restarted"
else
    echo "📝 To apply changes, restart your web server"
fi

echo "🎉 Deployment complete! Cache headers are now optimized." 