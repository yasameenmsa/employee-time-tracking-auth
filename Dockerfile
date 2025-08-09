# Use the official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for native binaries
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with platform-specific binaries
RUN npm ci --only=production --platform=linux --arch=x64

# Rebuild lightningcss for the current platform
RUN npm rebuild lightningcss

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]