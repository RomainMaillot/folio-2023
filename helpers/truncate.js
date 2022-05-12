// Truncates a string and adds an ellipsis after a specific number of characters
const truncate = (str, n) => {
  return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
};

export default truncate;
