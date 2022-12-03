const router = require("express").Router();
const res = require("express/lib/response");
const { Product, Category, Tag, ProductTag } = require("../../models");

/*  
    Adapted from...  
    Title: ecommerce-backend
    Author: kaiafay
  Availability: https://github.com/kaiafay/ecommerce-backend*/

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  Product.findAll({
    // be sure to include its associated Category and Tag data
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((products) => res.json(products))
    .catch((err) => {
      return res.status(500).json(err);
    });
});

//* Broken Crayons Still Color*//

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((product) => {
      if (!product) {
        res.status(400).json({ message: "No product found " });
        return;
      }
      res.json(product);
    })
    .catch((err) => res.status(500).json(err));
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]

    
  
  */

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({
          where: { product_id: req.params.id },
        });
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy("/:id", (req, res) => {
    where: {
      id: req.params.id;
    }
  })
    .then((product) => {
      if (!product) {
        res.status(400).json({ message: "No product found " });
      }
      res.json(product);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;

// *Learn Not To Care. You'll Be Happier*//
