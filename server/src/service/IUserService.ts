import {User } from "../model/user.interface";

export interface IUserService {

    createUser(username: String, password: String): Promise<User>

    findUser(username: String, password?: String): Promise<User>

  }