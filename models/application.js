import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ApplicationSchema = new Schema({
  name: { type: String },
  logo: { type: String },
  subscriptionType: { type: String },
  secretKey: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  etat: { type: Boolean },
  languageOfDevelopment: { type: String }, // Add the languageOfDevelopment field here
}, {
  timestamps: true
});

export default model('Application', ApplicationSchema);
