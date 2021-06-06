import { verify } from "jsonwebtoken";

function validateJWT(token: string) {
    try {
        let payload = null;
        payload = verify(token, process.env.CV_JWT_SECRET);
        return payload;
    } catch (e) {
        return null;
    }
}

export default validateJWT;
