const { User } = require("../model");

exports.createUser = async (user, callback, error) => {
  try {
    const doc = await User.create(user);
    callback(doc);
  } catch (err) {
    error(err);
  }
};

exports.updateUser = async ({ id, data }, callback, error) => {
  try {
    const doc = await User.findOneAndUpdate({ _id: id }, data);
    callback(doc);
  } catch (err) {
    error(err);
  }
};

exports.getUser = async ({ id }, callback, error) => {
  try {
    const found = await User.findById(id);
    if (!found) {
      throw Error({ status: 400, message: "User not found" });
    }
    callback(found);
  } catch (err) {
    error(err);
  }
};

exports.removeUser = async ({ id }, callback, error) => {
  try {
    const doc = await User.findOneAndDelete({ _id: id });
    callback(doc);
  } catch (err) {
    error(err);
  }
};
