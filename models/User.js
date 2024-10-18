import mongoose from 'mongoose';
import RoleEnum from './RoleEnum.js';

const userSchema = new mongoose.Schema({
  userID:{type:String},
  firstname: { type: String, },
  lastname: { type: String,},
  username: { type: String,},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  phone: { type: String},
  avatar: { type: String },
  isBanned: { type: Boolean, default: false},
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER
},

});



userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};
userSchema.statics.findByid= function(id) {
  return this.findOne({ id });
};
userSchema.statics.findBy_id= function(_id) {
  return this.findOne({ _id });
};
const User = mongoose.model('User', userSchema);

export default User;

