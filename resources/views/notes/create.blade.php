<h1>Tambah Catatan</h1>

<form method="POST" action="/notes">
    @csrf
    <input type="text" name="title" placeholder="Judul"><br><br>
    <textarea name="content" placeholder="Isi catatan"></textarea><br><br>
    <button type="submit">Simpan</button>
</form>