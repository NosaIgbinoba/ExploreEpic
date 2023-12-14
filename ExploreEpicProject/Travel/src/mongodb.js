var mongoClient = require("mongodb").MongoClient;

var connectionString = "mongodb://exploreepicdatabase:80l4sRze5uQpbqlRCGdT7d5htDwiOadyVok0djJknNt4TFIu0occtM9dTbSzgMiQFQFDw8HnwZyWACDbj7bIXQ==@exploreepicdatabase.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@exploreepicdatabase@";

mongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.error('Failed to connect:', err);
    return;
  }

  console.log('Connected successfully to Cosmos DB');

  // Define a schema for the "Collection1" documents (similar to the previous Mongoose schema)
  const LogInSchema = {
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
  };

  // Access the "Collection1" collection from Azure Cosmos DB using the 'client' object
  const db = client.db('exploreepicdatabase'); // Replace 'YourDatabaseName' with your actual DB name
  const collection = db.collection('Collection1');

  // Export the "Collection1" collection for use in other parts of the application
  module.exports = collection;

  client.close(); // Close the connection when done (or maintain the connection as needed)
});
