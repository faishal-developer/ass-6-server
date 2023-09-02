require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3004;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://mdfaishal:gXAYAP3O4aFbA5HN@cluster0.w7rmmpa.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("ass-6");
    const productCollection = db.collection("products");
    const categoriesCollection = db.collection("categories");

    app.get("/products", async (req, res) => {
      try{

        const category = req.query.category;
        const query=category? {Category:Number(category)} : {}
        const cursor = productCollection.find(query);
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
      }catch(e){
        console.log(e,42);
      }
    });

    app.post("/products", async (req, res) => {
      try{
        const product = req.body;
      console.log(product);
      product.Publication_date = new Date().toLocaleString();
      const result = await productCollection.insertOne(product);

      res.send(result);
      }catch(e){
        console.log(e.message);
      }
    });

    app.get("/products/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const result = await productCollection.findOne({ id:Number(id) });
        console.log(id,result)
        res.send(result);
      }catch(e){
        console.log(e);
      }
    });
    app.patch("/products/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const product = req.body;
      const result = await productCollection.findOneAndUpdate(
        { _id:new ObjectId(id) },
        {
          $set: {
            Author: product.Author, 
            Title: product.Title,
            Genre: product.Genre
          }
        },
        { returnOriginal: false }
      );
            console.log(id,product,result);
      if (!result) {
          return res.status(404).send("product not found");
      }
      
        res.send(result.value);
      }catch(e){
        console.log(e);
      }
    });

    app.delete("/products/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const result = await productCollection.deleteOne({ _id:new ObjectId(id) });
        console.log(result);
        res.send(result);
      }catch(e){
        console.log('product deletion error',e.message)
      }
    });

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find({}).toArray();
      res.send({ status: false,data:result });
    });
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const result = await categoriesCollection.findOne({id:Number(id)});
      res.send({ status: false,data:result });
    });
  }catch(e){
    console.log("dekhtechi bishoyta");
  } 
  finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
