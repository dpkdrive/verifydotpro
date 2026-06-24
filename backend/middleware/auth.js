const jwt = require('jsonwebtoken');

// function requireAdminAuth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided. Access denied.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = decoded; // { id, email }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// }

function requireAdminAuth(req, res, next) {
  console.log("============== AUTH ==============");
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Bearer Token");
    return res.status(401).json({
      message: "No token provided. Access denied.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded User:", decoded);

    req.admin = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

module.exports = requireAdminAuth;
