const mongoose = require("mongoose");

const childCategoryMetaSchema = mongoose.Schema({
  childCategory: String,
  meta: String,
});

module.exports = mongoose.model("ChildCategoryMeta", childCategoryMetaSchema);
