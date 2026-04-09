<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{

    public function index()
    {
        $notes = Note::where('user_id', 1)->get();

        return response()->json($notes);
    }

    public function create()
    {
        return view('notes.create');
    }

    public function store(Request $request)
    {
    $note = Note::create([
        'title' => $request->title,
        'content' => $request->content,
        'user_id' => 1
    ]);

    return response()->json($note);
    }

    public function edit($id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== 1) {
            abort(403);
        }

        return view('notes.edit', compact('note'));
    }

    public function update(Request $request, $id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== 1) {
            abort(403);
        }

        $note->update([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return response()->json(['message' => 'updated']);
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id !== 1) {
            abort(403);
        }

        $note->delete();

        return response()->json(['message' => 'deleted']);
    }
}
