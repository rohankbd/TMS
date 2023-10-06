const mongoose = require("mongoose");
const Joi = require("joi");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required."],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = new mongoose.model("Task", TaskSchema);

const validateTask = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    description: Joi.string().min(4).max(100).required()
  });

  return schema.validate(data);
};

module.exports = {
  validateTask,
  Task,
};
