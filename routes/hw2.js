var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/HW2db')
const db = mongoose.connection
db.once('open', function () {
  console.log('Connection successful.')
})
const Schema = mongoose.Schema

const stringSchema = new Schema({
    item: String,
    length: Number
})

const strings = mongoose.model('string', stringSchema)

//////////////////////////////////////////////////////////////////

/* GET all strings in db if no params on URI */
router.get('/find', function(req, res, next) {
    strings.find({}, function(err, results){
        res.json(results);
    })
})

/* GET the parameter, check cache, else create->cache->return */
router.get('/find/:param', function(req,res,next){
    let param = req.params.param
    console.log("req.query: ", param)

    strings.find({'item' : param}, function (err, results) {
            console.log(results)
    })
    .then( function(results){
        if (results.length === 0){   //if string NOT in db
            let aString = new strings( {item: param, length: param.length} )
            aString.save(function(err){
                if (err) {res.send(err)}
                else {res.send (aString)}
            })
            //res.send({item: param, length: param.length})
        }
        else {  //if string in db
            res.json(results)
        }
    })

})

/*  POST, passed a string, check db for string, if not there then create->cache->return */
router.post('/', function (req, res, next) {
    let param = req.body.param

    if (param == undefined){
        res.json({message: 'a string must be provided'})
    }

    strings.find({'item' : param}, function (err, results) {
        console.log(results)
    })
        .then( function(results){
            if (results.length === 0){   //if string NOT in db
                let aString = new strings( {item: param, length: param.length} )
                aString.save(function(err){
                    if (err) {res.send(err)}
                    else {res.send (aString)}
                })
                //res.send({item: param, length: param.length})
            }
            else {  //if string in db
                res.json(results)
            }
        })
})

/* DELETE the string */
router.delete('/delete/:param', function (req, res, next) {
    strings.find().remove({item: req.params.param}).exec(function (err)  {
        if(err) {res.json({message: 'string not found'});}
        else {res.json({message: 'success'});}
    })

    /*
    strings.findByNameAndRemove({item : req.params.param}, function (err, result) {
    if(err) {res.json({message: 'string not found'});}
    else {res.json({message: 'success'});}
  })
  */
});

module.exports = router;
