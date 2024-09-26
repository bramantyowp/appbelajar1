'use strich';
module.exports = function(app) {
    var jsonku = require ('./controller');
    app.route('/')
      .get(jsonku.index);
      app.route('/tampil')
      .get(jsonku.tampilandatasiswa);
      app.route('/tampil/:id')
      .get(jsonku.tampilanid);
      app.route('/tambah')
      .post(jsonku.tambahMAhasiswa);
      app.route('/ubah')
      .put(jsonku.editMahasiswa);
}
