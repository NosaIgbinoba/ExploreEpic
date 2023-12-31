const mongoose = require("mongoose");

// Replace this with your Azure Cosmos DB connection string
const connectionString = "mongodb://exploreepicdatabase:80l4sRze5uQpbqlRCGdT7d5htDwiOadyVok0djJknNt4TFIu0occtM9dTbSzgMiQFQFDw8HnwZyWACDbj7bIXQ==@exploreepicdatabase.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@exploreepicdatabase@";

// Define a schema for the "Collection1" documents
const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    required: false,
    default: [],
  },
});

let Collection1;

async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Azure Cosmos DB");

    if (mongoose.models.Collection1) {
      Collection1 = mongoose.model("Collection1");
    } else {
      Collection1 = mongoose.model("Collection1", LogInSchema);
    }

    return Collection1; // Return the model to use in other parts of the application
  } catch (error) {
    console.error("Error connecting to Azure Cosmos DB:", error);
    throw error; // Throw an error if the connection fails
  }
}

module.exports = connectToDatabase; // Export the function to connect to the database
