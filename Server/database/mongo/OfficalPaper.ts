import { Schema, model, Model, Document } from "mongoose";
import OfficalPaper from "../../models/OfficalPaper";

export const OfficalPaperTableName = "OfficalPaper";

export interface OfficalPaperDocument extends OfficalPaper, Document {
    _id: any;
}

interface IOfficalPaperModel extends Model<OfficalPaperDocument> { }

export const OfficalPaperSchema = new Schema<OfficalPaperDocument, IOfficalPaperModel>(
    {
        name: String,
        type: Number,
        description: String,
        parentId: String,
        content: String,
        slug: String
    },
    { versionKey: false }
);

export const OfficalPaperModel = model(OfficalPaperTableName, OfficalPaperSchema);
