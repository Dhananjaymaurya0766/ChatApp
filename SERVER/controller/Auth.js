const jwt = require("jsonwebtoken");
exports.auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        console.log("Token received:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        req.user = decoded;
        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};