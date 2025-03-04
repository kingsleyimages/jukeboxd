const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]; // Extract token

	if (!token) {
		return res
			.status(401)
			.json({ error: "Unauthorized: No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
		req.user = decoded; // Attach user info to request object
		next();
	} catch (error) {
		return res.status(403).json({ error: "Invalid token" });
	}
};

module.exports = authenticateUser;
