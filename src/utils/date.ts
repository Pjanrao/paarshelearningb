export const getOrdinal = (d: number) => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const formatWorkshopDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  
  // Try parsing the date. type="date" input gives YYYY-MM-DD
  const date = new Date(dateString);
  
  // Check if it's a valid date object
  if (isNaN(date.getTime())) {
      return dateString; // Return as is if it's already a formatted string like "May 30"
  }
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return `${day}${getOrdinal(day)} ${month} ${year}`;
};

export const getWorkshopDateParts = (dateString: string | undefined) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    const day = date.getDate();
    const ordinal = getOrdinal(day);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    return { day, ordinal, month, year };
};
