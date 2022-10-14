const express = require("express")
const mongoose = require("mongoose")
const chalk = require("chalk")
const parser = require("body-parser")
const app = express()

mongoose.connect("mongodb://localhost:27017/Data", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
     console.log("Mongoo Db is Connect")
}).catch((error) => {
     console.log(error)
})

app.use(parser.urlencoded({ extended: false }))
app.use(express.json())

const productSchema = mongoose.Schema({
     name: String,
     description: String,
     price: Number
})

const Product = new mongoose.model("Product", productSchema)
// Create Product
app.post("/api/v1/create/product", async (req, res) => {
     try {
          const product = await Product.create(req.body)
          res.status(200).json({ success: true, product });
     } catch (e) {
          res.status(400).json({ success: false, message: e })
     }
})

// Read Product
app.get("/api/v1/products", async (req, res) => {
     try {
          const product = await Product.find()
          res.status(200).json({
               success: true,
               product
          })
     } catch (e) {
          res.status(400).json({ success: false, message: e })
     }

})
// Update the Product

app.put("/api/v1/product/:id", async (req, res) => {
     let product = await Product.findById(req.params.id);
     product = await Product.findByIdAndUpdate(req.params.id, req.body,
          {
               new: true,
               useFindAndModify: true,
               runValidators: true
          })
     res.status(200).json({
          success:true,
          product
     })          
})

// Delete the Items

app.delete("/api/v1/deleteProduct/:id",async(req,res)=>{
     let product = await Product.findById(req.params.id)
     if(!product){
          res.status(500).json({
               message:"Product Not Found"
          })
     }
     else{
          await product.remove()
          res.status(200).json({
               success:true,
               message:"Product Delete Successfully"
          })
     }
})


app.listen(4500, () => {
     console.log(chalk.yellow.inverse("The Port 1000 is listening"))
})