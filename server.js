import dotenv from "dotenv";
import cors from "cors";
import express from "express";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log("Server is running on 3000");
});

//Route File
import router from "./routes/index.route.js"
app.use(router)
