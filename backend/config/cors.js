// Base allowed origins
const baseOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

// Add any additional origins from environment variable
const additionalOrigins = process.env.ADDITIONAL_CORS_ORIGINS 
  ? process.env.ADDITIONAL_CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [];

const allowedOrigins = [...new Set([...baseOrigins, ...additionalOrigins])];

// Common CORS options
const commonCorsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Content-Length',
    'X-Requested-With',
    'Accept',
    'X-Access-Token',
    'X-Refresh-Token',
    'X-Requested-With'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Set-Cookie',
    'X-Access-Token',
    'X-Refresh-Token'
  ],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 600 // Cache preflight request for 10 minutes
};

const corsOptions = {
  ...commonCorsOptions,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin - allowing request');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowed CORS for origin: ${origin}`);
      return callback(null, true);
    }
    
    // Check for localhost with any port in development
    if (process.env.NODE_ENV === 'development' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      console.log(`🔵 Allowed localhost in development: ${origin}`);
      return callback(null, true);
    }
    
    console.log(`❌ Blocked CORS for origin: ${origin}`);
    console.log('Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  }
};

// Development middleware - completely permissive with detailed logging
const devCors = (req, res, next) => {
  const origin = req.headers.origin;
  const requestId = Math.random().toString(36).substring(2, 8);
  
  console.log(`\n🔷 [${requestId}] New ${req.method} request to ${req.path}`);
  console.log(`🔹 Origin: ${origin || 'No origin header'}`);
  
  // Set CORS headers
  const allowOrigin = origin || '*';
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, X-Access-Token, X-Refresh-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range, Set-Cookie, X-Access-Token, X-Refresh-Token');
  
  // Log the headers being set
  console.log(`🔹 Set CORS headers for origin: ${allowOrigin}`);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`🔹 [${requestId}] Handled OPTIONS preflight request`);
    return res.status(204).end();
  }
  
  // Add response finish listener to log the response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    console.log(`🔷 [${requestId}] ${req.method} ${req.path} -> ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log(`🔴 Error response:`, chunk?.toString()?.substring(0, 200));
    }
    originalEnd.call(res, chunk, encoding);
  };
  
  next();
};

module.exports = {
  corsOptions,
  devCors,
  allowedOrigins
};
