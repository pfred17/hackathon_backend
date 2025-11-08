const User = require("../models/user.model");

exports.getAllUser = async () => {
  return await User.find({});
};

exports.findById = async (id) => {
  return await User.findById(id).select("-password");
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

exports.updateById = async (id, fields) => {
  return await User.findByIdAndUpdate(id, fields, { new: true }).select(
    "-password"
  );
};
