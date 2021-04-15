const mongoose = require("mongoose");

const sidebarSchema = mongoose.Schema({
  date: "",
  title: String,
  points: [String],
});

module.exports = mongoose.model("SideBar", sidebarSchema);
