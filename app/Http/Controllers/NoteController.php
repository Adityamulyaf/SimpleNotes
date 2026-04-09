<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index()
    {
        $notes = Note::where('user_id', auth()->id())->get();

        return view('notes.index', compact('notes'));
    }

    public function create()
    {
        return view('notes.create');
    }

    public function store(Request $request)
    {
        Note::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id()
        ]);

        return redirect('/notes');
    }

    public function edit($id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        return view('notes.edit', compact('note'));
    }

    public function update(Request $request, $id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->update([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return redirect('/notes');
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->delete();

        return redirect('/notes');
    }
}
