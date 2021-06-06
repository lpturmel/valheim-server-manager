import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from "jsonwebtoken";
import validateJWT from "../validateJWT";

function validateCookie(req: NextApiRequest, res: NextApiResponse) {
    let valid = true;

    const cookies = new Cookies(req, res);

    const token = cookies.get("token");

    if (!token) {
        valid = false;
        res.status(401).json({
            error: "Request not authenticated",
        });
    }

    const payload = validateJWT(token);

    if (!payload) {
        valid = false;
        res.status(403).json({
            error: "Invalid token",
        });
    }

    return valid;
}

export default validateCookie;
