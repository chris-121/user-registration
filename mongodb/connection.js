const MongoClient = require('mongodb').MongoClient;
module.exports.connect = ()=>{

const state={
  db:null
}

var url = "mongodb://localhost:27017/mydb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  else
  console.log("Database created!");
  state.db=db.db('mydb')
  //db.close();
});
module.exports.get=()=>{
  return state.db;
}
}
