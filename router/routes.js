const express = require("express");
const { 
  addproduct, 
  getProducts, 
  deleteproducts, 
  updateproducts, 
  getproductbycategory, 
  findByid ,
  totalproduct
} = require("../control/prdctCtrl");
const uploads = require("../multerfiles/uploads");

const router = express.Router();

// Route for adding a product
router.post("/addproduct", uploads.single("image"), addproduct);

// Route to fetch all products
router.get("/getProducts", getProducts);

// Route to fetch a product by ID
router.get("/findByid/:id", findByid);

// Route to get product by category
router.get('/getproductbycategory/:category', getproductbycategory);
router.get('/totalproduct',totalproduct)
// Route to delete a product
router.delete("/deleteproducts/:id", deleteproducts);

// Route to update a product
router.put("/updateproducts/:id", uploads.single("image"), updateproducts);

module.exports = router;
