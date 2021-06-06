import validateRequest from "../../utils/api/validateResquest";
import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { DBConsoleClient } from "dynamo-sdk/dist";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const validRequest = validateRequest(["POST"], req, res);

    if (!validRequest) return;

    const body = req.body;

    if (!("username" in body)) {
        return res.status(400).json({
            error: "Missing username in request body",
        });
    }
    if (!("password" in body)) {
        return res.status(400).json({
            error: "Missing password in request body",
        });
    }

    const username = body.username;
    const password = body.password;

    const client = new DBConsoleClient(
        process.env.CV_AWS_DB_TABLE_NAME,
        process.env.CV_AWS_DB_USER_ACCESS_KEY,
        process.env.CV_AWS_DB_USER_SECRET_KEY,
        process.env.CV_AWS_DB_LOCATION
    );

    const user = await client.getUserByUsername(username);

    if (!user) {
        return res.status(403).json({
            error: "No account found",
        });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            error: "Invalid username/password",
        });
    }

    const token = sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.CV_JWT_SECRET
    );

    const cookies = new Cookies(req, res);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        expires: expiryDate,
        overwrite: true,
    });

    return res.status(200).json({
        user,
    });
};
