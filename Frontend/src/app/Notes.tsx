import { useState } from "react";
import PrivateLayout from "@/layouts/PrivateLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

function Notes() {
  const [notes, setNotes] = useState([
    { id: 1, text: "Note 1" },
    { id: 2, text: "Note 2" },
  ]);
  const [newNote, setNewNote] = useState("");

  const handleCreateNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [...prev, { id: Date.now(), text: newNote.trim() }]);
    setNewNote("");
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateNote();
    }
  };

  return (
    <PrivateLayout>
      <div className="w-full min-w-sm mb-4">
        <Card className="px-5 shadow-md rounded-xl gap-1 py-5">
          <div className="text-xl font-bold text-[#232323]">
            Welcome, Ujjwal Tyagi !
          </div>
          <div className="text-base text-[#232323] font-normal">
            Email: mail@mail.com
          </div>
        </Card>
      </div>
      <div className="w-full min-w-sm mb-3 flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your note..."
          className="h-12"
        />
        <Button
          className="h-12 text-base font-semibold bg-[#367AFF] hover:bg-[#367AFF]"
          onClick={handleCreateNote}
          disabled={!newNote.trim()}
        >
          Create
        </Button>
      </div>
      <div className="w-full min-w-sm flex flex-col gap-4">
        <div className="text-lg font-semibold text-[#232323] mb-1">Notes</div>
        {notes.map((note) => (
          <Card
            key={note.id}
            className="flex flex-row items-center justify-between p-4 shadow-md rounded-lg"
          >
            <span className="text-base text-[#232323]">{note.text}</span>
            <div
              className="text-[#232323] hover:text-red-500 cursor-pointer"
              onClick={() => handleDeleteNote(note.id)}
              title="Delete note"
            >
              <Trash2 size={20} />
            </div>
          </Card>
        ))}
      </div>
    </PrivateLayout>
  );
}

export default Notes;
