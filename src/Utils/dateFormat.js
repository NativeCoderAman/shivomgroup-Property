const reverseDateFormat = dateString => {
  const [year, month, day] = dateString.split('-'); // Split the date into parts
  return `${day}-${month}-${year}`; // Rearrange in DD-MM-YYYY format
};

const convertDateToMonthYear = dateString => {
  const date = new Date(dateString);
  // Array of month names to map month number to month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Get the month and year
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export { convertDateToMonthYear };

export default reverseDateFormat;