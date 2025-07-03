const query = async (selectedModelQuery, parameter) => {
  if (parameter == undefined || parameter == null) {
    parameter = "";
  }
  const start = Date.now();
  const res = await selectedModelQuery(parameter);
  const duration = Date.now() - start;
  // console.log("executed query", { parameter, res, duration });
  return res;
};

module.exports = {
  query,
};
