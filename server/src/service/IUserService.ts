import { User } from "../model/user.interface";

export interface IUserService {

  createUser(username: string, password: string): Promise<User | null>

  findUser(username: string, password?: string): Promise<User | null>

}