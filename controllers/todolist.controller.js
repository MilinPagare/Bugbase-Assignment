const listModel = require("../models/todolist.model");

const postAdd = async (request, response) => {
  try {
    const { title, description, status } = request.body;
    const newDoc = new listModel({ title, description, status });
    const result = await newDoc.save();
    const docs = await listModel.find({});
    response.status(200).json(docs);
  } catch (err) {
    if (err.code) {
      response.status(409).json({
        message: "Failed to create new list",
        reason: "Something went wrong",
      });
    } else {
      response
        .status(500)
        .json({ message: "Failed to create new list", reason: err.message });
    }
  }
};

const putUpdate = async (request, response) => {
  try {
    const { title, description, status, _id } = request.body;
    let doc = await listModel.findOneAndUpdate(
      { _id: _id },
      { title: title, description: description, status: status },
      {
        new: true,
      }
    );
    const docs = await listModel.find({});
    response.status(200).json(docs);
  } catch (err) {
    if (err.code) {
      response.status(409).json({
        message: "Failed to update list",
        reason: "Something went wrong",
      });
    } else {
      response
        .status(500)
        .json({ message: "Failed to update list", reason: err.message });
    }
  }
};

const putDelete = async (request, response) => {
  try {
    const { _id } = request.body;
    let doc = await listModel.deleteOne({ _id: _id });
    // response.status(200).json({});
    const docs = await listModel.find({});
    response.status(200).json(docs);
  } catch (err) {
    if (err.code) {
      response.status(405).json({
        message: "Failed to delete item",
        reason: "Something went wrong",
      });
    } else {
      response
        .status(500)
        .json({ message: "Failed to delete item", reason: err.message });
    }
  }
};

const getAll = async (request, response) => {
  try {
    const docs = await listModel.find({});
    if (docs.length > 0) {
      response.status(200).json(docs);
    } else {
      response.status(404).json({ message: "No items found" });
    }
  } catch (err) {
    response.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { postAdd, putUpdate, putDelete, getAll };
