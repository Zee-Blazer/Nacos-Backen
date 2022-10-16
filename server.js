const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middlewares
app.use(express.json());
app.use(cors());

// API's
app.use('/request', require('./routers'));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
