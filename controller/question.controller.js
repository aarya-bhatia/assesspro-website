import { Question } from "../model";

exports.createQuestion = async (question, callback, error) => {
  try {
    const doc = await Question.create(question);
    callback(doc);
  } catch (err) {
    error(err);
  }
};

exports.getQuestions = async ({ module_id }, callback, error) => {
  try {
    const found = await Question.find({ module_id });
    callback(found);
  } catch (err) {
    error(err);
  }
};

exports.removeQuestion = async ({ id }, callback, error) => {
  try {
    const doc = await Question.findOneAndDelete({ _id: id });
    callback(doc());
  } catch (err) {
    error(err);
  }
};

exports.updateQuestion = async ({ id, data }, callback, error) => {
  try {
    const doc = await Question.findOneAndUpdate({ _id: id }, data);
    callback(doc);
  } catch (err) {
    error(err);
  }
};
