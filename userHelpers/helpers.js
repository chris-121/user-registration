const db = require("../mongodb/connection");
const bcrypt=require('bcrypt');
const { reject } = require("bcrypt/promises");
const async = require("hbs/lib/async");

module.exports={
signup : (userdata)=>{
    return new Promise(async (resolve,reject)=>{
        let user=await db.get().collection('users').findOne({email:userdata.email})
        if(user){
            resolve()
        }
        else{
        console.log(userdata);
        userdata.password=await bcrypt.hash(userdata.password,10);
        db.get().collection('users').insertOne(userdata)
            console.log(userdata);
            resolve(userdata._id);
        }
    })
        
},
login : (userdata)=>{
    return new Promise(async (resolve,reject)=>{
        let user=await db.get().collection('users').findOne({email:userdata.email})
        if(user){
            bcrypt.compare(userdata.password, user.password, function(err, result) {
                // result == true
                resolve(result);
            });
        }else
        resolve(false);

    })
},
sqa:(userdata)=>{
    return new Promise(async(resolve,reject)=>{
        let user=await db.get().collection('users').findOne({email:userdata.email})
        if(user)
        resolve(user);
    })
},
sq:(userdata)=>{
    return new Promise(async(resolve,reject)=>{
        let user=await db.get().collection('users').findOne({email:userdata.email})
        console.log(user);
        if(user){
            if(user.SQA==userdata.sqa){
            resolve(user);
            }
            else
            resolve(false)
        }
                
    })
},
setPass :(userdata)=>{
    return new Promise(async(resolve,reject)=>{
        userdata.password=await bcrypt.hash(userdata.password,10);
        db.get().collection('users').updateOne({email:userdata.email},
            { $set: { password : userdata.password } })
           resolve()   
          }
    )}
}