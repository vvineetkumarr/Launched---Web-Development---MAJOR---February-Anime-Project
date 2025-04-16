const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";

(async () => {
  try {
    const client = await MongoClient.connect(uri);
    console.log("✅ Connection successful!");
    console.log("Databases:", await client.db().admin().listDatabases());
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.log("\nTry these steps:");
    console.log("1. Open a new terminal");
    console.log("2. Run 'mongod'");
    console.log("3. Check if port 27017 is blocked");
    process.exit(1);
  }
})();