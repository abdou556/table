import express from 'express';
import { readFile } from 'fs';
import cors from 'cors'; // Import cors package

const app = express();
const port = 3000;

// Use cors middleware
app.use(cors());

// Define endpoint for '/data'
app.get('/data', (req, res) => {
  // Read 'data.json' file
  readFile('data.json', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      res.status(500).send('Error reading data.json');
      return;
    }
    try {
      const transactions = JSON.parse(data);
      res.json(transactions);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).send('Error parsing JSON');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
