module.exports = (compiler) => {
  return (req, res) => {
    const langID = compiler.langID || '0';
    if (req.params.path) {
      res.sendFile(__dirname + "/../pub/" + req.params.path);
    } else {
      res.send(`Hello, L${langID}!`);
    }
  };
};
