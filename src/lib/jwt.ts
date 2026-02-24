import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "691ce729057ceb9d34ade6b722a1440d";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "7257646bf40ccac313fd8676d529aea4";

export interface JwtPayload {
    userId: string;
    role: string
}


export function signAccessToken(payload: JwtPayload) {
    console.log(JWT_SECRET, "JWT_SECRET")

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn : "15m"
    })
}


export function signRefreshToken(payload: JwtPayload) {
    console.log(JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET")

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}


export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}