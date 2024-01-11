const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// here User is like an basket which is storing the entire userSchema
const User = mongoose.model("User", userSchema);

module.exports = User  //if we have to use this data anywhere else then we should use this line for it
