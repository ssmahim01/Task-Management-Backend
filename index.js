require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: [
    "https://task-flow-25.web.app",
    "https://my-task-flow-management.vercel.app"
  ]
}));

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
    // await client.connect();

    const taskFlowDB = client.db("taskFlowDB");
    const taskCollection = taskFlowDB.collection("allTasks");
    const userCollection = taskFlowDB.collection("allUsers");

    // Get Users
    app.get("/users", async (req, res) => {
      const findUsers = userCollection.find({});
      const result = await findUsers.toArray();
      res.send(result);
    });

    // Post A User
    app.post("/user", async (req, res) => {
      // console.log(req.body);
      const userInfo = req.body;
      const id = { userID: userInfo.userID };
      const existedUser = await userCollection.findOne(id);

      if (existedUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const insertResult = await userCollection.insertOne(userInfo);
      res.send(insertResult);
    });

    // Get All Tasks
    app.get("/tasks", async (req, res) => {
      const uid = req.query.uid;
      const query = { UserID: uid }
      const findTasks = taskCollection.find(query).sort({ Category: 1, index: 1 });
      const result = await findTasks.toArray();
      res.send(result);
    });

    // Get Dynamic Task
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const findResult = await taskCollection.findOne(query);
      res.send(findResult);
    });

    // Post A Task
    app.post("/tasks", async (req, res) => {
      const taskData = req.body;
      const insertResult = await taskCollection.insertOne(taskData);
      res.send(insertResult);
    });

    // Update Draggable Content Of Task
    app.put("/task-move/:id", async (req, res) => {
      const id = req.params.id;
      const { Category: newCategory, newIndex } = req.body;
      
      const query = { _id: new ObjectId(id) };
      const task = await taskCollection.findOne(query);
      
      if (!task) {
          return res.status(404).send({ message: "Task not found" });
      }
  
      const oldCategory = task.Category;
  
      // Remove task from old category and re-index remaining tasks
      await taskCollection.updateMany(
          { Category: oldCategory, index: { $gt: task.index } },
          { $inc: { index: -1 } }
      );
  
      // Get current tasks in the new category and adjust indexes
      const newCategoryTasks = await taskCollection.find({ Category: newCategory }).sort({ index: 1 }).toArray();
  
      // Insert the task at the correct position
      newCategoryTasks.splice(newIndex, 0, task);
  
      // Update all indexes in the new category
      const updatePromises = newCategoryTasks.map((t, i) =>
          taskCollection.updateOne(
              { _id: new ObjectId(t._id) },
              { $set: { index: i, Category: newCategory } }
          )
      );
  
      await Promise.all(updatePromises);
  
      res.status(200).send({ message: "Task moved successfully" });
  });  

    // Update A Task
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateData = req.body;

      const updatedDoc = {
        $set: updateData
      }

      const updateResult = await taskCollection.updateOne(query, updatedDoc);
      res.send(updateResult);
    });

    // Update A Category
    app.put("/task-category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const { Category } = req.body;

      const updateCategory = {
        $set: { Category }
      }

      const updateResult = await taskCollection.updateOne(query, updateCategory);
      res.send(updateResult);
    });

    // Delete A Task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const deleteResult = await taskCollection.deleteOne(query);
      res.send(deleteResult);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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