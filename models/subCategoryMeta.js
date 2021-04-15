const mongoose = require("mongoose");

const subCategoryMetaSchema = mongoose.Schema({
  subCategory: String,
  meta: String,
});

module.exports = mongoose.model("SubCategoryMeta", subCategoryMetaSchema);
