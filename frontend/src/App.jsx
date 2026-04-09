import { useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import NotesPanel from "./components/NotesPanel";
import {
  clearCsrfToken,
  createNote,
  deleteNote,
  fetchNotes as fetchNotesRequest,
  getCurrentUser,
  login,
  logout,
  register,
  updateNote,
} from "./lib/api";
import "./App.css";

const defaultAuthForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const defaultNoteForm = {
  title: "",
  content: "",
};

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(defaultAuthForm);
  const [noteForm, setNoteForm] = useState(defaultNoteForm);
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    bootstrapSession();
  }, []);

  async function bootstrapSession() {
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await fetchNotes();
    } catch (requestError) {
      if (requestError.status !== 401) {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function insertOrReplaceNote(note) {
    setNotes((currentNotes) => {
      const existingIndex = currentNotes.findIndex(
        (currentNote) => currentNote.id === note.id,
      );

      if (existingIndex === -1) {
        return [note, ...currentNotes];
      }

      const nextNotes = [...currentNotes];
      nextNotes[existingIndex] = note;
      return nextNotes;
    });
  }

  async function fetchNotes() {
    const data = await fetchNotesRequest();
    setNotes(data);
  }

  function updateAuthField(field, value) {
    setAuthForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNoteField(field, value) {
    setNoteForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : authForm;

      const authenticatedUser =
        authMode === "login" ? await login(payload) : await register(payload);
      setUser(authenticatedUser);
      setAuthForm(defaultAuthForm);
      clearCsrfToken();
      await fetchNotes();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setError("");

    try {
      await logout();
      setUser(null);
      setNotes([]);
      setEditingId(null);
      setNoteForm(defaultNoteForm);
      setAuthMode("login");
      clearCsrfToken();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNoteSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let savedNote;

      if (editingId) {
        savedNote = await updateNote(editingId, noteForm);
      } else {
        savedNote = await createNote(noteForm);
      }

      insertOrReplaceNote(savedNote);
      setEditingId(null);
      setNoteForm(defaultNoteForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus note ini?")) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await deleteNote(id);
      setNotes((currentNotes) =>
        currentNotes.filter((currentNote) => currentNote.id !== id),
      );

      if (editingId === id) {
        setEditingId(null);
        setNoteForm(defaultNoteForm);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setNoteForm({
      title: note.title,
      content: note.content ?? "",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNoteForm(defaultNoteForm);
  }

  if (loading) {
    return (
      <div className="notes-app">
        <div className="empty">Menyiapkan sesi aplikasi...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPanel
        authMode={authMode}
        authForm={authForm}
        error={error}
        submitting={submitting}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setError("");
        }}
        onFieldChange={updateAuthField}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <NotesPanel
      user={user}
      notes={notes}
      noteForm={noteForm}
      editingId={editingId}
      error={error}
      submitting={submitting}
      onLogout={handleLogout}
      onNoteFieldChange={updateNoteField}
      onNoteSubmit={handleNoteSubmit}
      onCancelEdit={handleCancelEdit}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default App;
