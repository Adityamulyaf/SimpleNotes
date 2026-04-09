<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notes = Note::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        $note = Note::create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($note, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $note = $this->findUserNote($request, $id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        $note->update([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
        ]);

        return response()->json($note->fresh());
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $note = $this->findUserNote($request, $id);

        $note->delete();

        return response()->json(['message' => 'deleted']);
    }

    private function findUserNote(Request $request, int|string $id): Note
    {
        return Note::where('user_id', $request->user()->id)
            ->findOrFail($id);
    }
}
