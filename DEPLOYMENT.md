# Deployment Guide for Hostinger

## Option 1: Hostinger VPS/Cloud Hosting (Recommended)

### Prerequisites:
- Hostinger VPS or Cloud hosting plan
- SSH access to your server
- Node.js installed on the server

### Steps:

1. **Connect to your server via SSH:**
   ```bash
   ssh username@your-server-ip
   ```

2. **Install Node.js (if not installed):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload your project files:**
   ```bash
   # Option A: Using git
   git clone your-repository-url
   cd your-project-folder
   
   # Option B: Upload via FTP/SFTP
   # Upload all files to your domain folder
   ```

4. **Install dependencies:**
   ```bash
   npm install --production
   ```

5. **Set up environment variables:**
   ```bash
   # Create .env file with your Twilio credentials
   nano .env
   ```
   Add your Twilio credentials:
   ```
   TWILIO_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_VERIFY_SID=your_verify_service_sid
   PORT=3000
   ```

6. **Install PM2 for process management:**
   ```bash
   sudo npm install -g pm2
   ```

7. **Start your application:**
   ```bash
   pm2 start server.js --name "twilio-otp-api"
   pm2 startup
   pm2 save
   ```

8. **Configure Nginx (if needed):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Option 2: Hostinger Shared Hosting (Limited)

**Note:** Shared hosting has limitations for Node.js apps. VPS is recommended.

### If Node.js is supported:

1. **Upload files via File Manager or FTP**
2. **Create .env file** with your credentials
3. **Install dependencies** (if npm is available)
4. **Configure startup script** in hosting panel

## Option 3: Alternative Deployment (Recommended)

Since Hostinger shared hosting has limitations, consider these alternatives:

### Vercel (Free & Easy):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Render (Free tier available):
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

## Environment Variables for Production:

Make sure to set these in your hosting environment:
```
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=production
```

## Testing Your Deployment:

1. **Health Check:** `https://your-domain.com/health`
2. **API Docs:** `https://your-domain.com/api-docs`
3. **Send OTP:** POST to `https://your-domain.com/send-otp`

## Security Considerations:

1. **Use HTTPS** in production
2. **Set up firewall** rules
3. **Keep dependencies updated**
4. **Monitor logs** with PM2
5. **Set up backup** for your application

## Troubleshooting:

- Check PM2 logs: `pm2 logs`
- Restart app: `pm2 restart twilio-otp-api`
- Check port availability: `netstat -tulpn | grep :3000`