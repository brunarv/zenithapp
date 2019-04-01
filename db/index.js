(function(database) {
    var mongojs = require("mongojs");
    const MONGO_URL = "mongodb://brunarv:comp3913A00985171@ds033186.mlab.com:33186/zenith";

    var theDb = null;

    database.getDb = function(next) {
        if (!theDb) {
            var collections = ['zenith_a', 'zenith_e']
            var theDb = mongojs(MONGO_URL, collections);
            next(null, theDb);
        } else {
             next(null, theDb);
        }
    }
})(module.exports);