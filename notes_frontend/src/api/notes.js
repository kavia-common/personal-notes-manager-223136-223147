import api from './client';

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch all notes for the authenticated user. */
  const { data } = await api.get('/notes');
  return Array.isArray(data) ? data : (data?.items || data?.notes || []);
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id. */
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note. Payload shape: { title, content } */
  const { data } = await api.post('/notes', payload);
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note by id. Payload shape: { title, content } */
  const { data } = await api.put(`/notes/${id}`, payload);
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  const { data } = await api.delete(`/notes/${id}`);
  return data;
}
