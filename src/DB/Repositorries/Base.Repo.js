export class BaseRepo {
    constructor(model) {
        this.model = model;
    }

    createDocument(data) {
        return this.model.create(data);
    }

    findDocument(filter = {}, projection = null, options = {}) {
        return this.model.find(filter, projection, options);
    }

    findOneDocument(filter = {}, projection = null, options = {}) {
        return this.model.findOne(filter, projection, options);
    }

    findDocumentById(id, projection = null, options = {}) {
        return this.model.findById(id, projection, options);
    }

    updateDocumentWithUpdateOne(filter = {}, data = {}, options = {}) {
        return this.model.updateOne(filter, data, options);
    }

    updateDocumentsWithUpdateMany(filter = {}, data = {}, options = {}) {
        return this.model.updateMany(filter, data, options);
    }

    findOneAndUpdateDocument(filter = {}, data = {}, options = {}) {
        return this.model.findOneAndUpdate(filter, data, {
            new: true,
            runValidators: true,
            ...options,
        });
    }

    findByIdAndUpdateDocument(id, data = {}, options = {}) {
        return this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            ...options,
        });
    }

    deleteOneDocument(filter = {}, options = {}) {
        return this.model.deleteOne(filter, options);
    }

    deleteManyDocuments(filter = {}, options = {}) {
        return this.model.deleteMany(filter, options);
    }

    findOneAndDeleteDocument(filter = {}, options = {}) {
        return this.model.findOneAndDelete(filter, options);
    }

    findByIdAndDeleteDocument(id, options = {}) {
        return this.model.findByIdAndDelete(id, options);
    }

    countDocuments(filter = {}) {
        return this.model.countDocuments(filter);
    }

    exists(filter = {}) {
        return this.model.exists(filter);
    }
}
