const mongoose = require("mongoose");

const categoryMetaSchema = mongoose.Schema({
  category: String,
  meta: String,
});

module.exports = mongoose.model("CategoryMeta", categoryMetaSchema);
