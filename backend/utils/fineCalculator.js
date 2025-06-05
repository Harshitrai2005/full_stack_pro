export const calculateFine = (dueDate) => {
  const finePerHour = 0.10;
  const today = new Date();
  if (today > dueDate) {
    const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));
    const fine = lateHours * finePerHour;
    return Number(fine.toFixed(2));
  }
  return 0;
};
