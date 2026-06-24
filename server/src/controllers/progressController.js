const Progress = require("../models/Progress");

exports.getProgress = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Progress.countDocuments({ userId: req.user._id });
    const records = await Progress.find({ userId: req.user._id })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const record = await Progress.findOne({ userId: req.user._id }).sort({
      date: -1,
    });
    const previous = await Progress.findOne({ userId: req.user._id })
      .sort({ date: -1 })
      .skip(1);

    res.json({ latest: record, previous });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProgress = async (req, res) => {
  try {
    const record = await Progress.create({
      ...req.validatedBody,
      userId: req.user._id,
    });
    res.status(201).json({ record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const record = await Progress.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.validatedBody,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const record = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
