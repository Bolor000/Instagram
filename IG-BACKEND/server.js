import express from "express";
import mongoose from "mongoose";
import { userModel } from "./schema/user.schema.js";
import { postModel } from "./schema/post.schema.js";
import { hash } from "bcrypt";

const port = 1212;
const app = express();
app.use(express.json());

const connectToMongoDb = async () => {
  await mongoose.connect(
    "mongodb+srv://Bolormaa:Bolor0924@cluster0.6piodys.mongodb.net/"
  );
};
connectToMongoDb();

app.get("/user", async (req, res) => {
  const user = await userModel.find();
  res.json(user);
});

app.post("/user/create", async (req, res) => {
  const body = req.body;
  const { username, email, password } = body;
  const saltRound = 10;
  const hashedPassword = await hash(password, saltRound);

  const isExisting = await userModel.findOne({ email });

  if (isExisting) {
    res.status(400).json({ message: "user already exist" });
  } else {
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.json({ newUser });
  }
});

app.post("/post/create", async (req, res) => {
  const data = req.body;
  const { userID, caption, images } = data;
  const newPost = await postModel.create({
    user: userID,
    caption: caption,
    images: images,
  });
  res.status(200).json(newPost);
});

app.listen(port, () => {
  console.log("running" + port);
});
