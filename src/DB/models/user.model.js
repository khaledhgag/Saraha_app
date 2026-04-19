import mongoose from "mongoose";
import { GENDER, USER_ROLES, USER_STATUE } from "../../Utils/constants.utils.js";
import { prvidors } from "../../common/constants.js";


const userSchema = new mongoose.Schema({
   firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
         maxLength: 50,
    },
    lastName: { 
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String, 
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.USER,
    },
    gender: {
        type: String,
        enum: Object.values(GENDER),
    },
    statue: {
        type: String,
        enum: Object.values(USER_STATUE),
        default: USER_STATUE.ACTIVE,
    },
    phonenumber: {
        type: String,
    },
    googlesub:{
        type: String,
        index:{
            name: "googlesub_index",
            unique: true,

        },
        
    },
    Provider: {
        type: String,
        enum: Object.values(prvidors),
        default: prvidors.System,
    }

},{
    toJSON: {getters: true},
    toObject: {getters: true},
    timestamps: true,
});

userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});
   
 const user = mongoose.model('User', userSchema);  
 export default user;
