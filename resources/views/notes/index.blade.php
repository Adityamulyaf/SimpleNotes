<h1>Daftar Catatan</h1>

<a href="/notes/create">Tambah Catatan</a>

@foreach($notes as $note)
    <div>
        <h3>{{ $note->title }}</h3>
        <p>{{ $note->content }}</p>

        <a href="/notes/{{ $note->id }}/edit">Edit</a>

        <form action="/notes/{{ $note->id }}" method="POST" style="display:inline;">
            @csrf
            @method('DELETE')
            <button type="submit">Delete</button>
        </form>
    </div>
@endforeach