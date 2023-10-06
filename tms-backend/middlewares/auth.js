const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "sdufighnkjdshnihfwiohnc", async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await User.findOne({ _id: payload._id }).select(
        "-password"
      );
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
