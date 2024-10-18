import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const sectionSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        descriptionF: {
            type: String,
            required: true
        },
        descriptionK: {
            type: String,
            required: true
        },
        descriptionS: {
            type: String,
            required: true
        },
        colorLine: {
            type: Boolean,
            default: false // Default value for colorLine field
        },
        codeBox: {
            type: Boolean,
            default: false // Default value for codeBox field
        },
        // Add formatOptions field to schema
        formatOptions: {
            colorLine: Boolean,
            codeBox: Boolean
        }
    },
    {
        timestamps: true
    }
);

export default model('Section', sectionSchema);
