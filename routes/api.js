var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var myMongo = require("../db");

router.get("/", (req, res, next) => {
    myMongo.getDb( (err, myMongo) => {
        if (err) {
            console.log("Database Connection Failed" + err);
        } else {
            myMongo.zenith_e.find( {isActive: "Yes"}).sort({EventDate: 1}, (err,data) => {
                if (err) {
                    res.send(err);
                }
                
                for(let i = 0; i < data.length; i++) {
                    if (i > 0) {
                        if ( data[i-1].EventDate.getDate() == data[i].EventDate.getDate() ) {
                            data[i].etc = "";
                        }else {
                            data[i].etc = "Y";
                        }
                    }else {
                        data[i].etc = "Y";
                    }
                }
                // convert time to local time
                for(let i = 0; i < data.length; i++) {
                    data[i].EventDate = new Date( (data[i].EventDate.getTime()) + (420 * 60000) );
                }
                res.json(data);
            });
        }
    });
});
module.exports = router;