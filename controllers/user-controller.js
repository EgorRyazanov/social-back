import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/user.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            secondName: req.body.secondName,
            name: req.body.name,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({ _id: user._id }, "secret_key", {
            expiresIn: "30d",
        });

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch {
        res.status(500).json({
            message: "Ошибка в регистрации",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
            .populate(["friends", "outgoing", "requests"])
            .exec();

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign({ _id: user._id }, "secret_key", {
            expiresIn: "30d",
        });

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch {
        res.status(500).json({
            message: "Ошибка в авторизации",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate(["friends", "outgoing", "requests"]).exec();
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        console.log(user._doc);
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch {
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch {
        res.status(500).json({
            message: "Не удалось получить пользователей",
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body._id);
        res.json(user);
    } catch {
        res.status(500).json({
            message: "Не удалось получить пользователей",
        });
    }
};

export const addFriend = async (req, res) => {
    try {
        let user = await UserModel.findById(req.userId).populate(["friends", "outgoing", "requests"]).exec();
        let friend = await UserModel.findById(req.body._id).populate(["friends", "outgoing", "requests"]).exec();
        if (user.requests.find((user) => user._id.equals(friend._id))) {
            user.requests.splice((friend) => friend._id.equals(friend._id));
            user.friends.push(friend);
            friend.outgoing.splice((user) => user._id.equals(user._id));
            friend.friends.push(user);
        } else {
            user.outgoing.push(friend);
            friend.requests.push(user);
        }
        await friend.save();
        await user.save();
        res.json(user);
    } catch {
        res.status(500).json({
            message: "Не удалось добавить в друзья",
        });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate(["friends", "outgoing", "requests"]).exec();
        const friend = await UserModel.findById(req.body._id).populate(["friends", "outgoing", "requests"]).exec();
        if (user.friends.find((user) => user._id.equals(friend._id))) {
            user.friends.splice((friend) => friend._id.equals(friend._id));
            friend.friends.splice((user) => user._id.equals(user._id));
        } else {
            user.outgoing.splice((friend) => friend._id.equals(friend._id));
            friend.requests.splice((user) => user._id.equals(user._id));
        }
        await friend.save();
        await user.save();
        res.json(user);
    } catch {
        res.status(500).json({
            message: "Не удалось удалить пользователя из друзей",
        });
    }
};

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        user.name = req.body.name;
        user.secondName = req.body.secondName;
        user.avatarUrl = req.body.avatarUrl;
        user.university = req.body.university;
        user.age = req.body.age;

        await user.save();

        res.json(user);
    } catch {
        res.status(500).json({
            message: "Не удалось обновить пользователя",
        });
    }
};
