const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

/*  
    Adapted from...  
    Title: ecommerce-backend
    Author: kaiafay
  Availability: https://github.com/kaiafay/ecommerce-backend*/

router.get("/", (req, res) => {
  // find all tags
  Tag.findAll({
    include: [{ model: Product, through: ProductTag }],
  })
    .then((tags) => res.json(tags))
    .catch((err) => res.status(500).json(err));
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: { id: req.params.id },
    include: [{ model: Product, through: ProductTag }],
  }).then((tag) => {
    if (!tag) {
      res.status(400).json({ message: "No tag found with ID" });
      return;
    }
  });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((newTag) => res.json(newTag))
    .catch((err) => res.status(400).json(err));
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: { id: req.params.id },
  }).then((updatedTag) => {
    if (!updatedTag) {
      res.status(400).json({ message: "No tag found with ID" });
      return;
    }
  });
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (!tag) {
        res.status(404).json({ message: " No tag found with ID " });
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
