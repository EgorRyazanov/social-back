import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postValidation } from "./validations.js";
import checkAuth from "./utils/check-auth.js";

import * as UserController from "./controllers/user-controller.js";
import * as PostController from "./controllers/posts-controller.js";

mongoose
    .connect("mongodb+srv://aricsybsn:erwSnY6xkxLWhPBi@cluster0.madgf9l.mongodb.net/posts?retryWrites=true&w=majority")
    .then(() => console.log("ok"))
    .catch((err) => console.log(err));

const app = express();
app.use(cors());

app.use("/images", express.static("images"));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "images");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/images/${req.file.originalname}`,
    });
});

app.use(express.json());

app.post("/register", registerValidation, UserController.register);

app.post("/login", loginValidation, UserController.login);

app.get("/get-me", checkAuth, UserController.getMe);

app.post("/posts", checkAuth, postValidation, PostController.create);

app.get("/posts", checkAuth, PostController.getAll);

app.get("/users", UserController.getAllUsers);

app.post("/add-friend", checkAuth, UserController.addFriend);

app.post("/user", UserController.getUser);

app.post("/delete-friend", checkAuth, UserController.deleteFriend);

app.patch("/post", checkAuth, PostController.updatePost);

app.get("/post", checkAuth, PostController.getPost);

app.post("/like-post", checkAuth, PostController.likePost);

app.post("/user-posts", checkAuth, PostController.getUserPosts);

app.patch("/update", checkAuth, UserController.update);

app.post("/delete-post", checkAuth, PostController.deletePost);

app.listen(3001, (err) => {
    if (err) {
        return err;
    }
    console.log("Server started");
});
