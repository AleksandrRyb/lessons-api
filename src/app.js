const express = require('express');
const lessonsRouter = require('./routes/lessons');

const app = express();

app.use('/lessons', lessonsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

