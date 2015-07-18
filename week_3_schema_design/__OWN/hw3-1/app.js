var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
	
	if(err) { throw err; }
	var query = {};

	db.collection('students').find(query).toArray(function(err, docs){
		
		if (err) { throw err; }
		var min, student, value;

		for (var i = 0 ; i < docs.length; i++) {
			
			student = docs[i];
			min = -1;

			for (var j = 0; j < student.scores.length; j++) {
				value = student.scores[j];
				if(value.type === "homework"){
					if(min === -1 || value.score < student.scores[min].score){
						min = j;
					}
				}
			};

			console.log("Ant length: " + student.scores.length + " min: " + min);

			student.scores.splice(min, 1)

			console.log("Pos length: " + student.scores.length);

			db.collection('students').save(student, function(err, saved){
				
				if (err) { throw err; }
				console.log("Student saved: " + saved);
			});
		};
		console.dir("End");
		return db.close();
	});
});