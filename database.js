var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    }else{
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar, 
            email varchar UNIQUE, 
            phone varchar,
            password varchar, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)';
                db.run(insert, ["admin","admin@example.com","4793849937",md5("admin123456")]);
                db.run(insert, ["user","user@example.com","98120043",md5("user123456")]);
            }
        });  
    }
});

module.exports = db;