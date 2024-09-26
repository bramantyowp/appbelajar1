'use strict';
var response = require('./res');
var connetion = require('./koneksi');

exports.index = function(req,res) {
    response.ok( "Aplikasi rest api jalan lhoo..", res);

} ;
exports.tampilandatasiswa = function(req, res){
    connetion.query('SELECT * FROM mahasiswa', function (error,rows,fields){
        if (error){
            console.log(error);

        }else {
            response.ok (rows,res)
        }
    });
};
exports.tampilanid = function(req, res){
    let id = req.params.id;
    connetion.query('SELECT * FROM mahasiswa WHERE id_mahasiswa =?', [id],
        function (error,rows,fields){
        if (error){
            console.log(error);

        }else {
            response.ok (rows,res)
        }
    });}