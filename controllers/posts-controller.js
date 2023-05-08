import PostModel from "../models/post.js";
import UserModel from "../models/user.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            desc: req.body.desc,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch {
        res.status(500).json({ message: "Не удалось создать статью" });
    }
};

// посты друзей
export const getAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const posts = await PostModel.find().where("user").in(user.friends).populate("user").exec();

        res.json(posts);
    } catch {
        res.status(500).json({ message: "Не удалось получить все статьи" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.body._id).populate("user").exec();
        post.title = req.body.title;
        post.desc = req.body.desc;
        post.text = req.body.text;
        post.imageUrl = req.body.imageUrl;
        await post.save();

        res.json(post);
    } catch {
        res.status(500).json({ message: "Не удалось обновить статью" });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.body._id).populate("user").exec();
        res.json(post);
    } catch {
        res.status(500).json({ message: "Не удалось получить статью" });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.body._id).populate("user").exec();
        if (post.likes.find((user) => user.equals(req.userId))) {
            post.likes.splice((user) => user.equals(req.userId));
        } else {
            post.likes.push(req.userId);
        }
        await post.save();

        res.json(post);
    } catch {
        res.status(500).json({ message: "Не удалось обновить статью" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().where("user").equals(req.body._id).populate("user").exec();

        res.json(posts);
    } catch {
        res.status(500).json({ message: "Не удалось получить статьи" });
    }
};

export const deletePost = async (req, res) => {
    try {
        await PostModel.findByIdAndDelete(req.body._id);

        res.json({
            success: true,
        });
    } catch {
        res.status(500).json({ message: "Не удалось получить статьи" });
    }
};
