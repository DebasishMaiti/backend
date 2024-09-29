const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const port = process.env.PORT || 8000;
const allRoutes = require("./Routes/index")
dotenv.config();

const server = express();
server.use(express.json({ limit: '50mb' }));
server.use(cors());

mongoose.connect("mongodb+srv://maitidebasish2001:debasish@cluster0.ff0ee.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connection Established"))
    .catch((error) => console.log(error));


server.use('/api', allRoutes)
server.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


server.get("/", (req, res) => {
    res.json({ message: "DEbassih" })
})

server.listen(port, () => {
    console.log(`server is running on port number ${port}`);
})
