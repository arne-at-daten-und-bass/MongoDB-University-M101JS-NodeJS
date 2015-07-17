var MongoClient = require('mongodb').MongoClient;
var util = require('util');

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {

    if(err) throw err;

    var data = db.collection('data');
    var sort = {'sort' : [['State',1], ['Temperature',-1]] };
    var cursor = data.find({}, {}, sort);

    var operator = { '$set' : { 'month_high' : true } };
    var options = { 'new' : true };
    var newState = 'Begin';
    var myId;

    cursor.each(function(err, doc) {
        
        if(err) { throw err; }

        if(newState != doc.State){
            console.log("newState: " + newState);
            newState = doc.State;
            db.collection('data').findAndModify({_id:doc._id}, [], operator, options, function(err, doc) {

                if(err) { throw err; }

                console.log("Util in CB: " + util.inspect(doc));
                
            });
            //Console keeps writing the old document "Month High: undefined", althoug it has been correctly inserted
            console.log("State: " + doc.State + " Temperature: " + doc.Temperature + " Month High: " + doc.month_high);
            console.log("Util after CB: " + util.inspect(doc));
        }
        //console.log("State: " + doc.State + " Temperature: " + doc.Temperature + " Month High: " + doc.month_high);

        if(!doc) {

            //Keeps throwing an (non-blocking) error at the end ... didn't get it (away) ;->
            console.log("No more documents found.");
            return db.close();
        }
    });
    
        
});
