const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    user_id: ObjectId,
    assessment_id: ObjectId,
    module_id: ObjectId,
    module_name: String,
    module_key: Number,
    module_description: String,
    module_type: String,
    no_questions: Number,
    no_attempted: Number,
    time_spent: Number,
    time_limit: Number,
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
})

module.exports = model('UserModule', schema)