const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// const path = require("path");
require("dotenv").config();

// const port = 3000 || process.env.PORT;

mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "server/temp/",
  })
);

const publicRoutes = require("./routes/publicRoute");
const adminRoutes = require("./routes/adminRoute");

app.use(publicRoutes);
app.use(adminRoutes);

// app.use(express.static("dist"));
// app.get("*", (request, response) => {
//   response.sendFile(path.join(__dirname, "dist", "index.html"));
// });

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 2000);
    console.log("listening..");
  })
  .catch((err) => {
    console.log(err);
  });
