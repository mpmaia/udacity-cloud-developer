import {Request, Response } from 'express';
import { NextFunction } from 'connect';
import {config} from "./config";
import * as jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2) {
        return res.status(500).send({ message: 'Invalid token.' });
    }

    const token = token_bearer[1];
    return jwt.verify(token, config.jwt_key, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Permission denied.' });
        }
        return next();
    });
}

export function generateToken(user: string) {
    return jwt.sign({ user }, config.jwt_key);
}
