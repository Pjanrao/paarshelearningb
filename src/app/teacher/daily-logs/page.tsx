"use client";

import { useEffect, useState, FormEvent } from "react";
import { Clock, Eye, Edit3, Trash2 } from "lucide-react";

export default function TeacherDailyLogsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [logDate, setLogDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>("");
  const [editingDate, setEditingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [viewingLog, setViewingLog] = useState<any | null>(null);

  const loadBatches = async () => {
    try {
      const res = await fetch("/api/teacher/batches", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setBatches(data.batches || []);
        if (!selectedBatch && (data.batches || []).length > 0) setSelectedBatch(String((data.batches || [])[0]._id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLogs = async (batchId?: string, p = 1) => {
    setLoading(true);
    try {
      const url = batchId
        ? `/api/teacher/daily-logs?batchId=${batchId}&page=${p}&limit=${limit}`
        : `/api/teacher/daily-logs?page=${p}&limit=${limit}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setTotal(Number(data.total || 0));
        setPage(Number(data.page || p));
      } else {
        setLogs([]);
        setTotal(0);
      }
    } catch (e) {
      console.error(e);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) loadLogs(selectedBatch, 1);
    else loadLogs(undefined, 1);
  }, [selectedBatch]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    if (!selectedBatch) return setMessage({ type: "error", text: "Select a batch" });
    if (!notes.trim()) return setMessage({ type: "error", text: "Enter notes" });

    setIsSaving(true);
    try {
      const res = await fetch("/api/teacher/daily-logs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: selectedBatch, logDate, notes: notes.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      setMessage({ type: "success", text: "Saved" });
      setNotes("");
      loadLogs(selectedBatch, 1);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Could not save" });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (log: any) => {
    setEditingId(log._id);
    setEditingNotes(log.notes || "");
    setEditingDate(new Date(log.logDate).toISOString().slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingNotes("");
  };

  const saveEdit = async (logId: string) => {
    try {
      const res = await fetch("/api/teacher/daily-logs", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, logDate: editingDate, notes: editingNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
      setMessage({ type: "success", text: "Updated" });
      setEditingId(null);
      loadLogs(selectedBatch, page);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Unable to update" });
    }
  };

  const deleteLog = async (logId: string) => {
    if (!confirm("Delete this log?")) return;
    try {
      const res = await fetch("/api/teacher/daily-logs", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
      setMessage({ type: "success", text: "Deleted" });
      loadLogs(selectedBatch, page);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Unable to delete" });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Daily Teaching Logs</h1>
      </div>

      {/* Top horizontal add-form */}
      <div className="bg-white rounded-2xl border p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="md:w-56 w-full">
          <label className="block text-sm text-gray-600">Batch</label>
          <select value={selectedBatch} onChange={(e) => { setSelectedBatch(e.target.value); setPage(1); }} className="mt-1 w-full rounded-2xl border px-3 py-2">
            <option value="">All batches</option>
            {batches.map((b) => (
              <option key={b._id} value={String(b._id)}>{b.name}{b.courseId?.name ? ` — ${b.courseId.name}` : ""}</option>
            ))}
          </select>
        </div>

        <div className="md:w-40 w-full">
          <label className="block text-sm text-gray-600">Date</label>
          <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-2" />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-600">Notes</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-2" placeholder="What did you teach today?" />
        </div>

        <div className="flex items-center md:items-end">
          <button onClick={async (e) => { await handleSubmit(e as any); }} disabled={isSaving} className="bg-[#2C4276] text-white px-4 py-2 rounded-full">
            {isSaving ? "Saving..." : "Save Log"}
          </button>
        </div>
      </div>

      {/* Table of logs */}
      <div className="bg-white rounded-2xl border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold">Saved Logs</h2>
            <p className="text-sm text-gray-500">Recent daily logs for the selected batch</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
          </div>
        </div>

        {message && <div className={`mb-3 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</div>}

        {viewingLog && (
          <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-blue-700">Viewing Log</div>
                <div className="text-xs text-gray-500">{new Date(viewingLog.logDate).toLocaleDateString()}</div>
              </div>
              <button onClick={() => setViewingLog(null)} className="text-sm text-blue-600">Close</button>
            </div>
            <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">{viewingLog.notes}</div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Notes</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-3 py-4 text-gray-500">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="px-3 py-4 text-gray-500">No logs found for this batch.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t">
                    <td className="px-3 py-3 align-top text-gray-700">{editingId === log._id ? (
                      <input type="date" value={editingDate} onChange={(e) => setEditingDate(e.target.value)} className="rounded border px-2 py-1" />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-700"><Clock size={14} />{new Date(log.logDate).toLocaleDateString()}</div>
                    )}</td>
                    <td className="px-3 py-3 align-top">{editingId === log._id ? (
                      <textarea rows={2} value={editingNotes} onChange={(e) => setEditingNotes(e.target.value)} className="w-full rounded border px-2 py-1" />
                    ) : (
                      <div className="whitespace-pre-line text-gray-800">{log.notes}</div>
                    )}</td>
                    <td className="px-3 py-3 align-top text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-3 align-top">
                      {editingId === log._id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(log._id)} className="text-sm text-blue-600">Save</button>
                          <button onClick={cancelEdit} className="text-sm text-gray-500">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewingLog(log)} title="View" className="text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => startEdit(log)} title="Edit" className="text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => deleteLog(log._id)} title="Delete" className="text-red-600 p-1 rounded-full hover:bg-red-50">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => { const np = Math.max(1, page - 1); setPage(np); loadLogs(selectedBatch, np); }} className="px-3 py-1 rounded border">Prev</button>
            <button disabled={page >= totalPages} onClick={() => { const np = Math.min(totalPages, page + 1); setPage(np); loadLogs(selectedBatch, np); }} className="px-3 py-1 rounded border">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
