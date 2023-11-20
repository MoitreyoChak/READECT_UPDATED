const app = require("./app");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

// const cookie_parser = require("cookie-parser");
const corsOpts = {
  origin: "https://readect-updated-frontend.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  // allowedHeaders: ['Content-Type'],
  // exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

const Atlas =
  "mongodb+srv://moitreyo:codinghabits365@cluster1.oivomfg.mongodb.net/readerInsect?retryWrites=true&w=majority";

// app.use(cookie_parser());

mongoose
  .connect(Atlas, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("db connection successful");
  });

const port = process.env.PORT || 3737;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
