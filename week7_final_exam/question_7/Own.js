use photoapp;

db.albums.ensureIndex({'images' : 1});

var cursor = db.images.find({});
var amountRemovedImages = 0;

while(cursor.hasNext()){
	currentDocument = cursor.next();

	if(db.albums.find({'images' : currentDocument._id}).count() == 0){
		db.images.remove({'_id' : currentDocument._id})

		amountRemovedImages++;
	}
}