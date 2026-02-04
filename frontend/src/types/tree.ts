export type TreeNodeData = {
  id: string;
  name: string;
  hasChildren: boolean;
  children?: TreeNodeData[];
  expanded?: boolean;
};
