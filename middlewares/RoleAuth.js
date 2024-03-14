// Role Check Middleware

function isAdmin(req, res, next) {
        // Check if the user is authenticated and has the 'admin' role
        if (req.user && req.user.role === 'admin') {
          // If the user is an admin, proceed to the next middleware
          console.log('User is admin. Proceeding to next middleware');
          next();
        } else {
          // If the user is not an admin, return a 403 Forbidden error
          console.log('User is not admin. Returning 403 error');
          res.status(403).json({ error: 'Unauthorized access' });
        }
      };
      

module.exports = isAdmin;