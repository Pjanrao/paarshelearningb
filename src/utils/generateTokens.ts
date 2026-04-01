import jwt from "jsonwebtoken";

export default function generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
        { userId, role },
        process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret",
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}
