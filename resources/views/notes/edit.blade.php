<h1>Edit Catatan</h1>

<form method="POST" action="/notes/{{ $note->id }}">
    @csrf
    @method('PUT')

    <input type="text" name="title" value="{{ $note->title }}"><br><br>
    <textarea name="content">{{ $note->content }}</textarea><br><br>

    <button type="submit">Update</button>
</form>