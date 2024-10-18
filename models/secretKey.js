import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  application: { type: Schema.Types.ObjectId, ref: 'Application' },
  value: { type: String },
  expirationDate: { type: Date },
 
});

export default model('Token', TokenSchema);
