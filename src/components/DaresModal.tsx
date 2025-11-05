"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Dare } from "@/types/game";
import { Trash, Edit, Plus } from "lucide-react";

interface DaresModalProps {
  dares: Dare[];
  setDares: React.Dispatch<React.SetStateAction<Dare[]>>;
}

export default function DaresModal({ dares, setDares }: DaresModalProps) {
  const [newDare, setNewDare] = useState<Dare>({
    text: "",
    partnersCount: 0,
    isUnskippable: false,
    id: -1,
  });
  const [editingDare, setEditingDare] = useState<Dare | null>(null);

  let newId = Math.max(...dares.map((d) => d.id), 0) + 1;

  const addDare = () => {
    if (newDare.text.trim()) {
      setDares([...dares, { ...newDare, id: newId++ }]);
      setNewDare({ text: "", partnersCount: 0, isUnskippable: false, id: -1 });
    }
  };

  const removeDare = (id: number) => {
    setDares(dares.filter((d) => d.id !== id));
  };

  const startEditing = (dare: Dare) => {
    setEditingDare({ ...dare });
  };

  const saveEdit = () => {
    if (editingDare) {
      setDares(dares.map((d) => (d.id === editingDare.id ? editingDare : d)));
      setEditingDare(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Редактирай предизвикателства</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Предизвикателства</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {dares.map((dare) => (
            <div
              key={dare.id}
              className="bg-secondary flex items-center justify-between gap-2 rounded-lg p-3"
            >
              {editingDare && editingDare.id === dare.id ? (
                <div className="flex-grow space-y-2">
                  <Input
                    value={editingDare.text}
                    onChange={(e) =>
                      setEditingDare({ ...editingDare, text: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Партньори"
                    value={editingDare.partnersCount}
                    onChange={(e) =>
                      setEditingDare({
                        ...editingDare,
                        partnersCount: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingDare.isUnskippable}
                      onCheckedChange={(checked) =>
                        setEditingDare({
                          ...editingDare,
                          isUnskippable: checked,
                        })
                      }
                    />
                    <span>Не може да се пропуска</span>
                  </div>
                  <Button onClick={saveEdit}>Запази</Button>
                </div>
              ) : (
                <p className="flex-grow">{dare.text}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(dare)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDare(dare.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t pt-4">
          <h3 className="font-semibold">Добави ново предизвикателство</h3>
          <Input
            placeholder="Текст на предизвикателството"
            value={newDare.text}
            onChange={(e) => setNewDare({ ...newDare, text: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Брой партньори"
            value={newDare.partnersCount}
            onChange={(e) =>
              setNewDare({ ...newDare, partnersCount: Number(e.target.value) })
            }
          />
          <div className="flex items-center gap-2">
            <Switch
              checked={newDare.isUnskippable}
              onCheckedChange={(checked) =>
                setNewDare({ ...newDare, isUnskippable: checked })
              }
            />
            <span>Не може да се пропуска</span>
          </div>
          <Button onClick={addDare} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Добави
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Затвори</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
