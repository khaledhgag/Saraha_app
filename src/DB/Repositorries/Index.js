export { BaseRepo } from "./Base.Repo.js";
import { MessageRepo } from "./Message.Repo.js";
import { RevokedTokenRepo } from "./RevokedToken.Repo.js";
import { UserRepo } from "./User.Repo.js";

export const userRepo = new UserRepo();
export const messageRepo = new MessageRepo();
export const revokedTokenRepo = new RevokedTokenRepo();
