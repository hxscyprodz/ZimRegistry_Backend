import { TBirthApplication } from "../types";
import crypto from "node:crypto";

export const generateTrackId = (applicationType: TBirthApplication) => {
  const year = new Date().getFullYear();
  const min = 10000000;
  const max = 99999999;
  const random = crypto.randomInt(min, max + 1);
  return `${applicationType}-${year}${random}`;
};
