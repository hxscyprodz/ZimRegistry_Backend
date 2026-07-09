export const formatStaffId = (sequenceNumber: string) => {
  return `ST-${String(sequenceNumber).padStart(7, "0")}`;
};
