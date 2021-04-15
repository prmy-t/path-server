const jwt = require("jsonwebtoken");
const fs = require("fs");
const xlsx = require("xlsx");
const Mcq = require("../models/mcq");
const CategoryMeta = require("../models/categoryMeta");
const SubCategoryMeta = require("../models/subCategoryMeta");
const ChildCategoryMeta = require("../models/childCategoryMeta");
const SideBar = require("../models/sideBar");

exports.getComponents = (req, res, next) => {
  SideBar.find()
    .then((components) => {
      res.send({ components });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getMcqTable = (req, res, next) => {
  Mcq.find()
    .then((mcq) => {
      res.send(mcq);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getReportedCategoriesList = (req, res, next) => {
  let reportedCategoryObj = {};
  Mcq.find()
    .then((mcq) => {
      for (let i in mcq) {
        if (mcq[i].reports.length > 0) {
          if (reportedCategoryObj.hasOwnProperty(mcq[i].category)) {
            reportedCategoryObj[mcq[i].category]++;
          } else {
            reportedCategoryObj[mcq[i].category] = 1;
          }
        }
      }

      res.send({ reportedCategoryObj });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCommentedCategoriesList = (req, res, next) => {
  let commentedCategoryObj = {};
  Mcq.find()
    .then((mcq) => {
      for (let i in mcq) {
        if (mcq[i].comments.length > 0) {
          if (commentedCategoryObj.hasOwnProperty(mcq[i].category)) {
            commentedCategoryObj[mcq[i].category]++;
          } else {
            commentedCategoryObj[mcq[i].category] = 1;
          }
        }
      }

      res.send({ commentedCategoryObj });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReportedMcqs = (req, res, next) => {
  Mcq.find({ reports: { $type: "object" } })
    .then((mcqs) => {
      res.send(mcqs);
    })
    .catch((err) => res.status(201).send(err));
};
exports.getCommentedMcqs = (req, res, next) => {
  Mcq.find({ comments: { $type: "object" } })
    .then((mcqs) => {
      res.send(mcqs);
    })
    .catch((err) => console.log(err));
};
exports.getTagsList = (req, res, next) => {
  Mcq.aggregate([
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
  ])
    .then((tagObj) => {
      res.send({ tagObj });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCategoriesList = (req, res, next) => {
  let categoriesObj = {};
  Mcq.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ])
    .then((categories) => {
      res.send({ categories });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getSubCategoriesList = (req, res, next) => {
  let categoriesObj = {};
  Mcq.aggregate([
    {
      $group: {
        _id: "$subCategory",
        count: { $sum: 1 },
      },
    },
  ])
    .then((subCategories) => {
      res.send({ subCategories });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getChildCategoriesList = (req, res, next) => {
  Mcq.aggregate([
    {
      $group: {
        _id: "$childCategory",
        count: { $sum: 1 },
      },
    },
  ])
    .then((childCategories) => {
      res.send({ childCategories });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategoryMeta = (req, res, next) => {
  const category = req.body.category;
  CategoryMeta.findOne({ category })
    .then((cat) => {
      res.send({ cat });
    })
    .catch((err) => console.log(err));
};
exports.getSubCategoryMeta = (req, res, next) => {
  const subCategory = req.body.subCategory;
  SubCategoryMeta.findOne({ subCategory })
    .then((cat) => {
      res.send({ cat });
    })
    .catch((err) => console.log(err));
};
exports.getChildCategoryMeta = (req, res, next) => {
  const childCategory = req.body.childCategory;
  ChildCategoryMeta.findOne({ childCategory })
    .then((cat) => {
      res.send({ cat });
    })
    .catch((err) => console.log(err));
};

exports.postComponents = async (req, res, next) => {
  const components = req.body.components;

  await SideBar.deleteMany();
  if (components.length > 0) {
    for (let i in components) {
      const sidebar = new SideBar({
        date: datePicker(),
        title: components[i].title,
        points: components[i].points,
      });
      await sidebar.save();
    }
  }
  res.send({ success: true });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;

  const password = req.body.password;
  if (email === "admin@path.pk" && password === "Program@28") {
    const token = jwt.sign(email, process.env.AUTH_KEY);
    res.send({ token });
  } else res.send({ flag: true });
};

exports.postFileUpload = (req, res, next) => {
  if (req.files !== null) {
    const file = req.files.sheet;
    const tempPath = file.tempFilePath;

    // const actualPath = "/";
    // fs.renameSync(tempPath, actualPath + file.name);

    // xlsx to JSON converting
    var wb = xlsx.readFile(tempPath);
    var ws = wb.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(ws);
    for (let i in data) {
      let tags = [];

      if (data[i].Category) {
        let slice = data[i].Category.split(" ");
        for (let j in slice) {
          slice[j] = slice[j].charAt(0).toUpperCase() + slice[j].slice(1);
        }
        slice = slice.join(" ");
        data[i].Category = slice;
      }
      if (data[i].subCategory) {
        let slice = data[i].subCategory.split(" ");
        for (let j in slice) {
          slice[j] = slice[j].charAt(0).toUpperCase() + slice[j].slice(1);
        }
        slice = slice.join(" ");
        data[i].subCategory = slice;
      }
      if (data[i].childCategory) {
        let slice = data[i].childCategory.split(" ");
        for (let j in slice) {
          slice[j] = slice[j].charAt(0).toUpperCase() + slice[j].slice(1);
        }
        slice = slice.join(" ");
        data[i].childCategory = slice;
      }
      if (data[i].Tags) {
        tags = data[i].Tags.split(", ");
        for (var j = 0; j < tags.length; j++) {
          tags[j] = tags[j].charAt(0).toUpperCase() + tags[j].slice(1);
        }
      } else tags = null;

      const mcq = new Mcq({
        date: datePicker(),
        question: data[i].question,
        optionA: data[i].option1,
        optionB: data[i].option2,
        optionC: data[i].option3,
        optionD: data[i].option4,
        answer: data[i].answer,
        category: data[i].Category,
        subCategory: data[i].subCategory,
        childCategory: data[i].childCategory,
        tags: tags,
        comments: [],
        reports: [],
      });
      mcq.save().then().catch();
    }
    // fs.unlinkSync(actualPath + file.name);
    res.send({ saved: true });
  } else {
    (err) => {
      console.log(err);
      res.send({ empty: true });
    };
  }
};

exports.postAddMcq = (req, res, next) => {
  const question = req.body.mcq.question;
  let category = "";
  let subCategory = "";
  let childCategory = "";
  if (req.body.mcq.category) {
    let slice = req.body.mcq.category.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    category = slice;
  }
  if (req.body.mcq.subCategory) {
    let slice = req.body.mcq.subCategory.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    subCategory = slice;
  }
  if (req.body.mcq.childCategory) {
    let slice = req.body.mcq.childCategory.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    childCategory = slice;
  }
  const tags = req.body.mcq.tagsArray;
  const optionA = req.body.mcq.optionA;
  const optionB = req.body.mcq.optionB;
  const optionC = req.body.mcq.optionC;
  const optionD = req.body.mcq.optionD;
  const answer = req.body.mcq.answer;

  const mcq = new Mcq({
    date: datePicker(),
    question: question,
    optionA: optionA,
    optionB: optionB,
    optionC: optionC,
    optionD: optionD,
    answer: answer,
    category: category,
    subCategory: subCategory,
    childCategory: childCategory,
    tags: tags,
    comments: [],
    reports: [],
  });
  mcq
    .save()
    .then(() => {
      res.send("saved");
    })
    .catch((err) => console.log(err));
};
exports.postEditMcq = (req, res, next) => {
  const id = req.body.mcq._id;
  const question = req.body.mcq.question;
  let category = "";
  let subCategory = "";
  let childCategory = "";
  if (req.body.mcq.category) {
    let slice = req.body.mcq.category.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    category = slice;
  }
  if (req.body.mcq.subCategory) {
    let slice = req.body.mcq.subCategory.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    subCategory = slice;
  }
  if (req.body.mcq.childCategory) {
    let slice = req.body.mcq.childCategory.split(" ");
    for (let i in slice) {
      slice[i] = slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
    }
    slice = slice.join(" ");
    childCategory = slice;
  }
  const tags = req.body.mcq.tagsArray;
  const optionA = req.body.mcq.optionA;
  const optionB = req.body.mcq.optionB;
  const optionC = req.body.mcq.optionC;
  const optionD = req.body.mcq.optionD;
  const answer = req.body.mcq.answer;
  Mcq.findByIdAndUpdate(
    { _id: id },
    {
      question: question,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      answer: answer,
      category: category,
      subCategory: subCategory,
      childCategory: childCategory,
      tags: tags,
    }
  )
    .then(() => {
      res.send("saved");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteMcq = (req, res, next) => {
  const itemId = req.body.itemId;
  Mcq.findByIdAndRemove(itemId)
    .then(() => {
      res.send("success");
    })
    .catch((err) => console.log(err));
};
exports.postDeleteSelectedMcqs = (req, res, next) => {
  const selectedMcqs = req.body.selectedMcqs;
  for (let i in selectedMcqs) {
    let mcqId = selectedMcqs[i]._id;
    Mcq.findByIdAndRemove(mcqId)
      .then()
      .catch((err) => console.log(err));
  }
  res.send("success");
};

exports.getMcqTableByTag = (req, res, next) => {
  const tag = req.params.tag;
  Mcq.find({ tags: tag })
    .then((mcqs) => {
      res.send({ mcqs });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getMcqTableByCategory = (req, res, next) => {
  const category = req.params.category;
  Mcq.find({ category })
    .then((mcqs) => {
      res.send({ mcqs });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteReport = (req, res, next) => {
  const id = req.body.id;
  const report = JSON.parse(req.body.report);

  Mcq.findByIdAndUpdate(id, { $pull: { reports: report } })
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => console.log(err));
};
exports.postDeleteComment = (req, res, next) => {
  const id = req.body.id;
  const comment = JSON.parse(req.body.comment);

  Mcq.findByIdAndUpdate(id, { $pull: { comments: comment } })
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => console.log(err));
};

exports.postReplayComment = (req, res, next) => {
  const oldComment = req.body.oldComment;
  const replay = req.body.replay;
  const newComment = Object.assign({}, oldComment);
  newComment.replay = replay;

  Mcq.findOneAndUpdate(
    { comments: oldComment },
    {
      $set: {
        "comments.$": newComment,
      },
    },
    { new: true }
  )
    .then((mcq) => res.send({ success: true }))
    .catch((err) => console.log(err));
};

exports.postMetaOnCategory = (req, res, next) => {
  const category = req.body.category;
  const meta = req.body.meta;
  const flag = req.body.flag;
  if (flag) {
    CategoryMeta.findOneAndUpdate({ category }, { meta: meta })
      .then(() => {
        res.send("done");
      })
      .catch((err) => console.log(err));
  } else {
    const metaCat = new CategoryMeta({
      category: category,
      meta: meta,
    });
    metaCat
      .save()
      .then(() => res.send("saved"))
      .catch((err) => console.log(err));
  }
};
exports.postMetaOnSubCategory = (req, res, next) => {
  const subCategory = req.body.subCategory;
  const meta = req.body.meta;
  const flag = req.body.flag;
  if (flag) {
    SubCategoryMeta.findOneAndUpdate({ subCategory }, { meta: meta })
      .then(() => {
        res.send("done");
      })
      .catch((err) => console.log(err));
  } else {
    const metaSubCat = new SubCategoryMeta({
      subCategory: subCategory,
      meta: meta,
    });
    metaSubCat
      .save()
      .then(() => res.send("saved"))
      .catch((err) => console.log(err));
  }
};
exports.postMetaOnChildCategory = (req, res, next) => {
  const childCategory = req.body.childCategory;
  const meta = req.body.meta;
  const flag = req.body.flag;
  if (flag) {
    ChildCategoryMeta.findOneAndUpdate({ childCategory }, { meta: meta })
      .then(() => {
        res.send("done");
      })
      .catch((err) => console.log(err));
  } else {
    const metaSubCat = new ChildCategoryMeta({
      childCategory: childCategory,
      meta: meta,
    });
    metaSubCat
      .save()
      .then(() => res.send("saved"))
      .catch((err) => console.log(err));
  }
};

// middleware
exports.verify = async (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    let verified = "";
    if (token !== "undefined") {
      verified = jwt.verify(token, process.env.AUTH_KEY);

      if (verified && verified === "admin@path.pk") {
        req.token = token;
        return next();
      } else {
        res.sendStatus(403);
      }
    } else {
      res.status(201).send("not verified");
    }
  } else {
    res.sendStatus(403);
  }
};

// functions

function datePicker() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  return today;
}
