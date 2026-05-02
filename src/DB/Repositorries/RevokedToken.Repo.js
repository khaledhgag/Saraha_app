import { BaseRepo } from "./Base.Repo.js";
import revokedTokenModel from "../models/revoked-token.model.js";

export class RevokedTokenRepo extends BaseRepo {
    constructor() {
        super(revokedTokenModel);
    }
}
