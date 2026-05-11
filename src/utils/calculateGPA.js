export const calculateGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  
  let totalCredits = 0;
  let totalPoints = 0;
  
  subjects.forEach(sub => {
    totalCredits += Number(sub.credits);
    totalPoints += Number(sub.grade) * Number(sub.credits);
  });
  
  if (totalCredits === 0) return 0;
  return (totalPoints / totalCredits).toFixed(2); // Округлюємо до 2 знаків
};