Database = {
	init : function(){
		// creates the database
		try {
			if (window.openDatabase) {
				db = openDatabase("tasks", "1.0", "Offline tasks storage", 200000);
				if (db) {
					db.transaction(function(tx) {
						tx.executeSql("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, duration INTEGER, project TEXT, desc TEXT)", [], function (tx, result) { 
							console.log("ok!!");
						}, function (t, e) {
							// couldn't read database
							console.log(e.message);
						});
					});
				} else {
					console.log('error occurred trying to open DB');
				}
			} else {
				console.log('Web Databases not supported');
			}
		} catch (e) {
			console.log('error occurred during DB init, Web Database supported?');
		}
	},
	load : function(callback){
		// read tasks from database
		db.readTransaction(function (t) {
			t.executeSql('SELECT * FROM task', [], function (t, r) {
				for (var i=0; i<r.rows.length; i++){
					callback(r.rows.item(i));
				}
			}, function (t, e) {
				// couldn't read database
				console.log(e.message);
			});
		});
	},
	store : function(task){
		db.transaction(function (tx) {
			tx.executeSql('INSERT INTO task (start,duration,project,desc) VALUES (?,?,?,?)', [task.getStartDate(), task.getDuration(), task.project, task.desc], function (tx, result) {
				task.id = result.insertId;
			});
		});
	},
	update : function(task){
		db.transaction(function(tx) {
			tx.executeSql("UPDATE task SET start=?, duration=?, project=?, desc=? WHERE id=?", [task.getStartDate(), task.getDuration(), task.project, task.desc, task.id], function (tx, result) { 
			});
		});
	},
	erase : function(){
		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM task", [], function (tx, result) { 
				console.log("all data erased !");
			});
		});
	}
}
