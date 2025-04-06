const query = async (selectedModelQuery) => {
  const start = Date.now();
  const res = await selectedModelQuery();
  const duration = Date.now() - start;
  console.log("executed query", { res, duration });
  return res;
};

module.exports = {
  query,
};
