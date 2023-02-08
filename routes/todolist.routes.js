const router = require("express").Router();
const {
  postAdd,
  putUpdate,
  putDelete,
  getAll,
} = require("../controllers/todolist.controller");
const validateList = require("../middleware/listvalidator");

// add
router.post("/add", validateList, postAdd);
// update
router.put("/update", putUpdate);
// delete
router.delete("/delete", putDelete);
//getList
router.get("/all", getAll);

module.exports = router;
