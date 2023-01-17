const express = require("express");
const app = express();
const HTTP_PORT = 8000 
const userRoute = require('./routes/users');

app.use('/auth', userRoute);

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
});
