const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");

//GET
router.get("/admin/get-mcq-table", controller.verify, controller.getMcqTable);
router.get(
  "/admin/get-reported-mcqs",
  controller.verify,

  controller.getReportedMcqs
);
router.get(
  "/admin/get-commented-mcqs",
  controller.verify,

  controller.getCommentedMcqs
);
router.get(
  "/admin/get-mcq-table/by-tags",
  controller.verify,

  controller.getTagsList
);
router.get(
  "/admin/get-mcq-table/by-categories",
  controller.verify,
  controller.getCategoriesList
);
router.get(
  "/admin/get-mcq-table/by-subcategories",
  controller.verify,
  controller.getSubCategoriesList
);
router.get(
  "/admin/get-mcq-table/by-childcategories",
  controller.verify,
  controller.getChildCategoriesList
);
router.get(
  "/admin/get-sidebar-components",
  controller.verify,

  controller.getComponents
);
router.get(
  "/admin/get-reported-categories",
  controller.verify,

  controller.getReportedCategoriesList
);
router.get(
  "/admin/get-commented-categories",
  controller.verify,

  controller.getCommentedCategoriesList
);

router.post(
  "/admin/edit-site/meta-config/getcategorymeta",
  controller.verify,
  controller.getCategoryMeta
);
router.post(
  "/admin/edit-site/meta-config/getsubcategorymeta",
  controller.verify,
  controller.getSubCategoryMeta
);
router.post(
  "/admin/edit-site/meta-config/getchildcategorymeta",
  controller.verify,
  controller.getChildCategoryMeta
);

//POST
router.post(
  "/admin/post-sidebar-components",
  controller.verify,
  controller.postComponents
);
router.post(
  "/admin/get-mcq-table/by-tags/:tag",
  controller.verify,
  controller.getMcqTableByTag
);
router.post(
  "/admin/get-mcq-table/by-categories/:category",
  controller.verify,
  controller.getMcqTableByCategory
);
router.post("/admin/login", controller.postLogin);
router.post("/admin/file-upload", controller.verify, controller.postFileUpload);
router.post(
  "/admin/edit-site/add-mcq",
  controller.verify,
  controller.postAddMcq
);
router.post(
  "/admin/edit-site/edit-mcq",
  controller.verify,
  controller.postEditMcq
);
router.post(
  "/admin/edit-site/delete-mcq",
  controller.verify,
  controller.postDeleteMcq
);
router.post(
  "/admin/edit-site/delete-selected-mcqs",
  controller.verify,
  controller.postDeleteSelectedMcqs
);
router.post(
  "/admin/edit-site/delete-report",
  controller.verify,
  controller.postDeleteReport
);
router.post(
  "/admin/edit-site/delete-comment",
  controller.verify,
  controller.postDeleteComment
);
router.post(
  "/admin/edit-site/replay-comment",
  controller.verify,
  controller.postReplayComment
);
router.post(
  "/admin/edit-site/meta-config/oncategory",
  controller.verify,
  controller.postMetaOnCategory
);
router.post(
  "/admin/edit-site/meta-config/onsubcategory",
  controller.verify,
  controller.postMetaOnSubCategory
);
router.post(
  "/admin/edit-site/meta-config/onchildcategory",
  controller.verify,
  controller.postMetaOnChildCategory
);

module.exports = router;
