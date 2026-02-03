import axios from "axios";
import type { PersonNode } from "../types/person";

const api = axios.create({
  baseURL: "http://localhost:5010/api",
});

export const personsApi = {
  getRoot: async (): Promise<PersonNode> => {
    const res = await api.get("/persons/root");
    return res.data;
  },

  getChildren: async (id: string): Promise<PersonNode[]> => {
    const res = await api.get(`/persons/${id}/children`);
    return res.data;
  },

  addChild: async (fatherId: string, name: string) => {
    const res = await api.post(`/persons/${fatherId}/children`, { name });
    return res.data;
  },

  update: async (id: string, name: string) => {
    await api.put(`/persons/${id}`, { name });
  },

  delete: async (id: string) => {
    await api.delete(`/persons/${id}`);
  },
};
