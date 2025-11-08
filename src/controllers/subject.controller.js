const Subject = require("../models/subject.model");

exports.createSubject = async (req, res, next) => {
  try {
    const { name, description, lessons, teacher, status } = req.body;

    const newSubject = new Subject({
      name,
      description,
      lessons,
      teacher,
      status,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json({
      message: "Tạo môn học thành công",
      data: savedSubject,
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate("lessons", "title")
      .populate("teacher", "name email");
    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
};

exports.getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("lessons", "title")
      .populate("teacher", "name email");
    if (!subject) return res.status(404).json({ message: "Không tìm thấy môn học" });
    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};


exports.updateSubject = async (req, res, next) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubject) return res.status(404).json({ message: "Không tìm thấy môn học để cập nhật" });
    res.status(200).json({
      message: "Cập nhật môn học thành công",
      data: updatedSubject,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ message: "Không tìm thấy môn học để xóa" });
    res.status(200).json({ message: "Xóa môn học thành công" });
  } catch (error) {
    next(error);
  }
};
