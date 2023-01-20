const express = require("express");
const router = express.Router();

const Product = require("../models/Product"); // import the product model

//check if the product exist and return an error message if it does not exist or there is an error.
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id); // find the product by its id
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

//All Routes
//Getting all

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // get all products from the database
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message }); // return an error message
  }
});

//Getting one
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // find the product by its id
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message }); // return an error message
  }
});

//Creating one
router.post("/products", async (req, res) => {
  const newProduct = new Product(req.body); // create a new product instance
  try {
    await newProduct.save(); // save the product to the database
    res.status(201).json(newProduct); // return the new product
  } catch (err) {
    res.status(400).json({ message: err.message }); // return an error message
  }
});

//Updating one
router.patch("/products/:id", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  try {
    const updatedProduct = await res.product.save(); // save the updated product
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message }); // return an error message
  }
});

//Deliting one
router.delete("/products/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove(); // delete the product from the database
    res.json({ message: "Deleted Product" });
  } catch (err) {
    res.status(500).json({ message: err.message }); // return an error message
  }
});

module.exports = router;
