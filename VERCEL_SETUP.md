# Vercel Deployment Setup Guide

## Environment Variables Required

Your "Failed to fetch" error is likely due to missing environment variables in Vercel. Follow these steps:

### 1. Set up Appwrite Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
```

### 2. Get Your Appwrite Project ID

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Select your project (or create a new one)
3. Copy the **Project ID** from the settings
4. Replace `your-appwrite-project-id` with your actual Project ID

### 3. Configure Appwrite Platform Settings

In your Appwrite console:

1. Go to **Settings** → **Platforms**
2. Add a new **Web Platform**
3. Set the hostname to your Vercel domain (e.g., `your-app.vercel.app`)
4. Also add `localhost` for local development

### 4. Common Issues & Solutions

#### "Failed to fetch" Error
- **Cause**: Missing environment variables or wrong Appwrite configuration
- **Solution**: Ensure all environment variables are set in Vercel

#### OAuth Redirect Issues
- **Cause**: Incorrect redirect URLs in Appwrite
- **Solution**: Update OAuth redirect URLs in Appwrite console to match your Vercel domain

#### CORS Errors
- **Cause**: Domain not added to Appwrite platform settings
- **Solution**: Add your Vercel domain to Appwrite platforms

### 5. Test Your Setup

After setting environment variables:
1. Redeploy your Vercel app (or it should auto-deploy)
2. Check browser console for any error messages
3. Try creating an account - it should work now

### 6. Debugging Steps

If still having issues:
1. Check Vercel build logs for errors
2. Check browser network tab for failed requests
3. Verify environment variables are actually set in Vercel
4. Check Appwrite console for any authentication errors

## Need Help?

If you're still experiencing issues, check:
- Appwrite project status and quotas
- Network connectivity
- Browser console for detailed error messages