# OTP Verification Service

A Node.js backend service that implements OTP verification using Twilio Verify API. Works both locally with Express.js and can be deployed to Vercel.

## Features

- 🔐 SMS OTP verification using Twilio Verify API
- 🚀 Health check endpoint for monitoring
- 📱 Send and verify OTP endpoints
- 🌐 Dual deployment: Local Express server + Vercel serverless
- ✅ CommonJS modules (require/module.exports)

## Project Structure

```
verification-services/
├── api/
│   ├── index.js          # Service info endpoint
│   ├── health.js         # Health check endpoint
│   ├── send-otp.js       # Send OTP endpoint
│   └── verify-otp.js     # Verify OTP endpoint
├── server.js             # Local Express server
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel deployment config
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Twilio credentials:
   ```
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
   ```

3. **Get Twilio credentials:**
   - Sign up at [Twilio Console](https://console.twilio.com/)
   - Get Account SID and Auth Token from Dashboard
   - Create a Verify Service and get the Service SID

## Local Development

```bash
npm run dev
```

Server will run at `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Service Info
```bash
GET /api/index
```

### Send OTP
```bash
POST /api/send-otp
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

### Verify OTP
```bash
POST /api/verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "code": "123456"
}
```

## Testing with curl

```bash
# Health check
curl http://localhost:3000/api/health

# Send OTP
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# Verify OTP
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "code": "123456"}'
```

## Deployment to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`

## Error Handling

The service includes comprehensive error handling:
- Invalid phone numbers
- Missing required fields
- Twilio API errors
- Invalid or expired OTP codes

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Configure ALLOWED_ORIGINS for production to restrict cross-origin requests
- Validate phone numbers on the client side
- Implement rate limiting in production