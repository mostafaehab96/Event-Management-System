const validateDate = (date: string) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  const now = new Date();

  if (parsedDate <= now) {
    return null;
  }
  return parsedDate;
};

export default validateDate;
