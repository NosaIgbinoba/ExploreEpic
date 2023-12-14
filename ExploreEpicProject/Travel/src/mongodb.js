const { MongoClient } = require("mongodb");

const connectionString = "mongodb://exploreepicdatabase:80l4sRze5uQpbqlRCGdT7d5htDwiOadyVok0djJknNt4TFIu0occtM9dTbSzgMiQFQFDw8HnwZyWACDbj7bIXQ==@exploreepicdatabase.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@exploreepicdatabase@";

// Function to connect to Cosmos DB and export the collection for use in other parts of the application
async function connectAndExportCollection() {
  try {
    const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    console.log('Connected successfully to Cosmos DB');

    // Access the "Collection1" collection from Azure Cosmos DB using the 'client' object
    const db = client.db('exploreepicdatabase');
    const collection = db.collection('Collection1');

    // Export the "Collection1" collection for use in other parts of the application
    module.exports = collection;

    // You can perform operations using the 'collection' here if needed
    // For example, find documents, insert, update, or delete documents

    // Close the client/connection when done (or manage it as per your application's flow)
    // await client.close();
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

// Call the function to connect and export the collection
connectAndExportCollection();
