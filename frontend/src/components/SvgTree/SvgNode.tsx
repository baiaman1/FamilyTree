type Props = {
  node: any; // PositionedNode
  onExpand: (id: string) => void;
  onAddChild: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const SvgNode = ({
  node,
  onExpand,
  onAddChild,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <g>
      {/* ЛИНИИ */}
      {node.children?.map((child: any) => (
        <line
          key={child.id}
          x1={node.x}
          y1={node.y + 22}
          x2={child.x}
          y2={child.y - 22}
          stroke="#9ca3af"
          strokeWidth={1.5}
          pointerEvents="none"
        />
      ))}

      {/* УЗЕЛ */}
      <g transform={`translate(${node.x}, ${node.y})`}>
        {/* ТЕЛО УЗЛА — ТОЛЬКО ОНО EXPAND */}
        <rect
          x={-80}
          y={-22}
          width={160}
          height={44}
          rx={10}
          fill="#f9fafb"
          stroke="#9ca3af"
          pointerEvents="all"
          style={{ cursor: "pointer" }}
          onClick={() => onExpand(node.id)}
        />

        {/* ТЕКСТ — НИКАКИХ EVENTS */}
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="none"
          style={{ userSelect: "none" }}
        >
          {node.name}
        </text>

        {/* КНОПКИ — ОТДЕЛЬНЫЙ СЛОЙ */}
        <g
          transform="translate(100, -22)"
          pointerEvents="all"
        >
          {/* ADD */}
          <circle
            r={9}
            fill="#22c55e"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
            }}
          />
          <text
            x={-4}
            y={4}
            fontSize="11"
            fill="white"
            pointerEvents="none"
          >
            +
          </text>

          {/* EDIT */}
          <g transform="translate(0, 22)">
            <circle
              r={9}
              fill="#3b82f6"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node.id);
              }}
            />
            <text
              x={-4}
              y={4}
              fontSize="11"
              fill="white"
              pointerEvents="none"
            >
              ✎
            </text>
          </g>

          {/* DELETE */}
          {!node.hasChildren && (
            <g transform="translate(0, 44)">
              <circle
                r={9}
                fill="#ef4444"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
              />
              <text
                x={-4}
                y={4}
                fontSize="11"
                fill="white"
                pointerEvents="none"
              >
                ×
              </text>
            </g>
          )}
        </g>
      </g>

      {/* ДЕТИ */}
      {node.children?.map((child: any) => (
        <SvgNode
          key={child.id}
          node={child}
          onExpand={onExpand}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </g>
  );
};
