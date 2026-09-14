import { Schema, model, Model, Document } from "mongoose";
import OfficalPaperCategory from "../../models/OfficalPaperCategory";

export const OfficalPaperCategoryTableName = "OfficalPaperCategory";

export interface OfficalPaperCategoryDocument extends OfficalPaperCategory, Document {
    _id: any;
}

interface IOfficalPaperCategoryModel extends Model<OfficalPaperCategoryDocument> { }

export const OfficalPaperCategorySchema = new Schema<OfficalPaperCategoryDocument, IOfficalPaperCategoryModel>(
    {
        name: String,
        type: Number,
        description: String,
        slug: String
    },
    { versionKey: false }
);

export const OfficalPaperCategoryModel = model(OfficalPaperCategoryTableName, OfficalPaperCategorySchema);
