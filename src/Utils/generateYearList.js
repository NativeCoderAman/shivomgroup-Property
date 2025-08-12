export const generateYearList = (startYear = 2023) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startYear + 1 }, (_, index) => ({
      key: (startYear + index).toString(),
      value: startYear + index,
    }));
  };