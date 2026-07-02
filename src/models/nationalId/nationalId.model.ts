import { Schema, model } from "mongoose";
import { INationalIdDocument } from "../../types/types";

const NationalIdDocumentSchema = new Schema<INationalIdDocument>(
  {
    nationalIdNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    middleNames: { type: [String] },
    surname: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    issuedBy: { type: String, required: true },
    dateOfIssue: { type: Date, required: true },
    placeOfIssue: { type: String, required: true },
    imageUrl: { type: String, required: true },
    villageOfOrigin: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const NationalId = model<INationalIdDocument>(
  "NationalId",
  NationalIdDocumentSchema,
);
export default NationalId;
