import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personsApi } from "../../api/persons.api";

export const useAddChild = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ fatherId, name }: { fatherId: string; name: string }) =>
      personsApi.addChild(fatherId, name),

    onSuccess: (_data, variables) => {
      // обновляем только детей конкретного узла
      qc.invalidateQueries({ queryKey: ["children", variables.fatherId] });
      // и корень на всякий случай (hasChildren)
      qc.invalidateQueries({ queryKey: ["root"] });
    },
  });
};
