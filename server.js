const cosmosdb = require('./cosmosdb')
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();



router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/kyle.html'));
}); 

router.get('/latest', function(req,res){
  
  connection.then(async () => {
    let query = {
        query: "SELECT TOP 1 * FROM root AS r ORDER BY r._ts DESC",
        // query: "SELECT * FROM root",
        parameters: [
            {
                name: "@mapname",
                value: "Morpheus"
            }
        ]
    };
    let results = await cosmosdb.queryItems(query);
    data = {};
    data.results = results;
    res.json(data);
  })
  .catch(err => {
      console.log(err)
      res.sendStatus(err.code);
  })
})


router.get('/test', function(req,res){
  
  connection.then(async () => {
    let query = {
        query: "SELECT TOP 1 * FROM root AS r ORDER BY r._ts DESC",
        // query: "SELECT * FROM root",
        parameters: [
            {
                name: "@mapname",
                value: "Morpheus"
            }
        ]
    };
    let results = await cosmosdb.queryItems(query);
    data = {};
    data.results = results;
    res.json(data);
  })
  .catch(err => {
      console.log(err)
      res.sendStatus(err.code);
})
  

 
    //   const query = {
    //     query: "SELECT r.match.map FROM root AS r WHERE r.match.map.name=@mapname",
    //     parameters: [
    //         {
    //             name: "@mapname",
    //             value: "Morpheus"
    //         }
    //     ]
    // };
    // const results = await queryItems(query);
    // data = {};
    // data.results = results;
    // res.json(data);


  // utstats.queryCosmo(null, (err, data) => {
  //   if (err) {
  //     console.log("Error: ", err);
  //     res.sendStatus(err.code);
  //   } else {
  //     console.log("From the callback, ", data);
  //     res.json(data);
  //   }

    // console.log(object);
  // });
  // console.log(object);
});

router.get('/log',function(req,res){
  res.sendFile(path.join(__dirname+'/log.json'));
});

router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});







const connection = cosmosdb.init();
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');