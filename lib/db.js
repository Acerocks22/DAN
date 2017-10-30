//import pg from 'pg';
var pg = require('pg');
var Pool = require('pg-pool');
//const conString = "postgres://vbgqlfpjfnnnkf:df3903e05d4711ce45db00b3fccde25e1e74c6805e97a92cc05c1a3f9d703444@ec2-54-243-197-180.compute-1.amazonaws.com:5432/d88the3bl2c30r";

var pool = new Pool({
    user: "bsjrwnolzcfanb",
    password: "3c5b974c334f538cc9dda4c6e56bc55ffaf226de6c6b57bc58a6287823766024",
    database: "d3lp0cr6bvd2f3",
    port: 5432,
    host: "ec2-184-73-159-137.compute-1.amazonaws.com",
    ssl: true,
    idleTimeoutMillis: 30000,
});

//var pool = new Pool(config);

module.exports = function(q, callback) {
    pool.connect(function(error, client, done) {
        if (error) {
            callback(error, null);
        }
        client.query(q, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                callback(err, null)
            }

            callback(null, result)
        });
    });


}
pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack)
});
