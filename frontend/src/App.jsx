import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios.get("http://127.0.0.1:8000/api/notes")
      .then(res => setNotes(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://127.0.0.1:8000/api/notes/${editingId}`, { title, content })
        .then(() => { setTitle(""); setContent(""); setEditingId(null); fetchNotes(); });
    } else {
      axios.post("http://127.0.0.1:8000/api/notes", { title, content })
        .then(() => { setTitle(""); setContent(""); fetchNotes(); });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin hapus note ini?")) return;
    axios.delete(`http://127.0.0.1:8000/api/notes/${id}`).then(fetchNotes);
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="notes-app">
      <div className="notes-header">
        <h1><span className="dot" /> Notes</h1>
        <p>{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-label">{editingId ? "Edit note" : "New note"}</div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          rows={3}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="btn-actions">
          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Add note"}
          </button>
          {editingId && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="section-label">All notes</div>

      {notes.length === 0 ? (
        <div className="empty">No notes yet. Create one above.</div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-title">{note.title}</div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <button className="btn-edit" onClick={() => handleEdit(note)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;