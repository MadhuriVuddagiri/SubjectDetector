const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subject: { type: String, required: true },
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);