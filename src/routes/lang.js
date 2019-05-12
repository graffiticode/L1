module.exports = function (compiler) {
  return function handleLang(req, res) {
    const langID = compiler.langID || '0';
    res.send(`Hello, L${langID}!`);
  };
};
