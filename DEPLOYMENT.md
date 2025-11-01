# Deployment Guide

This guide explains how to set up and use the CI/CD pipeline for deploying the Hack Test application.

## Prerequisites

1. **GitHub Repository** - Repository must be connected to the development
2. **Convex Dashboard Access** - https://dashboard.convex.dev
3. **Cloudflare Dashboard Access** - https://dash.cloudflare.com

## Required GitHub Secrets

### Convex Secrets
1. **`CONVEX_DEPLOY_KEY`** - Production deployment key
   - Go to: [Convex Dashboard → Settings → Deploy Keys](https://dashboard.convex.dev)
   - Click "Create production key"
   - Copy the key and add it to GitHub Secrets

### Cloudflare Secrets
2. **`CLOUDFLARE_API_TOKEN`** - API token with permissions
   - Go to: [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create API Token"
   - Use template "Custom Token"
   - Permissions: `Zone` - `Zone` - `Read`, `Zone` - `Zone Settings` - `Edit`
   - Resources: `Include All zones` or your specific zone
   - Add to GitHub Secrets

3. **`CLOUDFLARE_ACCOUNT_ID`** - Your Cloudflare account ID
   - Find in: Cloudflare Dashboard → Workers & Pages → Overview
   - Right sidebar shows "Account ID"
   - Add to GitHub Secrets

## Environment Variables Setup

### Convex Production Environment

1. **Access Production Environment:**
   ```bash
   # Check your current deployment
   npx convex deploy --prod-status --team=jojolang45-gmail-com
   ```

2. **Set Production Variables:**
   ```bash
   # Set your production URL (replace with your actual URL)
   npx convex env set SITE_URL=https://hack-test.workers.dev --prod --team=jojolang45-gmail-com
   
   # Verify variables are set
   npx convex env list --prod --team=jojolang45-gmail-com
   ```

### Local Development Environment

The `.env.local` file should contain:
```bash
# Development deployment
CONVEX_DEPLOYMENT=dev:pastel-ermine-347
CONVEX_URL=https://pastel-ermine-347.convex.cloud
VITE_CONVEX_SITE_URL=https://pastel-ermine-347.convex.cloud.site
CONVEX_SITE_URL=https://pastel-ermine-347.convex.cloud.site
SITE_URL=http://localhost:3001

# Auth secret (already generated)
BETTER_AUTH_SECRET=yqwisxzpaFWUkrrilx/YNOK5dF7RvQ0HIC0KQa/+GtU=
```

### Production Environment URLs

- **Production Convex URL**: `https://valuable-boar-377.convex.cloud`
- **Production Convex Site URL**: `https://valuable-boar-377.convex.cloud.site`
- **Development Convex URL**: `https://pastel-ermine-347.convex.cloud`
- **Development Convex Site URL**: `https://pastel-ermine-347.convex.cloud.site`

## Deployment Workflow

### Automatic Deployment (Main Branch)

1. **Push to `main` branch** triggers the deployment pipeline:
   ```
   git push origin main
   ```

2. **Pipeline Steps:**
   - ✅ Lint check using Oxlint
   - ✅ Type checking across all packages
   - ✅ Deploy Convex functions to production
   - ✅ Build and deploy frontend to Cloudflare Workers

3. **Monitor Progress:**
   - Go to: GitHub → Repository → Actions
   - View the "Deploy to Production" workflow

### Manual Deployment (If needed)

#### Convex Backend
```bash
cd packages/backend
npx convex deploy --prod --team=jojolang45-gmail-com
```

#### Frontend
```bash
cd apps/web
bun run build
bun run deploy
```

## Preview Deployments

Pull requests will trigger the preview workflow:
- Runs lint and type checking
- Does NOT deploy (testing only)
- Ensures code quality before merging

## Troubleshooting

### Convex Deployment Fails
1. Check `CONVEX_DEPLOY_KEY` in GitHub Secrets
2. Verify you're using the correct team name: `jojolang45-gmail-com`
3. Check if you need to generate a new production key

### Cloudflare Deployment Fails
1. Verify `CLOUDFLARE_API_TOKEN` has correct permissions
2. Check `CLOUDFLARE_ACCOUNT_ID` is correct
3. Ensure `wrangler.jsonc` configuration is correct

### Environment Variables Not Working
1. Ensure variables are set in the correct environment (prod vs dev)
2. Check variable names match exactly (case-sensitive)
3. Verify Better Auth secret is properly set

## Production URL

After successful deployment, your application will be available at:
- **Frontend**: `https://hack-test.workers.dev`
- **Convex Dashboard**: [https://dashboard.convex.dev](https://dashboard.convex.dev)

## Rollback

If deployment fails:
1. GitHub Actions shows error details in the workflow logs
2. Previous deployment remains active (blue-green deployment)
3. Fix issues and push again to retry deployment

## Best Practices

1. **Always test locally** before pushing to main
2. **Check workflow status** after each deployment
3. **Keep secrets secure** - never commit them
4. **Monitor production** using Convex dashboard and Cloudflare analytics
5. **Regular updates** - keep dependencies and workflow versions updated

## Support

- **GitHub Actions**: Check repository Actions tab
- **Convex Support**: [https://docs.convex.dev](https://docs.convex.dev)
- **Cloudflare Workers**: [https://developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- **TanStack Start**: [https://tanstack.com/start](https://tanstack.com/start)
