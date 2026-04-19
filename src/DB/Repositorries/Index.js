export { BaseRepo } from "./Base.Repo.js";
import { MessageRepo } from "./Message.Repo.js";
import { UserRepo } from "./User.Repo.js";

export const userRepo = new UserRepo();
export const messageRepo = new MessageRepo();
