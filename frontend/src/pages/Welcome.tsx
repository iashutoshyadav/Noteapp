import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { loadUser, logout } from "../lib/auth";
import Alert from "../components/Alert";

type Note = { _id: string; body: string; createdAt: string };

export default function Welcome() {
  const user = loadUser()!;
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // modal state
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  async function loadNotes() {
    try {
      const { data } = await api.get("/notes");
      setNotes(data.notes);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    }
  }
  useEffect(() => { loadNotes(); }, []);

  async function saveNote() {
    try {
      const body = draft.trim();
      if (!body) return;
      setLoading(true);
      const { data } = await api.post("/notes", { body });
      setNotes(prev => [data.note, ...prev]);
      setDraft("");
      setOpen(false);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  }

  async function deleteNote(id: string) {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    }
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 bg-white border-b z-10">
        <div className="mx-auto max-w-md px-3 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-large font-bold">Dashboard</span>
          </div>
          <button onClick={logout} className="text-xs text-black-600 font-bold hover:underline">Sign Out</button>
        </div>
      </header>

      <main className="mx-auto max-w-md p-3 space-y-4">
        <Alert msg={error} />

        {/* Welcome card */}
        <section className="bg-white border rounded-xl shadow-sm p-4">
          <p className="font-semibold">Welcome {user.name || "User"} !</p>
          <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
        </section>

        {/* Create Note (opens modal) */}
        <button
          className="w-full h-11 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60"
          onClick={() => setOpen(true)}
        >
          Create Note
        </button>

        {/* Notes list */}
        <section className="space-y-2">
          <h2 className="font-medium">Notes</h2>
          {notes.map(n => (
            <div key={n._id} className="flex items-center justify-between bg-white border rounded-xl shadow-sm px-3 py-2">
              <span className="text-sm text-gray-800 truncate">{n.body}</span>
              <button
                onClick={() => deleteNote(n._id)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Delete note"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1m-7 0h6" />
                </svg>
              </button>
            </div>
          ))}
          {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
        </section>
      </main>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setOpen(false)}
          />
          {/* dialog */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-4">
              <h3 className="font-semibold mb-2">Create a note</h3>
              <textarea
                className="w-full min-h-28 resize-y rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write something…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                  onClick={() => { setDraft(""); setOpen(false); }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={saveNote}
                  disabled={loading || !draft.trim()}
                >
                  {loading ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
