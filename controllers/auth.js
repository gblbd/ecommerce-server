const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");

exports.signup = (req, res, next) => {
  const { name, email, role, password } = req.body;

  try {
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.json("User email Already exists");
      } else {
        let newUser = new User({
          name,
          role,
          email,
          password,
        });

        newUser.save();

        const token = jwt.sign(
          {
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "365d",
          }
        );

        res.json({
          token,
          message: "Signup success!",
        });
      }
    });
  } catch (error) {
    res.json({
      message: "sign up failed",
      error,
    });
  }
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    if (
      user?.role === "super-admin" ||
      user.role === "admin" ||
      user.role === "user"
    ) {
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          phone: user.phone,
          address: user.address,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );

      return res.json({
        token,
      });
    } else {
      return res.status(400).json({
        error: "You are not admin user",
      });
    }
  });
};

//show user list
exports.userListData = async (req, res) => {
  try {
    const test = await User.find({});

    res.json(test);
  } catch (error) {
    res.json({ message: error });
  }
};
//read user
exports.read = async (req, res) => {
  const userId = req.ID;

  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    res.json(user);
  });
};

exports.userDelete = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await User.findByIdAndRemove(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
//update list
exports.userUpdateData = async (req, res) => {
  const userId = req.ID;
  const { address, phone } = req.body;
  try {
    const updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (address !== undefined) {
      updatedUser.address = address;
    }

    if (phone !== undefined) {
      updatedUser.phone = phone;
    }
    // updatedUser.address = address;
    await updatedUser.save();

    return res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
