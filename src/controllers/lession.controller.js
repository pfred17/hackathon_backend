const Lesson = require("../models/lession.model");

exports.createLesson = async (req, res, next) => {
  try {
    const { title, description, subject, resources, students, assignments, status } = req.body;

    const newLesson = new Lesson({
      title,
      description,
      subject,
      resources,
      students,
      assignments,
      status,
    });

    const savedLesson = await newLesson.save();
    res.status(201).json({
      message: "Tạo bài học thành công",
      data: savedLesson,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find()
      .populate("subject", "name")
      .populate("students", "name email");
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};

exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("subject", "name")
      .populate("students", "name email");
    if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học" });
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLesson) return res.status(404).json({ message: "Không tìm thấy bài học để cập nhật" });
    res.status(200).json({
      message: "Cập nhật bài học thành công",
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson) return res.status(404).json({ message: "Không tìm thấy bài học để xóa" });
    res.status(200).json({ message: "Xóa bài học thành công" });
  } catch (error) {
    next(error);
  }
};
