# Deploy to Vercel - Step by Step Guide

## Method 1: Using Vercel CLI (Recommended)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from your project directory
```bash
# Navigate to your project folder
cd twilio-otp-backend

# Deploy
vercel
```

### 4. Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → twilio-otp-backend (or your preferred name)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### 5. Set Environment Variables
After deployment, add your Twilio credentials:

```bash
# Add environment variables
vercel env add TWILIO_SID
vercel env add TWILIO_AUTH_TOKEN  
vercel env add TWILIO_VERIFY_SID
```

Or set them in the Vercel dashboard:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `TWILIO_SID` = your_account_sid
   - `TWILIO_AUTH_TOKEN` = your_auth_token
   - `TWILIO_VERIFY_SID` = your_verify_service_sid

### 6. Redeploy with environment variables
```bash
vercel --prod
```

## Method 2: Using Vercel Dashboard (Web Interface)

### 1. Prepare your code
- Make sure all files are in a GitHub repository
- Include the `vercel.json` configuration file

### 2. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### 3. Add Environment Variables
In the deployment settings, add:
- `TWILIO_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_VERIFY_SID`

### 4. Deploy
Click "Deploy" and wait for completion.

## Testing Your Deployment

Once deployed, you'll get a URL like: `https://your-project-name.vercel.app`

### Test endpoints:
- **Health Check**: `https://your-project-name.vercel.app/health`
- **API Docs**: `https://your-project-name.vercel.app/api-docs`
- **Send OTP**: `POST https://your-project-name.vercel.app/send-otp`
- **Verify OTP**: `POST https://your-project-name.vercel.app/verify-otp`

## Important Notes:

1. **Serverless Functions**: Vercel runs Node.js as serverless functions
2. **Cold Starts**: First request might be slower due to cold start
3. **Free Tier**: 100GB bandwidth, 100 serverless function invocations per day
4. **Custom Domain**: You can add your own domain in Vercel dashboard

## Troubleshooting:

- **Build fails**: Check `vercel.json` configuration
- **Environment variables**: Make sure they're set in Vercel dashboard
- **CORS issues**: Update CORS settings if needed for your frontend domain
- **Logs**: Check function logs in Vercel dashboard

## Update Your React App:

After deployment, update your React app's API base URL:
```javascript
const API_BASE_URL = 'https://your-project-name.vercel.app';
```

Your backend is now live and ready to handle OTP requests! 🚀