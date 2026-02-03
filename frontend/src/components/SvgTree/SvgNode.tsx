import type { TreeNodeData } from "../../types/tree";

type Props = {
  node: TreeNodeData;
  x: number;
  y: number;
  onExpand: (node: TreeNodeData) => void;
  onEdit: (node: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
};

export const SvgNode = ({
  node,
  x,
  y,
  onExpand,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <g>
      {/* NODE BODY */}
      <g
        transform={`translate(${x}, ${y})`}
        onClick={() => onExpand(node)}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={-70}
          y={-18}
          width={140}
          height={36}
          rx={8}
          fill="#f3f4f6"
          stroke="#9ca3af"
        />

        {/* TEXT НЕ ПЕРЕХВАТЫВАЕТ КЛИК */}
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {node.name}
        </text>
      </g>

      {/* ACTION BUTTONS */}
      <g transform={`translate(${x + 90}, ${y - 18})`}>
        {/* ADD */}
        <circle
          r={8}
          fill="#22c55e"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(node);
          }}
          style={{ cursor: "pointer" }}
        />
        <text
          x={-3}
          y={4}
          fontSize="10"
          fill="white"
          style={{ pointerEvents: "none" }}
        >
          +
        </text>

        {/* EDIT */}
        <g transform="translate(0, 18)">
          <circle
            r={8}
            fill="#3b82f6"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            style={{ cursor: "pointer" }}
          />
          <text
            x={-4}
            y={4}
            fontSize="10"
            fill="white"
            style={{ pointerEvents: "none" }}
          >
            ✎
          </text>
        </g>

        {/* DELETE */}
        {!node.hasChildren && (
          <g transform="translate(0, 36)">
            <circle
              r={8}
              fill="#ef4444"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              style={{ cursor: "pointer" }}
            />
            <text
              x={-4}
              y={4}
              fontSize="10"
              fill="white"
              style={{ pointerEvents: "none" }}
            >
              ×
            </text>
          </g>
        )}
      </g>

      {/* CHILDREN */}
      {node.expanded &&
        node.children?.map((child, i) => (
          <SvgNode
            key={child.id}
            node={child}
            x={x}
            y={y + 120 + i * 120}
            onExpand={onExpand}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </g>
  );
};
