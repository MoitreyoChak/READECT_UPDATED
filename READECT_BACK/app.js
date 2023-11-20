const express = require("express");
const app = express();
const readerRoute = require("./routes/readerRoute");
const poemRoutes = require("./routes/poemRoutes");
const bookRoutes = require("./routes/bookRoutes");
const shortStoryRoutes = require("./routes/shortStoryRoutes");
const articleRoutes = require("./routes/articleRoutes");
const reviewRoute = require("./routes/reviewRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getOtherReader } = require("./controllers/otherReaderController");

const limiter = rateLimit({
  max: 1000,
  // windowMs: 60 * 60 * 100, //1hr in milliseconds
  windowMs: 20000, //1hr in milliseconds
  // message: "Too many requests from this IP. Please try again in an hour.",
  message: {
    message: "Too many requests from this IP. Please try again in an hour",
  },
});
app.use("/api", limiter);

// const corsOpts = {
//   origin: "https://readect-updated-frontend.vercel.app/",
//   credentials: true,
//   methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type"],
//   exposedHeaders: ["Content-Type"],
// };
// app.use(cors(corsOpts));

app.use(function (req, res, next) {
  req.header(
    "Access-Control-Allow-Origin",
    "https://readect-updated-frontend.vercel.app/"
  ); // '*' allows any origin, you can reqtrict it to specific origins
  req.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cookieParser());

//set security http headers (preventing anyone to manipulate headers)
app.use(helmet());

//Data sanitization againt NoSQL query injection
app.use(mongoSanitize());

app.use(express.json());

app.use("/api/v1/reader", readerRoute);
app.use("/api/v1/reader/poem", poemRoutes);
app.use("/api/v1/reader/book", bookRoutes);
app.use("/api/v1/reader/shortStory", shortStoryRoutes);
app.use("/api/v1/reader/article", articleRoutes);
app.use("/api/v1/reader/reviews", reviewRoute);

app.get("/api/v1/reader/otheruser/:id", getOtherReader);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
