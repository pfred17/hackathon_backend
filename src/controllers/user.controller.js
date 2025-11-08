const User = require("../models/user.model");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, description, address, dateOfBirth, gender, avatar, role, status } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      phone,
      description,
      address,
      dateOfBirth,
      gender,
      avatar,
      role,
      status,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Tạo người dùng thành công",
      data: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    if (!updatedUser)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để cập nhật" });
    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Không tìm thấy người dùng để xóa" });
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    next(error);
  }
};

