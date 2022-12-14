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

//* "Dont Quit. You're Already in pain. You're already hurt. Get rewarded from it"*//

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  Category.findOne({ where: { id: req.params.id }, include: [Product] })
    .then((category) => {
      // if category doesn't exist, return 404 error
      if (!category) {
        res.status(404).json({ message: "Nothing found with that ID." });
        return;
      }
      res.json(category);
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/", async (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((addNewCategory) => res.json(addNewCategory))
    .catch((err) => res.status(400).json(err));
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((newCategory) => {
      if (!newCategory) {
        res.status(400).json({ message: "Nothing found with that ID" });
      }
      res.json(newCategory);
    })
    .catch((err) => res.status(500).json(err));
});

router.delete("/:id", (req, res) => {
  Category.destroy({ where: { id: req.params.id } })
    .then((category) => {
      if (!category) {
        res.status(400).json({ message: "Nothing found with that ID" });
      }
      res.json(category);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
