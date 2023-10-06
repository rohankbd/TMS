const { validateTask, Task } = require("../models/Task");
const auth = require("../middlewares/auth");

const mongoose = require("mongoose");
const router = require("express").Router();

// create Task.
router.post("/task", auth, async (req, res) => {
  const { error } = validateTask(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      postedBy: req.user._id,
    });
    const result = await newTask.save();

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

// fetch Task.
router.get("/myTasks", auth, async (req, res) => {
  try {
    const myTasks = await Task.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res.status(200).json({ myTasks: myTasks.reverse() }); // Updated response property name to "myTasks"
  } catch (err) {
    console.log(err);
  }
});

// update Task.
router.put("/task", auth, async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const existingTask = await Task.findOne({ _id: id }); // Renamed to existingTask

    if (!existingTask) return res.status(400).json({ error: "no Task found" });

    if (req.user._id.toString() !== existingTask.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't edit other people's Tasks!" });

    const updatedData = { ...req.body, id: undefined };
    const result = await existingTask.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

// delete a Task.
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const existingTask = await Task.findOne({ _id: id }); // Renamed to existingTask

    if (!existingTask) return res.status(400).json({ error: "no Task found" });

    if (req.user._id.toString() !== existingTask.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people's Tasks!" });

    const result = await existingTask.deleteOne({ _id: id });
    const myTasks = await Task.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...existingTask._doc, myTasks: myTasks.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// to get a single Task.
router.get("/task/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const existingTask = await Task.findOne({ _id: id }); // Renamed to existingTask

    if (!existingTask) return res.status(400).json({ error: "no Task found" });

    return res.status(200).json({ ...existingTask._doc });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;