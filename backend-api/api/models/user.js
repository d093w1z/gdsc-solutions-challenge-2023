const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique:true },
  uuid: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  phone: {
    type: String,
    required: [true, "User phone number required"],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! 10-digit phone number required`,
    },
    unique: true
  },
});

module.exports = mongoose.model("User", userSchema);
