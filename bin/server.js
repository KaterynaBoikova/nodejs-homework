const app = require('../app')
const process = require('process');
require('dotenv').config();
const {connectMongo} = require('../services/connectionDB');

const PORT = process.env.PORT || 8081;

const start = async () => {
  try {
    await connectMongo();
    console.log('Database connection successful')
    app.listen(PORT, (err) => {
      if (err) console.error('Error at server launch:', err);
      console.log(`Server works at port ${PORT}!`);
    });
  } catch (err) {
    console.error(`Failed to launch application with error: ${err.message}`);
    process.exit(1);
  }
};

start();