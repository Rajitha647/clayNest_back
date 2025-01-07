const productmodel = require("../model/productmodel");
const fs = require('fs');
const path = require('path');

const validateProductData = ({ title, description, price, rating }) => {
  if (!title || !description || !price || !rating) {
    return "All fields are required.";
  }
  if (isNaN(price) || price <= 0) {
    return "Price must be a positive number.";
  }
  if (isNaN(rating) || rating < 0 || rating > 5) {
    return "Rating must be between 0 and 5.";
  }
  return null; 
};

const addproduct = async (req, res) => {
  const { title, description, price, rating,category,stock } = req.body;
  const userid = req.headers.userid;

  if (!req.file) {
    return res.status(400).json({ status: 0, msg: "File upload failed" });
  }

  const validationError = validateProductData({ title, description, price, rating ,category,stock});
  if (validationError) {
    return res.status(400).json({ status: 0, msg: validationError });
  }

  try {
    await productmodel.create({
      userid,
      title,
      description,
      category,
      price,
      rating,
      stock,
      image: req.file.filename,
    });

    res.json({ status: 1, msg: "Product added successfully" });
  } catch (error) {
    console.error("Error saving product:", { error, requestBody: req.body, userId: userid });
    res.status(500).json({ status: 0, msg: "Failed to save product", error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productmodel.find();  
    res.json({ status: 1, data: products });  
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: 0, msg: "Failed to fetch products", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productmodel.findById(req.params.idno);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

const getproductbycategory=async (req, res) => {
  const { category } = req.params;
  try {
      const products = await productmodel.find({ category: category });
      if (products.length === 0) {
          return res.status(404).json({ message: 'No products found in this category' });
      }
      res.status(200).json(products);
  } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: 'Failed to fetch products by category' });
  }
};


const deleteproducts = async (req, res) => {
  const productId = req.params.id;  // Capture productId from URL params
  console.log("Received product ID:", productId); // Log the productId

  if (!productId) {
    return res.status(400).json({ status: 0, message: "Product ID is required." });
  }

  try {
    const result = await productmodel.findByIdAndDelete(productId);
    if (result) {
      res.json({ status: 1, message: "Product deleted successfully." });
    } else {
      res.status(404).json({ status: 0, message: "Product not found." });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: 0, message: "Error deleting product." });
  }
};


// const updateproducts=async(req,res)=>{
//   const id=req.headers.idno;
//   const {title,description,category,price,rating,stock}=req.body 
//   await productmodel.updateOne({_id:id},{title,description,category,price,rating,stock})
//   res.json({status:1,msg:"Data Updated"})
// }


const findByid = async (req, res) => {
  const { id } = req.params;
  
  try {
   
    const product = await productmodel.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};


const updateproducts = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, price, rating, stock } = req.body;
  
  try {
    const product = await productmodel.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.rating = rating || product.rating;
    product.stock = stock || product.stock;

    if (req.file) {
     
      if (product.image && fs.existsSync(path.join(__dirname, '..', product.image))) {
        fs.unlinkSync(path.join(__dirname, '..', product.image));
      }

      product.image = req.file.path.replace('public', '');
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};


const totalproduct=async (req, res) => {
  try {
    const totalProducts = await productmodel.countDocuments();
    res.json({ total: totalProducts });
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ message: "Error fetching total products" });
  }
}


module.exports = {
  addproduct,
  getProducts,
  getProductById,
  deleteproducts,
  updateproducts,
  getproductbycategory,
  findByid,
  totalproduct
};
