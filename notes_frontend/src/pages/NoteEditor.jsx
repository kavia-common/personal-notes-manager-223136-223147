import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNote, updateNote } from '../api/notes';

export default function NoteEditor() {
  const { id } = useParams();
  const isCreate = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isCreate);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      if (isCreate) return;
      try {
        const data = await getNote(id);
        if (!active) return;
        setTitle(data.title || '');
        setContent(data.content || '');
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || 'Failed to load note.';
        setError(String(msg));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id, isCreate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isCreate) {
        const res = await createNote({ title, content });
        const newId = res?.id;
        navigate(newId ? `/notes/${newId}` : '/notes', { replace: true });
      } else {
        await updateNote(id, { title, content });
        navigate('/notes', { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Save failed.';
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="skeleton">Loading editor...</div>;
  }

  return (
    <div className="card">
      <h2 className="title">{isCreate ? 'Create Note' : 'Edit Note'}</h2>
      {error ? <div className="alert error" role="alert">{error}</div> : null}
      <form className="form" onSubmit={onSubmit}>
        <label className="label" htmlFor="title">Title</label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title"
        />
        <label className="label" htmlFor="content">Content</label>
        <textarea
          id="content"
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Write your note content here..."
        />
        <div className="actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );
}
