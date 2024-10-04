import dotenv from "dotenv";
import express from "express";
import userRoute from "./routes/user.route.js"
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log("Server is running on 3000");
});

app.use("/api/user", userRoute)
