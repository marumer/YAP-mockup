const express = require("express");
const projectRouter = require("./routers/projectRouter");

// const CORS_OPTION = {
//    credentials: true,
//    origin: process.env.MODE === MODE.dev ? ["http://localhost:3000", "http://127.0.0.1:3000"] : process.env.CORS_ORIGIN,
//    optionsSuccessStatus: 200,
// };

const app = express();

app.use(express.json({ limit: "1mb" }));
// app.use(cors(CORS_OPTION));

app.use("/api/project", projectRouter);

// default 404 invalid route
app.route("*").all((req, res) => {
   res.status(404).json({ message: "invalid endpoint." });
});

const port = 3000;

// Starting this project with basic in memeory collections
global.projects = [];

app.listen(port, () => {
   console.log(`YAP-mockup is listening on port ${port}`);
});
