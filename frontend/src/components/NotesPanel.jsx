function NotesPanel({
  user,
  notes,
  noteForm,
  editingId,
  error,
  submitting,
  onLogout,
  onNoteFieldChange,
  onNoteSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
}) {
  return (
    <div className="notes-app">
      <div className="notes-header notes-header-row">
        <div>
          <h1>
            <span className="dot" />
            Notes
          </h1>
          <p>
            {notes.length} {notes.length === 1 ? "note" : "notes"} untuk{" "}
            <strong>{user.name}</strong>
          </p>
        </div>

        <button
          type="button"
          className="btn-cancel"
          onClick={onLogout}
          disabled={submitting}
        >
          Logout
        </button>
      </div>

      <form onSubmit={onNoteSubmit} className="form-card">
        <div className="form-label">{editingId ? "Edit note" : "New note"}</div>
        <input
          type="text"
          placeholder="Title"
          value={noteForm.title}
          onChange={(event) => onNoteFieldChange("title", event.target.value)}
          required
        />
        <textarea
          rows={4}
          placeholder="Write something..."
          value={noteForm.content}
          onChange={(event) => onNoteFieldChange("content", event.target.value)}
        />

        {error && <div className="form-error">{error}</div>}

        <div className="btn-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Menyimpan..." : editingId ? "Update" : "Add note"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="section-label">All notes</div>

      {notes.length === 0 ? (
        <div className="empty">Belum ada note. Tulis yang pertama di atas.</div>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-title">{note.title}</div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => onEdit(note)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => onDelete(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesPanel;
