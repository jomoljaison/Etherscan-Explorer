const express = require("express");
const res = require("express/lib/response");
const Web3 = require("web3"); 

var http = require('http');
const socketIO = require("socket.io");

const app = express();
var server = http.Server(app);
var io     = socketIO(server);

var url =
  "wss://mainnet.infura.io/ws/v3/bf72c5f55df247648fcee4002c046b6d";
const web3 = new Web3(new Web3.providers.WebsocketProvider(url));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let txnHash = "";
let block = "";
let address = "";






web3.eth.getAccounts().then(accounts => {

  display_account(accounts)
})


function display_account(accounts){


  web3.eth.subscribe('newBlockHeaders', (err, ret) => {

      if (err){ 

          console.log("error: ", err)

      } else {

       
          var blocknum=ret.number;
          io.emit('message-1', blocknum)            
        console.log("New Block is ",blocknum);
      }

  })



}





app.get("/", async (req, res) => {
  const latestBlockData = await web3.eth.getBlock("latest");
  block = latestBlockData;
  const gasFees = await web3.eth.getGasPrice();
  const latestBlocks = [];
  const difficulty = latestBlockData.difficulty;
  const latestBlockNumber = latestBlockData.number;



  for (let i = 0; i < 10; i++) {
    block = await web3.eth.getBlock(latestBlockData.number - i);
    latestBlocks.push(block);
  }
  res.render("index", {
    latestBlockNumber: latestBlockNumber,
    gasFees: gasFees,
    // getHashrate:getHashrate,
    difficulty: difficulty,
    latestBlocks: latestBlocks,
  });
});

app.post("/", async (req, res) => {
  const hash = req.body.txnHash;
  address = hash;
  if (isNaN(hash[1])) {
    if (web3.utils.isAddress(hash)) {
      const balance = await web3.eth.getBalance(hash);
      let balanceInEther = await web3.utils.fromWei(balance, "ether");
      txnHash = balanceInEther;
      res.redirect("/addressdetails");
    } else {
      txnHash = await web3.eth.getTransaction(hash);
      res.redirect("/hash");
    }
  } else {
    txnHash = await web3.eth.getBlock(hash);
    res.redirect("/blockdetails");
  }
});

app.get("/hash", async (req, res) => {
  res.render("hash", {
    txnHash: txnHash,
  });
});

app.post("/hash", async (req, res) => {
  const txn = await web3.eth.getTransaction(req.body.txnHash);
  txnHash = txn;
  if (isNaN(hash[1])) {
    if (web3.utils.isAddress(hash)) {
      const balance = await web3.eth.getBalance(hash);
      let balanceInEther = await web3.utils.fromWei(balance, "ether");
      txnHash = balanceInEther;
      res.redirect("/addressdetails");
    } else {
      txnHash = await web3.eth.getTransaction(hash);
      res.redirect("/hash");
    }
  } else {
    txnHash = await web3.eth.getBlock(hash);
    res.redirect("/blockdetails");
  }
});

app.get("/blockdetails", async (req, res) => {
  res.render("blockdetails", {
    txnHash: txnHash,
  });
});

app.post("/blockdetails", async (req, res) => {
  const txn = await web3.eth.getTransaction(req.body.txnHash);
  txnHash = txn;
  if (isNaN(hash[1])) {
    if (web3.utils.isAddress(hash)) {
      const balance = await web3.eth.getBalance(hash);
      let balanceInEther = await web3.utils.fromWei(balance, "ether");
      txnHash = balanceInEther;
      res.redirect("/addressdetails");
    } else {
      txnHash = await web3.eth.getTransaction(hash);
      res.redirect("/hash");
     
    }
  } else {
    txnHash = await web3.eth.getBlock(hash);
    res.redirect("/blockdetails");
  }
});

app.get("/addressdetails", async (req, res) => {
  res.render("addressdetails", {
    txnHash: txnHash,
    address: address,
  });
});

app.post("/addressdetails", async (req, res) => {
  const txn = await web3.eth.getTransaction(req.body.txnHash);
  txnHash = txn;
  if (isNaN(hash[1])) {
    if (web3.utils.isAddress(hash)) {
      const balance = await web3.eth.getBalance(hash);
      let balanceInEther = await web3.utils.fromWei(balance, "ether");
      txnHash = balanceInEther;
      res.redirect("/addressdetails");
    } else {
      txnHash = await web3.eth.getTransaction(hash);
      res.redirect("/hash");
    }
  } else {
    txnHash = await web3.eth.getBlock(hash);
    res.redirect("/blockdetails");
  }
});

// use this instead of app.listen
server.listen(3000, () => {

  console.log('listening on 3000')

});
