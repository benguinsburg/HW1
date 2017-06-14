var express = require('express');
var router = express.Router();

/* GET the parameter, and return JSON */
router.get('/:param', function(req,res,next){
    let param = req.params.param

    console.log("req.query: ", param)

    let output = {
        string: param,
        length: param.length
    }

    res.json(output)
})

/* POST */
router.post('/', function (req, res, next) {
    let param = req.body.param
    let output = {
        string: param,
        length: param.length
    }

    res.json(output)
})

module.exports = router;
