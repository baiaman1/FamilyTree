import { useEffect, useRef, useState } from "react";
import type { TreeNodeData } from "../../types/tree";
import { SvgNode } from "./SvgNode";
import { useLoadChildren } from "./useLoadChildren";
import { zoom, zoomIdentity } from "d3-zoom";
import { select } from "d3-selection";
import { useSvgMutations } from "./useSvgMutations";
import { useTreeLayout } from "./useTreeLayout";

type Props = {
  root: TreeNodeData;
};

export const SvgTree = ({ root }: Props) => {
  const [tree, setTree] = useState<TreeNodeData>(root);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const layoutedTree = useTreeLayout(tree);

  const loadChildren = useLoadChildren();

  const { addChild, deleteNode } = useSvgMutations();

const onExpand = async (nodeId: string) => {
  const target = findNodeById(tree, nodeId);
  if (!target) return;

  if (target.expanded) {
    target.expanded = false;
    setTree({ ...tree });
    return;
  }

  await loadChildren(target);
  target.expanded = true;
  setTree({ ...tree });
};

const onAddChild = async (nodeId: string) => {
  const target = findNodeById(tree, nodeId);
  if (!target) return;
  const name = prompt("Имя ребёнка");
  if (!name) return;

  await addChild(target, name);
  setTree({ ...tree });
};

const onDelete = async (nodeId: string) => {
  const node = findNodeById(tree, nodeId);
  if (!node) return;
  if (!confirm(`Удалить ${node.name}?`)) return;

  await deleteNode(node);
  setTree({ ...tree });
};
const onEdit = (nodeId: string) => {
  const node = findNodeById(tree, nodeId);
  if (!node) return;
  const name = prompt("Новое имя", node.name);
  if (!name) return;
  node.name = name;
  setTree({ ...tree });
};

const findNodeById = (
  node: TreeNodeData,
  id: string
): TreeNodeData | null => {
  if (node.id === id) return node;

  for (const child of node.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }

  return null;
};


  useEffect(() => {
  if (!svgRef.current || !gRef.current) return;

  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 19])
    .on("zoom", (event) => {
      gRef.current!.setAttribute(
        "transform",
        event.transform.toString()
      );
    });

  select(svgRef.current)
    .call(zoomBehavior as any)
    .call(
      zoomBehavior.transform,
      zoomIdentity.translate(0, 0).scale(0.9)
    );
}, []);

//   const onNodeClick = async (node: TreeNodeData) => {
//     if (node.expanded) {
//       node.expanded = false;
//       setTree({ ...tree });
//       return;
//     }

//     await loadChildren(node);
//     node.expanded = true;
//     setTree({ ...tree });
//   };

  return (
    <svg
        ref={svgRef}
        width="100%"
        height="100vh"
        viewBox="0 0 2000 2000"
        style={{ background: "#ffffff" }}
    >
      <g ref={gRef}>
        <SvgNode
          node={layoutedTree}
          onExpand={onExpand}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      </g>
    </svg>
  );
};
