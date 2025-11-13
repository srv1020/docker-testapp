const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5050;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Important if you're sending JSON
app.use(express.static("public"));

// MongoDB Setup
const MONGO_URL = "mongodb://root:secure123@mongo:27017";
const DB_NAME = "apnacollege-db";

const client = new MongoClient(MONGO_URL);

let db;

// Connect once, reuse the client
async function connectToMongo() {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
    }
}

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const users = await db.collection("users").find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).send("Internal Server Error");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        const result = await db.collection("users").insertOne(userObj);
        console.log("✅ User inserted:", result.insertedId);
        res.status(201).send("User added successfully");
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Start server after DB connection is ready
app.listen(PORT, async () => {
    await connectToMongo();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
