import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { pick } from 'ramda';
import { getRepository } from 'typeorm';
import * as JWT from 'jsonwebtoken';

import { User } from '../entity/User';
import AuthController from './AuthController';

class UserController{
    static getMe = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = res.locals.jwtPayload.userId;

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            res.status(200).send(pick(['id', 'username', 'watchList'], user));
        } catch (error) {
            res.status(404).send('User not found');
        }
    };

    static addMovies = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = res.locals.jwtPayload.userId;

        const movies = req.body.movies as number[];

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            const set = new Set(user.watchList);
            movies.forEach((movie) => { set.add(movie) });
            user.watchList = Array.from(set);
            await userRepository.save(user);
            res.status(200).send({ watchList: user.watchList });
        } catch (error) {
            res.status(500).send("Couldn't add movies");
        }
    };

    static deleteMovies = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = res.locals.jwtPayload.userId;

        const movies = req.body.movies as number[];

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            const set = new Set(user.watchList);
            movies.forEach((movie) => { set.delete(movie) });
            user.watchList = Array.from(set);
            const a = await userRepository.save(user);
            res.status(200).send({ watchList: user.watchList });
        } catch (error) {
            res.status(500).send("Couldn't delete movies");
        }
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { username, password } = req.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.watchList = [];

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        const other = await userRepository.findOne({ username })
        if (other) {
            res.status(409).send('username already in use');
            return;
        }

        try {
            const newUser = await userRepository.save(user);
            const token = JWT.sign(
              { userId: newUser.id, username },
              process.env.JWT_SECRET
            );

            res.cookie(AuthController.TOKEN_COOKIE_NAME, token, { httpOnly: true, secure: true, maxAge: 900000 });
            res.status(201).send({
                user: pick(['id', 'username', 'watchList'], newUser)
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('server error');
            return;
        }

        //If all ok, send 201 response
        res.status(201).send('User created');
    };
}

export default UserController;
