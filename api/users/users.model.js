const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = Schema({
  name: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "member"],
      message: "{VALUE} is not a valid role",
    },
  },
  age: Number,
});

userSchema.pre("save", async function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = model("User", userSchema);