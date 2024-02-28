const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Task = require("../model/taskData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        erroeMessage: "Bad Request",
      });
    }

    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    // hashing the paeeword before storing in database for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // creating the token and sending it to client

    const token = await jwt.sign(
      { userId: userData._id },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "user register successfully",
      token: token,
      name: name,
      email: userData.email,
      userId: userData._id,
      success:true
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({error})
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        erroeMessage: "Bad Request,Invalid Credential",
      });
    }
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res
        .status(401)
        .json({ erroeMessage: "Invalid Credentisls", success: false });
    }

    const passwordCheck = await bcrypt.compare(password, userDetails.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .json({ erroeMessage: "Invalid Credentisls", success: false });
    }

    const token = await jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "user logged in successfully",
      token: token,
      name: userDetails.name,
      email: userDetails.email,
      userId: userDetails._id,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({error})
  }
});

router.patch("/update/:id",verifyJwt, async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { name, oldPassword, newPassword } = req.body;
    if (!userId) {
      return res.status(400).json({
        errorMessage: "Something Went wrong Please Login Again",
      });
    }
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          errorMessage: "Bad Request,Invalid Credential",
        });
      }
      const userDetails = await User.findOne({ _id: userId }).select(
        "password"
      );
      if (!userDetails) {
        return res.status(404).json({
          errorMessage: "User not found",
        });
      }
      const passwordCheck = await bcrypt.compare(
        oldPassword,
        userDetails.password
      );
      if (!passwordCheck) {
        return res
          .status(401)
          .json({ errorMessage: "Invalid Password", success: false });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const response = await User.updateOne(
        { _id: userId },
        { $set: { password: hashedPassword } }
      );
    }
    if (name) {
      const responseName = await User.updateOne(
        { _id: userId },
        { $set: { name: name } }
      );
    }
 
    res.status(200).json({ success: true, message: "Update successful",name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});


router.get("/validatetoken", verifyJwt, (req, res) => {
  return res.status(200).json({ message: "token verified", success: true });
});

module.exports = router;
