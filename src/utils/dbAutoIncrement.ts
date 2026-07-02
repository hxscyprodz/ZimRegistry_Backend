import { Schema } from 'mongoose';
import Counter from '../models/counter.model';

interface AutoIncrementOptions {
  idField: string;      // The name of the field (e.g., 'userId' or 'staffId')
  sequenceId: string;   // The tracking name in the counter collection (e.g., 'staff_seq')
  prefix: string;       // The text prefix (e.g., 'SF', 'US')
  digits?: number;      // Optional: How many zeros to pad (defaults to 6)
}

export function applyAutoIncrement(schema: Schema, options: AutoIncrementOptions) {
  const { idField, sequenceId, prefix, digits = 6 } = options;

  schema.add({
    [idField]: {
      type: Number,
      get: (num: number) => {
        if (!num) return null;
        return `${prefix}-${num.toString().padStart(digits, '0')}`;
      }
    }
  });

  schema.pre('save', async function () {
    const doc = this as any;

    if (doc.isNew) {
      try {
        const counter = await Counter.findOneAndUpdate(
          { _id: sequenceId },
          { $inc: { seq: 1 } },
          { returnDocument: 'after', upsert: true }
        );

        doc[idField] = counter.seq;
      } catch (error: any) {
      }
    }
  });
}