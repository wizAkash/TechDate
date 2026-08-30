const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000...');
})

app.use('/dashboard', (req,res) => {
    res.send('This is the dashboard page response');
})

app.use('/', (req, res) => {
    res.send('This is the main home page');
})