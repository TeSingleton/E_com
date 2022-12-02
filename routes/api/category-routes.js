const router = require("express").Router();
const { Category, Product } = require("../../models");
// todo add routes
// The `/api/categories` endpoint

router.get("/", (req, res) => {
  Category.findAll({
    // include its associated Products

    include: [Product],
  })
    .then((categories) => res.json(categories))
    .catch((err) => res.status(500).json(err));
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  Catergory.findOne({ where: { id: req.params.id }, include: [Product] })  .then(category => {
    // if category doesn't exist, return 404 error
    if(!category) {
      res.status(404).json({ message: 'Nothing found with that ID.' });
      return;
    }
    res.json(category);
  })
  .catch(err => res.status(500).json(err));
});

router.post("/", (req, res) => {
  // create a new category
  Category.create(req.body)
  .then(addNewCategory=> res.json(addNewCategory)).catch(err=> res.status(400).json(err));
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
