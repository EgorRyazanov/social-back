import { body } from "express-validator";

export const registerValidation = [
    body("email", "Неверная почта").isEmail(),
    body("password", "Длина должна быть больше 6").isLength({ min: 6 }),
    body("name", "Длина должна быть больше 2").isLength({ min: 2 }),
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidation = [
    body("email", "Неверная почта").isEmail(),
    body("password", "Длина должна быть больше 6").isLength({ min: 6 }),
];

export const postValidation = [
    body("title", "Укажите заголовок").isLength({ min: 1 }).isString(),
    body("text", "Введите текст").isLength({ min: 3 }).isString(),
    body("imageUrl", "Неверная ссылка изображения").optional().isString(),
];
