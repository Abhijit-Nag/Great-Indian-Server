const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const DefaultData = require('./default');
const app = express();
const signRouter = require('./routers/route');
const cors = require('cors');
app.use(cors());
const paymentRoute = require('./routers/paymentRoutes');
const updateRoute = require('./routers/update');

const userCartRoute = require('./routers/userCart');
const emailRoute = require('./routers/emailRoute');
const aiRoute = require('./routers/aiRoute');
dotenv.config();


const PORT = 8080;


const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const db_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.9cryh7q.mongodb.net/FlipkartClone?retryWrites=true&w=majority`;

mongoose.connect(db_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('Database is connected to the server successfully!')).catch((err) => console.log(err));


app.get('/', (req, res) => {
    res.send('Welcome to Great Indian server .');
})

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/', signRouter);
app.use('/api', paymentRoute);
app.use('/user', userCartRoute);
app.use('/user', updateRoute);
app.use('/mail', emailRoute);
app.use('/ai', aiRoute);



// Serve the main HTML file for all other routes
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running now on PORT ${PORT}`);
});




app.listen(PORT, () => {
    console.log(`Server is running now on PORT ${PORT} `);
})

DefaultData();
