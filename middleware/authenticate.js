// const jwt = require("jsonwebtoken");
// const secretKey = "your_secret_key"; // Replace with your actual secret key

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized access: No token provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract the token
//   try {
//     const decoded = jwt.verify(token, secretKey); // Verify token
//     req.userId = decoded.userId; // Attach userId to request
//     next(); // Pass control to the next middleware or route handler
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(401).json({ message: "Unauthorized access: Invalid token" });
//   }
// };

// module.exports = authenticate;
