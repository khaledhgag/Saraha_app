import { BaseRepo } from "./Base.Repo.js";
import user from "../models/user.model.js";

export class UserRepo extends BaseRepo {
    constructor() {
        super(user);
    }

    findByEmail(email) {
        return this.findOneDocument({ email });
    }

    findPublicProfileById(id) {
        return this.findDocumentById(id);
    }

    updateProfile(id, data) {
        return this.findByIdAndUpdateDocument(id, data);
    }

    deleteAccount(id) {
        return this.findByIdAndDeleteDocument(id);
    }
}
