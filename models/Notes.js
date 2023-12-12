const mongoose = require("mongoose");
const { isEmail } = require("validator");
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  jobTitle: {
    type: String,
    required: [true, "Please enter a job title"],
  },
  company: {
    type: String,
    required: [true, "Please enter a company name"],
  },
  website: {
    type: String,
    required: [true, "Please enter a website"],
  },
  employerName: {
    type: String,
    required: [true, "Please enter an employer name"],
  },
  employerEmail: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  employerPhone: {
    type: String,
    required: [true, "Please enter an employer phone"],
  },
  employerAddress: {
    type: String,
    required: [true, "Please enter an employer address"],
  },
  origin: {
    type: String,
    required: [true, "Please enter an origin"],
    enum: ["Spontaneous application", "Job offer"],
  },
  status: {
    type: String,
    required: [true, "Please enter a status"],
    enum: ["Interested", "CV sent", "Negative", "Interview"],
  },
  comments: {
    type: String,
    required: [true, "Please enter a comment"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

NoteSchema.post("save", function (doc, next) {
  console.log("new note was created and saved", doc);
  next();
});

module.exports = mongoose.model("Note", NoteSchema);
