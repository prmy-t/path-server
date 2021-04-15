const { $fetch } = require("ohmyfetch/node");
const Mcq = require("../models/mcq");
const CategoryMeta = require("../models/categoryMeta");
const SubCategoryMeta = require("../models/subCategoryMeta");
const ChildCategoryMeta = require("../models/childCategoryMeta");
const SideBar = require("../models/sideBar");

exports.getMcqsCount = (req, res, next) => {
  Mcq.find()
    .then((mcqs) => {
      const mcqLen = mcqs.length;
      res.send({ mcqLen });
    })
    .catch();
};
exports.getCategoryMcqsCount = (req, res, next) => {
  const category = req.body.category;
  Mcq.find({ category })
    .then((mcqs) => {
      const mcqLen = mcqs.length;
      res.send({ category, mcqLen });
    })
    .catch();
};
exports.getSubCategoryMcqsCount = (req, res, next) => {
  const subCategory = req.body.subCategory;
  Mcq.find({ subCategory })
    .then((mcqs) => {
      const mcqLen = mcqs.length;
      res.send({ mcqLen });
    })
    .catch();
};

exports.getMcqCatagories = (req, res, next) => {
  let subObj = {};
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

    .catch((err) => console.log(err));
};

exports.getSubCategoriesCount = (req, res, next) => {
  Mcq.find()
    .then((mcqs) => {
      let subObj = {};
      let arr = [];
      for (let i in mcqs) {
        if (mcqs[i].category in subObj) {
          if (mcqs[i].subCategory && !arr.includes(mcqs[i].subCategory)) {
            arr.push(mcqs[i].subCategory);
            subObj[mcqs[i].category]++;
          }
        } else if (!(mcqs[i].category in subObj)) {
          arr.push(mcqs[i].subCategory);
          subObj[mcqs[i].category] = 1;
        }
      }
      res.send({ subObj });
    })
    .catch((err) => console.log(err));
};
exports.getComponents = (req, res, next) => {
  SideBar.find()
    .then((components) => {
      res.send({ components });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMcqs = (req, res, next) => {
  const page = parseInt(req.body.page);
  // console.log("skip value:", page * 5 - 5);
  Mcq.find()
    .sort("-_id")
    .skip(page * 5 - 5)
    .limit(5)
    .then((mcqs) => {
      // console.log(mcqs[4]);
      res.send({ mcqs });
    })
    .catch((err) => console.log(err));
};
exports.getCategoryMcqs = (req, res, next) => {
  const category = req.body.category;
  const page = req.body.page;
  Mcq.find({ category })
    .sort("-_id")
    .skip(page * 5 - 5)
    .limit(5)
    .then((mcqs) => {
      res.send({ mcqs });
    })
    .catch((err) => console.log(err));
};

exports.getSubCategoryMcqs = (req, res, next) => {
  const subCategory = req.body.subCategory;
  const page = req.body.page;
  Mcq.find({ subCategory })
    .sort("-_id")
    .skip(page * 5 - 5)
    .limit(5)
    .then((mcqs) => {
      res.send({ mcqs });
    })
    .catch((err) => console.log(err));
};
exports.getChildCategoryMcqs = (req, res, next) => {
  const childCategory = req.body.childCategory;
  const page = req.body.page;
  let mcqLen = 0;

  Mcq.find({ childCategory }).then((mcq) => {
    mcqLen = mcq.length;
    return mcqLen;
  });
  Mcq.find({ childCategory })
    .sort("-_id")
    .skip(page * 5 - 5)
    .limit(5)
    .then((mcqs) => {
      res.send({ mcqs, mcqLen });
    })
    .catch((err) => console.log(err));
};
exports.postMcqSubCatagories = (req, res, next) => {
  const category = req.body.category;
  Mcq.aggregate([
    { $match: { category } },
    {
      $group: {
        _id: "$subCategory",
        count: { $sum: 1 },
      },
    },
  ])
    .then((subCat) => {
      let subObj = {};
      for (let i in subCat) {
        if (
          subCat[i]._id in subObj &&
          subCat[i]._id !== null &&
          subCat[i]._id !== ""
        ) {
          subObj[subCat[i]._id] += subCat[i].count;
        } else if (
          !(subCat[i]._id in subObj) &&
          subCat[i]._id !== null &&
          subCat[i]._id !== ""
        ) {
          subObj[subCat[i]._id] = subCat[i].count;
        }
      }
      res.send({ subObj });
    })
    .catch((err) => console.log(err));
};

exports.postMcqChildCatagories = (req, res, next) => {
  const subCategory = req.body.subCategory;
  Mcq.aggregate([
    { $match: { subCategory } },
    {
      $group: {
        _id: "$childCategory",
        count: { $sum: 1 },
      },
    },
  ])
    .then((childCat) => {
      let childObj = {};
      for (let i in childCat) {
        if (childCat[i]._id in childObj && childCat[i]._id !== null) {
          childObj[childCat[i]._id] += childCat[i].count;
        } else if (!(childCat[i]._id in childObj) && childCat[i]._id !== null) {
          childObj[childCat[i]._id] = childCat[i].count;
        }
      }
      res.send({ childObj });
    })
    .catch((err) => console.log(err));
};

exports.postMcqSingleChild = (req, res, next) => {
  const childCategory = req.body.childCategory;

  Mcq.find({ childCategory }).exec(function (err, mcqs) {
    if (err) console.log(err);
    res.send({ mcqs });
  });
};

exports.postMcqComment = async (req, res, next) => {
  const id = req.body.id;
  const token = req.body.token;
  const email = req.body.email;
  const newComment = req.body.newComment;
  const date = currentDate();

  const response = await $fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
  );
  if (response.success) {
    Mcq.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: { user: email, newComment: newComment, date: date },
        },
      },
      { new: true }
    )
      .then((mcq) => {
        res.send({ mcq });
      })
      .catch((err) => console.log(err));
  } else res.send("not verified");
};

