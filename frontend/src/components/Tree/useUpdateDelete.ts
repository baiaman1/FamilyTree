import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personsApi } from "../../api/persons.api";

export const useUpdatePerson = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      personsApi.update(id, name),
    onSuccess: () => {
      qc.invalidateQueries(); // достаточно, дерево маленькое по UI
    },
  });
};

export const useDeletePerson = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => personsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
};
