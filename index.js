require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const taskFlowDB = client.db("taskFlowDB");
    const taskCollection = taskFlowDB.collection("allTasks");
    const userCollection = taskFlowDB.collection("allUsers");

    // Get Users
    app.get("/users", async(req, res) => {
        const findUsers = userCollection.find({});
        const result = await findUsers.toArray();
        res.send(result);
    });

    // Post User
    app.post("/user", async(req, res) => {
        console.log(req.body);
        const userInfo = req.body;
        const id = {userID: userInfo.userID};
        const existedUser = await userCollection.findOne(id);

        if(existedUser){
          return res.send({message: "User already exists", insertedId: null});
        }

        const insertResult = await userCollection.insertOne(userInfo);
        res.send(insertResult);
    });

    // Get All Tasks
    app.get("/tasks", async(req, res) => {
      const uid = req.query.uid;
      const query = {UserID: uid}
        const findTasks = taskCollection.find(query);
        const result = await findTasks.toArray();
        res.send(result);
    });

    // Post Task
    app.post("/tasks", async(req, res) => {
        const taskData = req.body;
        const insertResult = await taskCollection.insertOne(taskData);
        res.send(insertResult);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Task management is running now...");
});

app.listen(port, () => {
    console.log(`Task Management Backend is running at port ${port}`);
});