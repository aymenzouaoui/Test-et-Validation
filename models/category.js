import mongoose from 'mongoose';
import Section from '../models/section.js'; 
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    sections: [
      {
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
        title: String,
        descriptionF: String,
        descriptionK: String,
        descriptionS: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Category = model('Category', categorySchema);

export default Category;
