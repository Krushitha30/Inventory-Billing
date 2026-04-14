const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "fallback_secret_local_only";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = decoded; // Contains id, role, name
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};

module.exports = { verifyToken, isAdmin };
