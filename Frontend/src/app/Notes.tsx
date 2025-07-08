import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "@/layouts/PrivateLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface Note {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    if (!apiClient.isAuthenticated()) {
      navigate("/auth");
      return;
    }

    const currentUser = apiClient.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      try {
        const response = await apiClient.getUserProfile();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Failed to get user profile:", error);
        navigate("/auth");
        return;
      }
    }
    await loadNotes();
  };

  const loadNotes = async () => {
    setIsLoadingNotes(true);
    try {
      const response = await apiClient.getNotes();
      if (response.success && response.notes) {
        setNotes(response.notes);
      } else {
        toast.error("Failed to load notes");
      }
    } catch (error: any) {
      console.error("Load notes error:", error);
      if (error.message.includes("Session expired")) {
        navigate("/auth");
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.createNote(newNote.trim());
      if (response.success) {
        if (response.note) {
          setNotes((prev) => [response.note, ...prev]);
        } else {
          await loadNotes();
        }
        setNewNote("");
        toast.success("Note created successfully!");
      } else {
        toast.error(response.message || "Failed to create note");
      }
    } catch (error: any) {
      console.error("Create note error:", error);
      if (error.message.includes("Session expired")) {
        navigate("/auth");
      } else {
        toast.error(error.message || "Failed to create note");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await apiClient.deleteNote(id);
      if (response.success) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
        toast.success("Note deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete note");
      }
    } catch (error: any) {
      console.error("Delete note error:", error);
      if (error.message.includes("Session expired")) {
        navigate("/auth");
      } else {
        toast.error(error.message || "Failed to delete note");
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleCreateNote();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#367AFF] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PrivateLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full mb-6">
          <Card className="px-6 py-5 shadow-md rounded-xl gap-2">
            <div className="text-xl font-bold text-[#232323] mb-1">
              Welcome, {user.name}!
            </div>
            <div className="text-base text-[#969696] font-normal">
              Email: {user.email}
            </div>
          </Card>
        </div>
        <div className="w-full mb-6 flex gap-3">
          <Input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your note..."
            className="h-12 flex-1"
            disabled={isLoading}
            maxLength={1000}
          />
          <Button
            className="h-12 px-6 text-base font-semibold bg-[#367AFF] hover:bg-[#367AFF]/90"
            onClick={handleCreateNote}
            disabled={!newNote.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#232323]">
              Notes ({notes.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadNotes}
              disabled={isLoadingNotes}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingNotes ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          {isLoadingNotes ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#367AFF] mx-auto mb-2"></div>
              <p className="text-gray-500">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500 mb-2">No notes yet</div>
              <p className="text-sm text-gray-400">
                Create your first note using the input above!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card
                  key={note._id}
                  className="p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-[#232323] break-words">
                        {note.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {formatDate(note.createdAt)}
                        {note.updatedAt !== note.createdAt && (
                          <span className="ml-2">
                            • Updated: {formatDate(note.updatedAt)}
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                      title="Delete note"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}

export default Notes;
