'use strict';
var response = require('./res');
var connetion = require('./koneksi');

exports.index = function(req,res) {
    response.ok( "Aplikasi rest api jalan lhoo..", res);

} ;
exports.tampilandatasiswa = function(req, res){
    connetion.query('SELECT * FROM mahasiswa', function (error,rows,fields){
        if (error){
            connetion.log(error);

        }else {
            response.ok (rows,res)
        }
    });
};