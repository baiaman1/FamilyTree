import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { personsApi } from "../../api/persons.api";
import type { PersonNode } from "../../types/person";
import { useAddChild } from "./useAddChild";
import { useUpdatePerson, useDeletePerson } from "./useUpdateDelete";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type Props = {
  node: PersonNode;
};

export const TreeNode = ({ node }: Props) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);

  const addChild = useAddChild();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const { data: children, isFetching } = useQuery({
    queryKey: ["children", node.id],
    queryFn: () => personsApi.getChildren(node.id),
    enabled: open && node.hasChildren,
  });

  const saveEdit = async () => {
    if (!name.trim()) return;
    await updatePerson.mutateAsync({ id: node.id, name });
    setEditing(false);
  };

  const remove = async () => {
    if (!confirm("Удалить узел? (если есть дети — нельзя)")) return;
    await deletePerson.mutateAsync(node.id);
  };

  return (
    <div className="ml-4 mt-1">
      <div className="flex items-center gap-2 group">
        {/* expand */}
        <span
          onClick={() => setOpen(!open)}
          className="cursor-pointer select-none"
        >
          {node.hasChildren ? (open ? "▼" : "▶") : "•"}
        </span>

        {/* name / edit */}
        {!editing ? (
          <span className="font-medium">{node.name}</span>
        ) : (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-40"
          />
        )}

        {/* actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          {!editing ? (
            <>
              <Button onClick={() => setEditing(true)}>✏️</Button>
              <Button onClick={() => setAdding(!adding)}>＋</Button>
              <Button
                onClick={remove}
                disabled={node.hasChildren}
                className={
                  node.hasChildren ? "opacity-40 cursor-not-allowed" : ""
                }
              >
                🗑
              </Button>
            </>
          ) : (
            <>
              <Button onClick={saveEdit}>💾</Button>
              <Button onClick={() => setEditing(false)}>❌</Button>
            </>
          )}
        </div>
      </div>

      {/* add child */}
      {adding && (
        <AddChildInline
          fatherId={node.id}
          onDone={() => {
            setAdding(false);
            setOpen(true);
          }}
        />
      )}

      {/* children */}
      {open && (
        <div className="mt-1">
          {isFetching && (
            <div className="text-xs text-gray-400">Загрузка…</div>
          )}
          {children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Inline add child component ---
const AddChildInline = ({
  fatherId,
  onDone,
}: {
  fatherId: string;
  onDone: () => void;
}) => {
  const [name, setName] = useState("");
  const addChild = useAddChild();

  const submit = async () => {
    if (!name.trim()) return;
    await addChild.mutateAsync({ fatherId, name });
    setName("");
    onDone();
  };

  return (
    <div className="ml-6 mt-1 flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя сына"
        className="w-40"
      />
      <Button onClick={submit} disabled={addChild.isPending}>
        Добавить
      </Button>
    </div>
  );
};
