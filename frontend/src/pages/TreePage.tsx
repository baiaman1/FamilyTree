import { useQuery } from "@tanstack/react-query";
import { personsApi } from "../api/persons.api";
import { SvgTree } from "../components/SvgTree/SvgTree";

export const TreePage = () => {
  const { data } = useQuery({
    queryKey: ["root"],
    queryFn: personsApi.getRoot,
  });

  if (!data) return null;

  return (
    <SvgTree
      root={{
        id: data.id,
        name: data.name,
        hasChildren: data.hasChildren,
      }}
    />
  );
};

