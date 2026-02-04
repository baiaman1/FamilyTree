import { useQueryClient } from "@tanstack/react-query";
import { personsApi } from "../../api/persons.api";
import type { TreeNodeData } from "../../types/tree";

export const useSvgMutations = () => {
  const qc = useQueryClient();

  const addChild = async (node: TreeNodeData, name: string) => {
    await personsApi.addChild(node.id, name);

    // сбрасываем детей, чтобы перечитать
    node.children = undefined;
    node.hasChildren = true;
    node.expanded = false;

    qc.invalidateQueries({ queryKey: ["children", node.id] });
  };

  const deleteNode = async (node: TreeNodeData) => {
    await personsApi.delete(node.id);

    qc.invalidateQueries();
  };

  return { addChild, deleteNode };
};
