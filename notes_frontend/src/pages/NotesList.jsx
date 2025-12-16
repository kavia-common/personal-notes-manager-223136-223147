import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteNote, listNotes } from '../api/notes';

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setError('');
    try {
      const items = await listNotes();
      setNotes(items || []);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to load notes.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => String(n.id) !== String(id)));
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to delete note.';
      setError(String(msg));
    }
  };

  if (loading) {
    return <div className="skeleton">Loading notes...</div>;
  }

  return (
    <div className="stack">
      <div className="stack-header">
        <h2 className="title">Your Notes</h2>
        <Link className="btn btn-secondary" to="/notes/new">New Note</Link>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {notes.length === 0 ? (
        <div className="empty">
          <p className="muted">No notes yet. Create your first one!</p>
          <Link className="btn btn-primary" to="/notes/new">Create Note</Link>
        </div>
      ) : (
        <ul className="notes-grid">
          {notes.map((n) => (
            <li key={n.id} className="note-card">
              <Link className="note-title" to={`/notes/${n.id}`}>
                {n.title || 'Untitled'}
              </Link>
              <p className="note-excerpt">
                {(n.content || '').slice(0, 140) || 'No content'}
                {(n.content || '').length > 140 ? '…' : ''}
              </p>
              <div className="note-meta">
                <span className="muted">
                  {n.updated_at ? new Date(n.updated_at).toLocaleString() : ''}
                </span>
                <div className="note-actions">
                  <Link className="btn btn-ghost" to={`/notes/${n.id}`}>Edit</Link>
                  <button className="btn btn-danger" onClick={() => onDelete(n.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
