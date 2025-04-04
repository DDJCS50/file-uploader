require("dotenv").config();
// TODO CREATE CONSOLE READ FUNCTIONALITY
const query = async (text, params) => {
  const start = Date.now();
  // const res = await ;
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

module.exports = {
  query,
};
