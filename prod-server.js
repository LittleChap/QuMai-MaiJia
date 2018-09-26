
var express = require('express')

var port = 10010;

var app = express();

var router = express.Router();

// var history = require('connect-history-api-fallback');

router.get('/',function (req,res,next) {
  req.url = './index.html';
  next();
});

app.use(router);

app.use(express.static('./dist'));

// app.use(history());

module.exports = app.listen(port, function (err) {
  if(err) {
    console.log(err);
    return;
  }
  console.log('listening at http://localhost:' + port + '\n');
})
