const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');

async function startServer() {
  console.log('Starting in-memory MongoDB server...');

  // Start MongoDB Memory Server
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'tresmo'
    },
    binary: {
      version: '4.0.28'
    }
  });

  const uri = mongod.getUri();
  console.log('MongoDB Memory Server started at:', uri);
  console.log('Port: 27017');

  // Keep the process running
  console.log('\nMongoDB is running. Press Ctrl+C to stop.\n');

  // Handle cleanup
  process.on('SIGINT', async () => {
    console.log('\nStopping MongoDB Memory Server...');
    await mongod.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await mongod.stop();
    process.exit(0);
  });
}

startServer().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});
