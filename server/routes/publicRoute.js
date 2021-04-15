const express = require("express");
const router = express.Router();
const controller = require("../controllers/publicController");

router.get("/get-mcqs-count", controller.getMcqsCount);
router.post("/get-category-mcqs-count", controller.getCategoryMcqsCount);
router.post("/get-subcategory-mcqs-count", controller.getSubCategoryMcqsCount);

router.get("/get-mcq-catagories", controller.getMcqCatagories);
router.get("/get-components", controller.getComponents);
router.get(
  "/get-subcategory-count",

  controller.getSubCategoriesCount
);

router.post("/get-mcqs", controller.getMcqs);

router.post("/get-category-mcqs", controller.getCategoryMcqs);
router.post("/get-subcategory-mcqs", controller.getSubCategoryMcqs);
router.post("/get-childcategory-mcqs", controller.getChildCategoryMcqs);

router.post("/post-mcq-sub-catagories", controller.postMcqSubCatagories);
router.post("/post-mcq-child-catagories", controller.postMcqChildCatagories);
router.post("/post-mcq-single-child", controller.postMcqSingleChild);
router.post("/post-mcq-comment", controller.postMcqComment);
router.post("/report/check-token", controller.checkToken);

router.post("/getcategorymeta", controller.getCategoryMeta);
router.post("/getsubcategorymeta", controller.getSubCategoryMeta);
router.post("/getchildcategorymeta", controller.getChildCategoryMeta);
router.post("/get-question", controller.getQuestion);

module.exports = router;
