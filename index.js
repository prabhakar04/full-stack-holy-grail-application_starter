var express = require("express");
var app = express();

//TODO: create a redis client
const redis = require('redis');
const client = redis.createClient(); 
// By default, it will use 127.0.0.1 and 6379 as the hostname and port respectively.

// serve static files from public directory
app.use(express.static("public"));

// TODO: initialize values for: header, left, right, article and footer using the redis client
var kv = [
  "header", 0, 
  "left", 0, 
  "article", 0, 
  "right", 0, 
  "footer", 0
];

client.mset(kv, function(err) {
  if (err) throw err;
  // end the connection gracefully if
  // you don't need to access redis anymore
  client.quit();
});

// Get values for holy grail layout
function data() {
  return new Promise((resv, rej) => {
    client.mGet(key, (err, reply) => err ? rej() : resv(reply));
  })
  // TODO: uses Promise to get the values for header, left, right, article and footer from Redis
}

// plus
app.get("/update/:key/:value", function (req, res) {
  const key = req.params.key;
  let value = Number(req.params.value);
  client.set(key,JSON.stringify(value));
  //TODO: use the redis client to update the value associated with the given key
});

// get key data
app.get("/data", function (req, res) {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log("Running on 3000");
});

process.on("exit", function () {
  client.quit();
});
