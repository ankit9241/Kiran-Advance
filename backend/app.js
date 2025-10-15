const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const { corsOptions, devCors } = require('./config/cors');

// Load env vars
require('dotenv').config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const apiRoutes = require('./routes');  // This will automatically load index.js

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET || 'your-secret-key'));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // 24 hours
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
  }
};

// Session middleware
app.use(session(sessionConfig));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  useTempFiles: true,
  tempFileDir: path.join(process.cwd(), 'tmp'),
  safeFileNames: true,
  preserveExtension: 4, // Keep .jpeg, .png, etc.
  abortOnLimit: true,
  limitHandler: (req, res, next) => {
    res.status(413).json({
      success: false,
      error: 'File size too large. Maximum allowed size is 5MB.'
    });
  }
}));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Apply CORS middleware with enhanced settings
const corsConfig = {
  ...corsOptions,
  // Ensure credentials are allowed
  credentials: true,
  // Explicitly set allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // Allow credentials to be sent
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Access-Token',
    'X-Refresh-Token'
  ],
  // Expose headers that the frontend needs to access
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'X-Access-Token',
    'X-Refresh-Token'
  ]
};

// Apply CORS middleware
app.use(cors(corsConfig));

// Handle preflight requests
app.options('*', cors(corsConfig));

// Add headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsConfig.origin.includes(origin) || corsConfig.origin === '*') {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', corsConfig.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(','));
    res.header('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(','));
  }
  next();
});

// Set static folders
const publicPath = path.join(__dirname, 'public');
const uploadsPath = path.join(__dirname, 'uploads');

// Create directories if they don't exist
[publicPath, uploadsPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Serve static files
app.use(express.static(publicPath));
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, path) => {
    // Set proper cache control for uploaded files
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Debug route to check file serving
app.get('/debug/uploads', (req, res) => {
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error reading uploads directory',
        message: err.message
      });
    }
    res.json({
      success: true,
      uploadsPath,
      files: files || []
    });
  });
});

// Mount all API routes under /api/v1
app.use('/api/v1', apiRoutes);

// Debug route to list all registered routes
app.get('/api/v1/debug/routes', (req, res) => {
  console.log('Debug routes endpoint hit');
  const routes = [];
  
  if (!app._router || !Array.isArray(app._router.stack)) {
    console.error('Router or router stack is not properly initialized');
    return res.status(500).json({ 
      success: false, 
      error: 'Router not properly initialized',
      stack: app._router ? 'Router exists but stack is not an array' : 'Router is undefined'
    });
  }
  
  // Helper function to extract routes
  const getRoutes = (stack, basePath = '') => {
    if (!stack) return;
    
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = layer.route.methods ? Object.keys(layer.route.methods).join(',').toUpperCase() : 'UNKNOWN';
        const path = basePath + (layer.route.path || '');
        routes.push(`${methods} ${path}`);
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        getRoutes(layer.handle.stack, basePath);
      }
    });
  };

  // Get all routes
  app._router.stack.forEach((layer) => {
    if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      getRoutes(layer.handle.stack, '');
    } else if (layer.route) {
      const methods = layer.route.methods ? Object.keys(layer.route.methods).join(',').toUpperCase() : 'UNKNOWN';
      routes.push(`${methods} ${layer.route.path}`);
    }
  });

  res.status(200).json({
    success: true,
    data: routes.sort()
  });
});

// Error handler middleware (must be after all other middleware and routes)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;
