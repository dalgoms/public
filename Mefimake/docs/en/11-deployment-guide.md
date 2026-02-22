# Deployment Guide

This guide covers deploying MEFIMAKE to production using Vercel.

---

## Overview

MEFIMAKE is a static web application with no server-side requirements. Deployment is straightforward:

1. Push code to GitHub
2. Connect to Vercel
3. Deploy

---

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Git installed locally
- Node.js 16+ (optional, for local testing)

---

## GitHub Setup

### 1. Create Repository

```bash
# Navigate to project directory
cd meta-ad-generator

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MEFIMAKE v1.0.0"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/mefimake.git

# Push to GitHub
git push -u origin main
```

### 2. Repository Settings

Recommended settings:
- **Branch protection:** Require PR for main branch
- **Visibility:** Public (for open source) or Private
- **Topics:** `ad-creative`, `design-tool`, `javascript`, `no-build`

### 3. .gitignore

```gitignore
# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Dependencies (if any)
node_modules/

# Local files
*.local
.env

# Build output (N/A for this project)
dist/
build/
```

---

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select "Import Git Repository"
5. Choose the `mefimake` repository
6. Click "Import"

### 2. Configure Build Settings

Since MEFIMAKE has no build step:

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Build Command | (leave empty) |
| Output Directory | `.` |
| Install Command | (leave empty) |

### 3. Environment Variables

No environment variables are required for the base deployment.

For future features (API keys, etc.):

1. Go to Project Settings → Environment Variables
2. Add variables as needed
3. Redeploy to apply

### 4. Deploy

Click "Deploy" and wait for completion (~30 seconds).

Your site will be available at:
- `https://your-project.vercel.app`
- `https://your-project-git-main-username.vercel.app`

---

## Custom Domain

### 1. Add Domain

1. Go to Project Settings → Domains
2. Enter your domain (e.g., `mefimake.com`)
3. Click "Add"

### 2. Configure DNS

Vercel provides DNS records to add:

**Option A: Apex Domain**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B: Subdomain**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. No action required.

---

## Production Optimization

### 1. vercel.json Configuration

Create `vercel.json` in project root:

```json
{
    "headers": [
        {
            "source": "/assets/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        },
        {
            "source": "/(.*\\.css)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        },
        {
            "source": "/(.*\\.js)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        }
    ],
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

### 2. Security Headers

Add security headers:

```json
{
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                },
                {
                    "key": "Referrer-Policy",
                    "value": "strict-origin-when-cross-origin"
                }
            ]
        }
    ]
}
```

### 3. Compression

Vercel automatically applies Brotli/Gzip compression. No configuration needed.

---

## Preview Deployments

Every pull request automatically gets a preview deployment:

1. Create PR on GitHub
2. Vercel bot posts preview URL in PR comments
3. Review changes at preview URL
4. Merge PR to deploy to production

### Preview URL Format
```
https://project-name-git-branch-name-username.vercel.app
```

---

## Continuous Deployment

### Automatic Deployment

By default, every push to `main` triggers a production deployment.

### Deployment Hooks

For external triggers (CI/CD, Slack, etc.):

1. Go to Project Settings → Git
2. Scroll to "Deploy Hooks"
3. Create a new hook
4. Use the webhook URL to trigger deployments:

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxxxx
```

---

## Rollback

### Via Vercel Dashboard

1. Go to Project → Deployments
2. Find the working deployment
3. Click "..." menu
4. Select "Promote to Production"

### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

---

## Monitoring

### Built-in Analytics

Vercel provides:
- Real-time logs
- Deployment status
- Error tracking (via integrations)

### Performance Monitoring

1. Go to Project → Analytics
2. View Core Web Vitals
3. Track performance over time

### Error Notifications

1. Go to Project → Settings → Notifications
2. Configure email/Slack alerts for:
   - Deployment failures
   - Domain issues
   - Error spikes

---

## Alternative Deployment Options

### Netlify

```toml
# netlify.toml
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages

1. Go to Repository Settings → Pages
2. Select source branch (main)
3. Select folder (root)
4. Access at `https://username.github.io/mefimake`

### Self-Hosted

Any static file server works:

```bash
# Nginx example
server {
    listen 80;
    server_name mefimake.com;
    root /var/www/mefimake;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Troubleshooting

### Build Fails

**Issue:** Vercel can't build the project.

**Solution:** Ensure build command is empty (no build required).

### 404 on Refresh

**Issue:** Direct URL access returns 404.

**Solution:** Add rewrite rule in `vercel.json`:
```json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

### Assets Not Loading

**Issue:** Images or fonts not loading in production.

**Solution:** Check paths are relative (`assets/logo.png` not `/assets/logo.png`).

### CORS Issues

**Issue:** External resources blocked.

**Solution:** For MEFIMAKE, all resources are bundled. If adding external APIs:
1. Use Vercel Serverless Functions as proxy
2. Or configure CORS on the external API

---

## Deployment Checklist

Before deploying to production:

- [ ] All features tested locally
- [ ] No console errors
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] vercel.json configured
- [ ] Assets optimized
- [ ] Custom domain configured (if applicable)
- [ ] SSL working
- [ ] Performance check (Lighthouse)
- [ ] Cross-browser testing

---

## Cost Considerations

### Vercel Free Tier

- 100 GB bandwidth/month
- Unlimited deployments
- 1 team member
- HTTPS included

### When to Upgrade

Consider Pro tier ($20/mo) if:
- Team collaboration needed
- Higher bandwidth required
- Advanced analytics needed
- Custom build configurations

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/community)
- [Vercel Status](https://vercel-status.com)
