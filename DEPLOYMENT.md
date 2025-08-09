# Deployment Guide - Fixing Lightningcss Issues

This guide provides multiple solutions for deploying your Next.js application with Tailwind CSS v4 and lightningcss dependencies.

## Problem Overview

The deployment error occurs because:
- Tailwind CSS v4 uses lightningcss which requires platform-specific native binaries
- Developing on Windows but deploying to Linux causes binary compatibility issues
- Package-lock.json synchronization issues between different environments

## Solution 1: Render.yaml (Recommended for Render)

Use the `render.yaml` file for native Render deployment:

```yaml
services:
  - type: web
    name: calculate-app
    env: node
    buildCommand: |
      npm ci --platform=linux --arch=x64
      npm rebuild lightningcss
      npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

## Solution 2: Updated Dockerfile (Recommended for Docker)

The main `Dockerfile` has been updated with:

### Key Changes:
1. **Uses `npm install` instead of `npm ci`** - Handles version mismatches gracefully
2. **Excludes package-lock.json in .dockerignore** - Forces fresh lock file creation
3. **Uses `npm prune --omit=dev`** - Modern way to remove dev dependencies
4. **Rebuilds lightningcss** - Ensures Linux-compatible binaries

### Build Command:
```bash
docker build -t calculate-app .
docker run -p 3000:3000 calculate-app
```

## Solution 3: Multi-stage Dockerfile (Alternative)

For more complex deployments, use `Dockerfile.alternative`:

### Features:
- Multi-stage build for optimized image size
- Separate development and production stages
- More robust dependency handling
- Cleaner final image

### Build Command:
```bash
docker build -f Dockerfile.alternative -t calculate-app-optimized .
```

## Solution 4: Local Development Fix

If you encounter issues locally:

```bash
# Regenerate package-lock.json
npm install

# Rebuild lightningcss for your platform
npm rebuild lightningcss
```

## Environment Variables

Ensure these environment variables are set in production:

```env
NODE_ENV=production
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=employee-time-tracking
```

## Troubleshooting

### If you still get lightningcss errors:

1. **Clear Docker cache:**
   ```bash
   docker system prune -a
   ```

2. **Force rebuild without cache:**
   ```bash
   docker build --no-cache -t calculate-app .
   ```

3. **Check platform compatibility:**
   ```bash
   docker build --platform linux/amd64 -t calculate-app .
   ```

### If package-lock.json issues persist:

1. **Delete and regenerate:**
   ```bash
   rm package-lock.json
   npm install
   ```

2. **Use npm install in Docker:**
   - The updated Dockerfile already handles this
   - .dockerignore excludes package-lock.json

## Deployment Platforms

### Render
- Use `render.yaml` configuration
- Automatically handles Linux binary compilation

### Vercel
- Use `vercel.json` configuration
- Built-in Next.js optimization

### Docker (any platform)
- Use updated `Dockerfile`
- Works on any Docker-compatible platform

### Manual Server
- Ensure Node.js 20+ is installed
- Run `npm install` on the target server
- Use PM2 or similar for process management

## Best Practices

1. **Always test builds locally** before deploying
2. **Use consistent Node.js versions** across environments
3. **Keep dependencies updated** to avoid compatibility issues
4. **Monitor build logs** for early error detection
5. **Use multi-stage builds** for production optimization

## Files Modified

- `Dockerfile` - Updated with robust dependency handling
- `.dockerignore` - Added package-lock.json exclusion
- `render.yaml` - Render-specific deployment configuration
- `Dockerfile.alternative` - Multi-stage build option
- `package-lock.json` - Regenerated for consistency

All solutions ensure that the correct lightningcss Linux binaries are available during deployment, resolving the "Cannot find module '../lightningcss.linux-x64-gnu.node'" error.