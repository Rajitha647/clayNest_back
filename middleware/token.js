const JWT = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "kh56dfgj";

const createToken = async (user) => {
  const token = await JWT.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid token format" });
  }

  
  const token = authHeader.split(" ")[1];

  
  JWT.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    req.userId = decoded.userId;
    next();
  });
};

module.exports = {
  createToken,
  verifyToken,
};
