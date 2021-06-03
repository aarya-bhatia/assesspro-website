const { Module } = require("../model");

exports.createModule = async (module, callback, error) => {
  try {
    const found = await Module.create(module);
    callback(found);
  } catch (err) {
    error(err);
  }
};

exports.getModules = async ({ modules }, callback, error) => {
  try {
    const found = await Module.find({ _id: { $in: modules } });
    callback(found);
  } catch (err) {
    error(err);
  }
};

exports.updateModule = async ({ id, data }, callback, error) => {
  try {
    const doc = await Module.findOneAndUpdate({ _id: id }, data);
    callback(doc);
  } catch (err) {
    error(err);
  }
};
