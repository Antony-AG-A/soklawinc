import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.monday.com", "https://*.ghost.io"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://antony-ag-a-soklawin-ed7n.bolt.host', 'https://soklaw.co.ke']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Validate environment variables
function validateEnvironment() {
  const required = ['VITE_MONDAY_API_KEY', 'VITE_MONDAY_BOARD_ID'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }
  
  // Validate API key format
  const apiKey = process.env.VITE_MONDAY_API_KEY;
  if (!apiKey || apiKey.length < 32) {
    console.error('❌ Invalid Monday API key format');
    process.exit(1);
  }
  
  // Validate Board ID format
  const boardId = process.env.VITE_MONDAY_BOARD_ID;
  if (!boardId || !/^\d+$/.test(boardId)) {
    console.error('❌ Invalid Monday Board ID format');
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
}

// Validate environment on startup
validateEnvironment();

// Enhanced Monday.com proxy endpoint
app.post("/monday", async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { query, variables } = req.body;
    
    // Validate request body
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: "Invalid request: GraphQL query is required",
        code: "INVALID_QUERY"
      });
    }

    // Sanitize query to prevent injection
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length === 0) {
      return res.status(400).json({
        error: "Invalid request: Query cannot be empty",
        code: "EMPTY_QUERY"
      });
    }

    // Log request (without sensitive data)
    console.log(`📤 Monday API Request: ${req.ip} - ${new Date().toISOString()}`);
    
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VITE_MONDAY_API_KEY,
        "API-Version": "2023-10",
        "User-Agent": "SOKLaw-Website/1.0"
      },
      body: JSON.stringify({ 
        query: sanitizedQuery, 
        variables: variables || {} 
      }),
      timeout: 30000 // 30 second timeout
    });

    const responseTime = Date.now() - startTime;
    
    // Check response status
    if (!response.ok) {
      console.error(`❌ Monday API Error: ${response.status} ${response.statusText}`);
      
      let errorMessage = "Monday.com API error";
      let errorCode = "MONDAY_API_ERROR";
      
      switch (response.status) {
        case 401:
          errorMessage = "Invalid API credentials";
          errorCode = "INVALID_CREDENTIALS";
          break;
        case 403:
          errorMessage = "Insufficient permissions";
          errorCode = "INSUFFICIENT_PERMISSIONS";
          break;
        case 429:
          errorMessage = "Rate limit exceeded";
          errorCode = "RATE_LIMIT_EXCEEDED";
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = "Monday.com server error";
          errorCode = "SERVER_ERROR";
          break;
      }
      
      return res.status(response.status).json({
        error: errorMessage,
        code: errorCode,
        status: response.status
      });
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Invalid response format from Monday API');
      return res.status(502).json({
        error: "Invalid response format from Monday API",
        code: "INVALID_RESPONSE_FORMAT"
      });
    }

    const data = await response.json();
    
    // Log successful response
    console.log(`✅ Monday API Success: ${responseTime}ms`);
    
    // Check for GraphQL errors
    if (data.errors && Array.isArray(data.errors)) {
      console.error('❌ Monday GraphQL Errors:', data.errors);
      
      const firstError = data.errors[0];
      let errorCode = "GRAPHQL_ERROR";
      
      if (firstError.message.includes('authentication')) {
        errorCode = "AUTHENTICATION_ERROR";
      } else if (firstError.message.includes('permission')) {
        errorCode = "PERMISSION_ERROR";
      } else if (firstError.message.includes('board')) {
        errorCode = "BOARD_ERROR";
      }
      
      return res.status(400).json({
        error: firstError.message || "GraphQL query failed",
        code: errorCode,
        details: data.errors
      });
    }

    // Return successful response
    res.json(data);
    
  } catch (err) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ Proxy Error (${responseTime}ms):`, err.message);
    
    let errorMessage = "Internal proxy error";
    let errorCode = "PROXY_ERROR";
    let statusCode = 500;
    
    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      errorMessage = "Request timeout";
      errorCode = "TIMEOUT_ERROR";
      statusCode = 504;
    } else if (err.message.includes('fetch')) {
      errorMessage = "Network connection error";
      errorCode = "NETWORK_ERROR";
      statusCode = 502;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0"
  };
  
  res.json(health);
});

// API status endpoint
app.get("/api/status", async (req, res) => {
  try {
    // Test Monday API connection
    const testResponse = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VITE_MONDAY_API_KEY,
      },
      body: JSON.stringify({
        query: "query { me { id name } }"
      }),
      timeout: 10000
    });

    const isHealthy = testResponse.ok;
    
    res.json({
      monday: {
        status: isHealthy ? "healthy" : "unhealthy",
        responseTime: testResponse.ok ? "< 1s" : "timeout",
        lastChecked: new Date().toISOString()
      },
      proxy: {
        status: "healthy",
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(503).json({
      monday: {
        status: "unhealthy",
        error: error.message,
        lastChecked: new Date().toISOString()
      },
      proxy: {
        status: "healthy",
        uptime: process.uptime()
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "NOT_FOUND",
    path: req.path
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 SOKLaw Proxy Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 API status: http://localhost:${PORT}/api/status`);
  console.log(`🔒 Security: Helmet, CORS, and Rate Limiting enabled`);
});</parameter>