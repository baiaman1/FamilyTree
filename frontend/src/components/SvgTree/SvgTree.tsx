import { useEffect, useRef, useState } from "react";
import type { TreeNodeData } from "../../types/tree";
import { SvgNode } from "./SvgNode";
import { useLoadChildren } from "./useLoadChildren";
import { zoom, zoomIdentity } from "d3-zoom";
import { select } from "d3-selection";

type Props = {
  root: TreeNodeData;
};

export const SvgTree = ({ root }: Props) => {
  const [tree, setTree] = useState<TreeNodeData>(root);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const loadChildren = useLoadChildren();

  const onExpand = async (node: TreeNodeData) => {
    if (node.expanded) {
        node.expanded = false;
        setTree({ ...tree });
        return;
    }

    await loadChildren(node);
    node.expanded = true;
    setTree({ ...tree });
};

const onEdit = (node: TreeNodeData) => {
  const name = prompt("Новое имя", node.name);
  if (!name) return;

  // позже заменим на нормальную форму
  node.name = name;
  setTree({ ...tree });
};

const onDelete = (node: TreeNodeData) => {
  alert("Удаление подключим на следующем шаге");
};


  useEffect(() => {
  if (!svgRef.current || !gRef.current) return;

  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 9])
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
            node={tree}
            x={800}
            y={100}
            onExpand={onExpand}
            onEdit={onEdit}
            onDelete={onDelete}
            />

      </g>
    </svg>
  );
};
