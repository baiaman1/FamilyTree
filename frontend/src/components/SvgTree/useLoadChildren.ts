import { useQueryClient } from "@tanstack/react-query";
import { personsApi } from "../../api/persons.api";
import type { TreeNodeData } from "../../types/tree";

export const useLoadChildren = () => {
  const qc = useQueryClient();

  return async (node: TreeNodeData) => {
    if (!node.hasChildren) return;
    if (node.children) return; // уже загружены

    const children = await qc.fetchQuery({
      queryKey: ["children", node.id],
      queryFn: () => personsApi.getChildren(node.id),
    });

    node.children = children.map((c) => ({
      id: c.id,
      name: c.name,
      hasChildren: c.hasChildren,
    }));
  };
};
