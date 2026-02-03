import type { PersonNode } from "../../types/person";
import { TreeNode } from "./TreeNode";

type Props = {
  root: PersonNode;
};

export const Tree = ({ root }: Props) => {
  return (
    <div>
      <TreeNode node={root} />
    </div>
  );
};
