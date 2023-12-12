// Import the mongoose library
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://admin:Sp00ky!@localhost:27017/?AuthSource=admin")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch(() => {
    console.log("Failed to Connect");
  });

// Define a schema for the "Collection1" documents
const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    required: false,
    default: []
  }
});

// Create a mongoose model based on the schema, named "Collection1"
const collection = new mongoose.model("Collection1", LogInSchema);
// Export the "Collection1" model for use in other parts of the application
module.exports = collection;