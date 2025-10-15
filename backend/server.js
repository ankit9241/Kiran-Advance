// Load environment variables first
require('dotenv').config({ path: './.env' });

console.log('🔍 Environment:', process.env.NODE_ENV || 'development');
console.log('📡 MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Missing');

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { corsOptions, allowedOrigins } = require('./config/cors');

// Connect to database with minimal logging
mongoose.set('debug', false); // Disable Mongoose debug logging
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB');
  process.exit(1);
});

// Create HTTP server
const server = http.createServer(app);

// Enhanced Socket.IO CORS configuration
const socketIOCors = {
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Content-Length',
    'X-Requested-With',
    'Accept',
    'X-Access-Token',
    'X-Refresh-Token'
  ],
  credentials: true
};

console.log('Initializing Socket.IO server with CORS:', {
  allowedOrigins: socketIOCors.origin === '*' ? 'ALL' : socketIOCors.origin,
  methods: socketIOCors.methods,
  credentials: socketIOCors.credentials
});

// Initialize Socket.io with minimal logging
const io = new Server(server, {
  path: '/socket.io',
  cors: socketIOCors,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
  cookie: false,
  // Disable debug logs
  maxHttpBufferSize: 1e8,
  serveClient: false,
  // Disable socket.io debug logs
  // @ts-ignore
  logger: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  },
  serveClient: false
});

// Debug Socket.IO events
io.engine.on('connection_error', (err) => {
  console.error('Socket.IO connection error:', {
    message: err.message,
    code: err.code,
    context: err.context,
    stack: err.stack
  });
});

// Log all Socket.IO events for debugging
const allEvents = ['connect', 'disconnect', 'error', 'connect_error', 'connect_timeout', 'reconnect', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed'];
allEvents.forEach(eventName => {
  io.on(eventName, (arg) => {
    console.log(`Socket.IO ${eventName} event:`, arg || 'No data');
  });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  console.log('New connection established:', {
    socketId: socket.id,
    clientIp,
    userAgent: socket.handshake.headers['user-agent'],
    query: socket.handshake.query,
    auth: socket.handshake.auth
  });
  
  let currentUser = null;
  
  // Handle authentication
  if (socket.handshake.auth && socket.handshake.auth.token) {
    try {
      // Verify JWT token here if needed
      // const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
      // currentUser = decoded;
      console.log('Authenticated user:', currentUser);
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('authentication_error', { message: 'Invalid or expired token' });
      socket.disconnect(true);
      return;
    }
  }

  // Join user to their own room using registration ID
  socket.on('join', (userData) => {
    currentUser = userData;
    if (userData.registrationId) {
      socket.join(userData.registrationId);
      console.log(`User ${userData.registrationId} (${userData.role}) joined their room`);
    }
  });

  // Handle chat messages
  socket.on('sendMessage', (data) => {
    try {
      // Validate message data
      if (!data.senderId || !data.recipientId || !data.message) {
        console.error('Invalid message data:', data);
        return;
      }
      
      // Emit message to recipient's room
      io.to(data.recipientId).emit('receiveMessage', {
        ...data,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Message from ${data.senderId} to ${data.recipientId}`);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle meeting updates
  socket.on('meetingUpdate', (data) => {
    if (data.registrationId) {
      io.to(data.registrationId).emit('meetingUpdated', data);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentUser) {
      console.log(`User ${currentUser.registrationId} (${currentUser.role}) disconnected`);
    } else {
      console.log('Unknown user disconnected');
    }
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Start the server
startServer();
