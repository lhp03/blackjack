const express = require("express");
const app = express();
const fs = require("fs");

//create data file
if (!fs.existsSync("src/public/result_data.txt")) {
  fs.writeFileSync("src/public/result_data.txt", "");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/result", (req, res) => {
  console.log(req.body);

  let user_hand = "";
  JSON.parse(req.body.user).map((elem) => {
    user_hand += elem.suit + elem.rank + " ";
  });
  const user_total = req.body.user_total;
  let computer_hand = "";
  JSON.parse(req.body.computer).map((elem) => {
    computer_hand += elem.suit + elem.rank + " ";
  });
  const computer_total = req.body.computer_total;
  const result = req.body.result;

  fs.appendFileSync(
    "src/public/result_data.txt",
    `user hand: ${user_hand} user total: ${user_total} computer hand: ${computer_hand} computer total: ${computer_total} ${result}\n`
  );

  res.status(204);
  res.send();
});

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});