exports.checkToken = async (req, res, next) => {
  const token = req.body.token;
  const email = req.body.email;
  const issue = req.body.issue;
  const id = req.body.id;
  const report = { [email]: issue };

  const response = await $fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
  );
  if (response.success) {
    Mcq.findByIdAndUpdate(id, {
      $push: {
        reports: report,
      },
    })
      .then(() => res.send("success"))
      .catch((err) => console.log(err));
  } else res.send("not verified");
};

exports.getCategoryMeta = (req, res, next) => {
  const category = req.body.category;
  CategoryMeta.findOne({ category })
    .then((cat) => {
      let meta = "";
      if (cat !== null) {
        meta = cat.meta;
      }
      res.send({ meta });
    })
    .catch((err) => console.log(err));
};
exports.getSubCategoryMeta = (req, res, next) => {
  const subCategory = req.body.subCategory;
  SubCategoryMeta.findOne({ subCategory })
    .then((cat) => {
      let meta = "";
      if (cat !== null) {
        meta = cat.meta;
      }
      res.send({ meta });
    })
    .catch((err) => console.log(err));
};
exports.getChildCategoryMeta = (req, res, next) => {
  const childCategory = req.body.childCategory;
  ChildCategoryMeta.findOne({ childCategory })
    .then((cat) => {
      let meta = "";
      if (cat !== null) {
        meta = cat.meta;
      }
      res.send({ meta });
    })
    .catch((err) => console.log(err));
};

exports.getQuestion = (req, res, next) => {
  const question = req.body.question.split("-").join(" ") + "?";
  Mcq.findOne({ question })
    .then((mcq) => res.send({ mcq }))
    .catch((err) => console.log(err));
};
//functions

function currentDate() {
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let currentDate =
    hours + ":" + minutes + " (" + date + "/" + month + "/" + year + ")";
  return currentDate;
}
