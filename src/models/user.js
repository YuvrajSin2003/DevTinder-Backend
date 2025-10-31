const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("This is not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true, // ensures "Male"/"FEMALE" become "male"/"female"
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("This is not a valid gender");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about section",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          // fixed mismatch with error message
          throw new Error("Skills should not be more than 10");
        }
      },
    },
    PhotoURL: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("This is not a valid URL");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({firstName:1 , lastName:1})

userSchema.methods.getJWT = async function () {
  const user = this; // represent the current user, this don't use arrow function
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$7900", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
