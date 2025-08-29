# SOK Law Associates Website

A modern, responsive website for SOK Law Associates built with React, TypeScript, and Tailwind CSS, featuring Monday.com CRM integration and Ghost CMS blog functionality.

## 🚀 Features

- **Modern Design**: Professional, responsive design with smooth animations
- **Monday.com Integration**: Secure contact form with CRM integration
- **Ghost CMS Blog**: Dynamic blog posts with full article pages
- **Team Profiles**: Comprehensive team member profiles and information
- **Service Pages**: Detailed service descriptions and information
- **Mobile Optimized**: Fully responsive across all device sizes
- **Security**: Comprehensive API security and error handling

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Backend**: Express.js proxy server
- **CRM**: Monday.com API integration
- **Blog**: Ghost CMS API
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- Monday.com account with API access
- Ghost CMS instance (optional, for blog functionality)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Monday.com CRM Configuration
VITE_MONDAY_API_KEY=your_monday_api_key_here
VITE_MONDAY_BOARD_ID=your_board_id_here

# Ghost CMS Configuration (Optional)
VITE_GHOST_API_URL=https://your-ghost-site.ghost.io/ghost/api/v3/content/posts/
VITE_GHOST_API_KEY=your_ghost_content_api_key_here

# Proxy Configuration
VITE_PROXY_URL=http://localhost:4000/monday

# Environment
NODE_ENV=development
```

### 3. Monday.com Setup

1. **Get API Key**:
   - Go to Monday.com → Profile → Admin → API
   - Generate a new API token
   - Copy the token to `VITE_MONDAY_API_KEY`

2. **Get Board ID**:
   - Create or select a board for contact submissions
   - The board ID is in the URL: `monday.com/boards/[BOARD_ID]`
   - Copy the ID to `VITE_MONDAY_BOARD_ID`

3. **Configure Board Columns**:
   - Ensure your board has these column types:
     - Email column (type: email)
     - Phone column (type: phone)  
     - Service column (type: status or dropdown)
     - Message column (type: long_text)

### 4. Ghost CMS Setup (Optional)

1. **Get API Credentials**:
   - Go to Ghost Admin → Integrations → Add Custom Integration
   - Copy the Content API Key to `VITE_GHOST_API_KEY`
   - Copy your Ghost URL to `VITE_GHOST_API_URL`

## 🚀 Running the Application

### Development Mode

```bash
# Start the proxy server (Terminal 1)
node server.js

# Start the development server (Terminal 2)
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Proxy Server**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔒 Security Features

### API Key Management
- Environment variable configuration
- API key validation and format checking
- Secure proxy server with authentication
- Rate limiting and request throttling

### Error Handling
- Comprehensive error categorization
- Secure error logging (sensitive data redaction)
- Retry logic with exponential backoff
- User-friendly error messages

### Security Middleware
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input sanitization and validation

## 🧪 Testing & Monitoring

### Health Checks

The application includes comprehensive health monitoring:

```bash
# Check proxy server health
curl http://localhost:4000/health

# Check API status
curl http://localhost:4000/api/status
```

### Monday.com Connection Testing

The contact form includes real-time connection monitoring:
- Green indicator: CRM connected and healthy
- Yellow indicator: CRM degraded performance
- Red indicator: CRM connection issues

### Error Monitoring

All errors are logged with:
- Timestamp and error codes
- Sanitized request data
- Response times and performance metrics
- Automatic retry attempts

## 📱 Responsive Design

The website is optimized for all screen sizes:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Key responsive features:
- Fluid typography scaling
- Touch-optimized interactions
- Optimized image loading
- Adaptive layouts

## 🔧 Troubleshooting

### Common Issues

1. **Monday CRM Connection Failed**
   - Verify API key is correct and active
   - Check board ID exists and is accessible
   - Ensure board has required column types

2. **Contact Form Not Submitting**
   - Check browser console for error messages
   - Verify proxy server is running on port 4000
   - Test API status endpoint: `/api/status`

3. **Blog Posts Not Loading**
   - Verify Ghost API credentials
   - Check Ghost site is accessible
   - Review network tab for API errors

### Debug Mode

Enable detailed logging by setting:
```bash
NODE_ENV=development
ENABLE_API_LOGGING=true
```

## 📚 API Documentation

### Monday.com Integration

The contact form integrates with Monday.com using these key functions:

- `getBoardColumns()`: Fetches board structure
- `createBoardItem()`: Creates new contact records
- `mondayHealthCheck()`: Monitors API health

### Ghost CMS Integration

Blog functionality uses Ghost Content API:

- Fetches published posts with metadata
- Supports pagination and filtering
- Includes author and tag information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for SOK Law Associates.

## 📞 Support

For technical support or questions:
- **Email**: tech@soklaw.co.ke
- **Phone**: +254 700 123 456

---

**SOK Law Associates** - Excellence in Legal Practice Since 2009</parameter>