const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require("passport");
// const users = require("./routes/api/users");
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
});
// require("./routes/user.routes")(app);
require("./routes/user.routes")(app);

app.use(passport.initialize());
// app.use('/frontapi', frontap)(app);
app.use('/static', express.static('public'));

const port =  5000;
var server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  var interval = 2000;
  var socketDataVar = setInterval(() => socketData(socket), interval);
  socket.on("disconnect", () => {
    clearInterval(socketDataVar);
  });
  socket.on("disconnectManual", () => {
    clearInterval(socketDataVar);
  });
});

const socketData = async (socket) => {
  if(socket.handshake.query.userId == "" || socket.handshake.query.userId == '' || socket.handshake.query.userId == undefined){
    var userId = 0
  }else{
   userId = socket.handshake.query.userId;
}


  var balanceApi = await exchangeCtrl.userBalanceByPair(
    socket.handshake.query.firstCoinId,
    socket.handshake.query.secondCoinId,
    userId
  );
  var activeOrderListApi = await exchangeCtrl.activeOrderList(
    socket.handshake.query.firstCoinId,
    socket.handshake.query.secondCoinId
  );
  var marketTradeApi = await exchangeCtrl.marketTradeApi(
    socket.handshake.query.firstCoinId,
    socket.handshake.query.secondCoinId
  );
  var myActiveOrderListApi = await exchangeCtrl.myActiveOrderList(
    socket.handshake.query.userId
  );
  var myCompletedOrderListApi = await exchangeCtrl.myCompletedOrderList(
    socket.handshake.query.userId
  );
  var coinListApi = await exchangeCtrl.coinList(
    socket.handshake.query.secondCoinId
  );
  var topBarApi = await exchangeCtrl.topBar(
    socket.handshake.query.firstCoinId,
    socket.handshake.query.secondCoinId
  );

  var pairPriceUpdateApi = await exchangeCtrl.updateCoinPriceSocket();
  var coinListHtml = await exchangeCtrl.coinPairListSocket(socket.handshake.query.userId);
  var socketDataApi = {
    balanceApi: balanceApi,
    activeOrderListApi: activeOrderListApi,
    marketTradeApi: marketTradeApi,
    myActiveOrderListApi: myActiveOrderListApi,
    myCompletedOrderListApi: myCompletedOrderListApi,
    coinListApi: coinListApi,
    topBarApi: topBarApi,
    coinListHtml:coinListHtml,
    socketId: socket.id,
  };

  socket.emit("socketDataApi", socketDataApi);
};


// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//   }
// }); 

// io.on("connection", function(socket){
//   var interval = 2000;
//   var socketDataVar =  setInterval(() => socketData(socket),interval);
//   socket.on("disconnect", () => {  clearInterval(socketDataVar); });
//   socket.on("disconnectManual", () => {
//     clearInterval(socketDataVar);
//   });
//  /* console.log("New client connected");
//   setInterval(() => userBalanceSocket(socket),10000);
//   setInterval(() => activeOrderListSocket(socket),5000);
//   setInterval(() => marketTradeApiSocket(socket),5000);
//   setInterval(() => myActiveOrderListSocket(socket),5000);
//   setInterval(() => myCompletedOrderListSocket(socket),5000);
//   setInterval(() => coinListSocket(socket),5000);
//   setInterval(() => topBarSocket(socket),5000);
//   socket.on("disconnect", () => console.log("Client disconnected"));*/
// });

// const socketData = async socket => {
//   var userId  = socket.handshake.query.userId;
  
//   var balanceApi = await exchangeCtrl.userBalanceByPair(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId,userId);
//   var activeOrderListApi = await exchangeCtrl.activeOrderList(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
//   var marketTradeApi = await exchangeCtrl.marketTradeApi(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
//   var myActiveOrderListApi = await exchangeCtrl.myActiveOrderList(socket.handshake.query.userId);
//   var myCompletedOrderListApi = await exchangeCtrl.myCompletedOrderList(socket.handshake.query.userId);
//   var coinListApi = await exchangeCtrl.coinList(socket.handshake.query.secondCoinId);
//   var topBarApi = await exchangeCtrl.topBar(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
//   var graphDataApi = await exchangeCtrl.graphData(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
  
//   var socketDataApi = {"balanceApi":balanceApi,
//              "activeOrderListApi":activeOrderListApi,
//              "marketTradeApi":marketTradeApi,
//              "myActiveOrderListApi":myActiveOrderListApi,
//              "myCompletedOrderListApi":myCompletedOrderListApi,
//              "coinListApi":coinListApi,
//              "topBarApi":topBarApi,
//              "graphDataApi":graphDataApi,
//              "socketId":socket.id
//             };
  
//   socket.emit("socketDataApi", socketDataApi);
// }

// var minutes = 1, the_interval = minutes * 60 * 1000;
// setInterval(async function() {
  
//     // await axios.get("https://api.princeex.com/frontapi/depositbtctransaction").then(function(respadd){
//     // })

//     // await axios.get("https://api.princeex.com/frontapi/depositltctransaction").then(function(respadd){
//     // })

//     // await axios.get("https://api.princeex.com/frontapi/depositbchtransaction").then(function(respadd){
//     // })

//     // await axios.get("https://api.princeex.com/frontapi/depositdogetransaction").then(function(respadd){
//     // })
// }, the_interval);
 

/*
const userBalanceSocket = async socket => {
  var userId  = socket.handshake.query.userId;
  
  var getData = await exchangeCtrl.userBalanceByPair(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId,userId);
  socket.emit("balanceApi", getData);
}

const activeOrderListSocket = async socket => {
  var getData = await exchangeCtrl.activeOrderList(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
  socket.emit("activeOrderListApi", getData);
}

const marketTradeApiSocket = async socket => {
  var getData = await exchangeCtrl.marketTradeApi(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
  socket.emit("marketTradeApi", getData);
}

const myActiveOrderListSocket = async socket => {
  var getData = await exchangeCtrl.myActiveOrderList(socket.handshake.query.userId);
  socket.emit("myActiveOrderListApi", getData);
}

const myCompletedOrderListSocket = async socket => {
  var getData = await exchangeCtrl.myCompletedOrderList(socket.handshake.query.userId);
  socket.emit("myCompletedOrderListApi", getData);
}

const coinListSocket = async socket => {
  var getData = await exchangeCtrl.coinList();
  socket.emit("coinListApi", getData);
}
const topBarSocket = async socket => {
  var getData = await exchangeCtrl.topBar(socket.handshake.query.firstCoinId,socket.handshake.query.secondCoinId);
  socket.emit("topBarApi", getData);
}*/