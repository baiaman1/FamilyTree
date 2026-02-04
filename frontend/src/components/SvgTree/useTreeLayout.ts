import { hierarchy, tree } from "d3-hierarchy";
import type { TreeNodeData } from "../../types/tree";

type PositionedNode = TreeNodeData & {
  x: number;
  y: number;
  children?: PositionedNode[];
};

export const useTreeLayout = (
  root: TreeNodeData,
  width = 1600,
  height = 1200
): PositionedNode => {
  const h = hierarchy<TreeNodeData>(
    root,
    (d) => (d.expanded ? d.children : null)
  );

  const layout = tree<TreeNodeData>()
    .nodeSize([200, 140]); // X / Y расстояния

  const result = layout(h);

  const mapNode = (n: any): PositionedNode => ({
    ...n.data,
    x: n.x + width / 2,
    y: n.y + 100,
    children: n.children?.map(mapNode),
  });

  return mapNode(result);
};
