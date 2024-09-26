'use strict';
var response = require('./res');
var connection = require('./koneksi');

exports.index = function(req,res) {
    response.ok( "Aplikasi rest api jalan lhoo..", res);

} ;
exports.tampilandatasiswa = function(req, res){
    connection.query('SELECT * FROM mahasiswa', function (error,rows,fields){
        if (error){
            console.log(error);

        }else {
            response.ok (rows,res)
        }
    });
};
exports.tampilanid = function(req, res){
    let id = req.params.id;
    connection.query('SELECT * FROM mahasiswa WHERE id_mahasiswa =?', [id],
        function (error,rows,fields){
        if (error){
            console.log(error);

        }else {
            response.ok (rows,res)
        }
    });}
    exports.tambahMAhasiswa = function (req,res){
        var nim = req.body.nim ;
        var nama = req.body.nama;
        var angkatan = req.body.angkatan;
        connection.query('INSERT INTO mahasiswa (nim,nama,angkatan)VALUES (?,?,?)',
    [nim,nama,angkatan],
    function (error,rows,fields){
        if (error){
            console.log(error);

        }else {
            response.ok ("berhasil menampilkan data", res)
        }
        
    });
}