import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
}

export const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
}

export const verifyAccessToken = (token: string) => {
    jwt.verify(token, process.env.JWT_SECRET!);
}

export const emailVerificationToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
}