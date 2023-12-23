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
        const data = {
          statusCode: 200,
          success: true,
          message: "Signup success! Please sign in",
          data: newUser,
        };

        res.json({
          data,
          message: "Signup success! Please sign in",
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
        { _id: user._id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );
      const { _id, name, role, email } = user;

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
  const _id = req.params.id;
  console.log("gfg", _id);

  User.findById(_id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    res.json(user);
  });
};
//delete user
exports.userDelete = async (req, res) => {
  try {
    const { id } = req.body;

    await User.deleteOne({ _id: id });

    res.json({ message: "successfully deleted" });
  } catch (error) {
    res.json({ message: error });
  }
};
//update list
exports.userUpdateData = async (req, res) => {
  const { name, email, id } = req.body;

  await User.findByIdAndUpdate(id, {
    $set: {
      name: name,
      email: email,
    },
  });

  return res.json({
    name: name,
    email: email,
  });
};
