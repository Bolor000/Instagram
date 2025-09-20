import express from "express";
import mongoose from "mongoose";
import { userModel } from "./schema/user.schema.js";
import { postModel } from "./schema/post.schema.js";
import { hash, compare } from "bcrypt";
import cors from "cors";

const port = 1212;
const app = express();
app.use(cors());
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

app.post("/login", async (req, res) => {
  const body = req.body;
  const { email, password } = body;
  const user = await userModel.findOne({ email });

  if (user) {
    const hashedPassword = user.password;
    const isValid = await compare(password, hashedPassword);
    if (isValid) {
      res.json(user);
    } else {
      res.status(404).json({ message: "wrong password" });
    }
  } else {
    res.status(404).json({ message: "need to register" });
  }
});

app.post("/sign-up", async (req, res) => {
  const body = req.body;
  const saltRounds = 10;
  const { username, email, password } = body;
  const isExisting = await userModel.findOne({ email });
  const hashedPassword = await hash(password, saltRounds);
  if (isExisting) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = await userModel.create({
    username: username,
    email: email,
    password: hashedPassword,
  });
  
  res.status(201).json({
    message: "Signed up successfully",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

app.post("/create", async (req, res) => {});

app.get("/posts:userID", async (req, res) => {
  const params = req.params;
  const { userID } = params;
  const posts = await postModel.find({ user: userID });

  res.status(200).json(posts);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});


