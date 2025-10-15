// Middleware to check if user has required role(s)
const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // If roles is not an array, convert it to an array
    if (typeof roles === 'string') {
      roles = [roles];
    }

    // Check if user role is included in the allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

// Role-based middleware for student access
const studentAccess = checkRole('student');

// Role-based middleware for tutor access
const tutorAccess = checkRole('tutor');

// Role-based middleware for admin access
const adminAccess = checkRole('admin');

// Middleware for both tutor and admin access
const tutorOrAdminAccess = checkRole(['tutor', 'admin']);

module.exports = {
  checkRole,
  studentAccess,
  tutorAccess,
  adminAccess,
  tutorOrAdminAccess
};
