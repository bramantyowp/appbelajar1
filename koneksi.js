var mysql = require('mysql');
const conn = mysql.createConnection ({
 host : 'localhost',
 user : 'root',
 password : '',
 database : 'drrestapi'
});
conn.connect((err)=>{
    if (err) throw err;
    console.log('mysql terkoneksi')

}
);
module.exports = conn;
