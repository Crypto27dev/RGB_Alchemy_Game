const { gameInfo } = require('./utils');
const express = require("express");

const app = express();
const port = 9876;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/init", (_, res) => {
  return res.json(gameInfo());
});

app.get("/init/user/:id", (req, res) => {
  return res.json(gameInfo(req.params.id));
});

app.listen(port, () => {
  console.log(`Start rgb_alchemy_game on ${port}`);
});
