const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());

const config = {
  user: 'dpadmin',
  password: 'hdd@2000',
  server: 'dpdbserver.database.windows.net',
  database: 'wheather_db',
  options: {
    encrypt: true
  }
};

const port = process.env.PORT || 3000;

sql.connect(config)
.then(pool => {
  console.log('Connected to Azure SQL DB');
})
.catch(err => {
  console.error('Database connection failed: ',err);
});

//Endpoint to get all data
app.get('/weather', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Query to select all data from the weather table
    const result = await sql.query`SELECT * FROM districts WHERE name = ${districts}`;

    // Close the database connection
    await sql.close();

    // Send the data as JSON in the response
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch data from the weather table based on district
app.get('/weather/:district', async (req, res) => {
  const district = req.params.district;
  try {
    // Connect to the database
    await sql.connect(config);

    // Query to select data from the weather table based on district
    const result = await sql.query`SELECT * FROM districts WHERE name = ${district}`;

    // Close the database connection
    await sql.close();

    // Send the data as JSON in the response
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});