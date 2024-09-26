'use strict';
var response = require('./res');
var connetion = require('./koneksi');

exports.index = function(req,res) {
    response.ok( "Aplikasi rest api jalan lhoo..", res);

}