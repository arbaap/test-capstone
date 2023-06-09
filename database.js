const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://testcapstone:testcapstones@cluster0.93sie2d.mongodb.net/testcapstone?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("<database-name>");
    usersCollection = db.collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = {
  connectToDatabase,
  usersCollection,
};
