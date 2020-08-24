const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
//@route    GET api/users
//@desc     Test route
//@acess    Public
// router.get("/", (req, res) => {
//   res.send("User route");
// });

//@route    POST api/users
//@desc     Register user
//@acess    Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;

    try {
      //See if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }
      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //Encrypt the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //no need for user._id--mongoose handles it
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
