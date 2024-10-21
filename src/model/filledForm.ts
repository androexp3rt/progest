import { FormState } from "@/components/fillForm/fillForm";
import { FormItemDetails } from "@/types/types";
import mongoose, { Schema, Document } from "mongoose";

export interface FilledForm extends Document {
  title: string;
  formItemDetails: FormItemDetails[];
  formState: FormState;
  createdAt: Date;
  companyName: string;
}

export const FilledFormSchema: Schema<FilledForm> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  formItemDetails: {
    type: [],
    required: true,
  },
  formState: {
    type: {},
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  companyName: {
    type: String,
    required: true,
  },
});

const FilledFormModel =
  (mongoose.models.FilledForms as mongoose.Model<FilledForm>) ||
  mongoose.model<FilledForm>("FilledForms", FilledFormSchema);

export default FilledFormModel;
