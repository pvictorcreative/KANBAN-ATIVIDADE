import axios from "axios";

export type StatusKey = "todo" | "doing" | "done";

export interface CardType {
  id?: string;
  title: string;
  description: string;
  labels: string[];
  status: StatusKey;
  created_at?: string;
  updated_at?: string;
}

const API_URL = "https://kanban-backend-mu.vercel.app/api/tasks";

export default {
  async getAll(): Promise<CardType[]> {
    const { data } = await axios.get<{ items: CardType[] }>(API_URL);
    return data.items;
  },

  async create(
    task: Omit<CardType, "id" | "created_at" | "updated_at">
  ): Promise<CardType> {
    const { data } = await axios.post<CardType>(API_URL, task);
    return data;
  },

  async update(id: string, task: Partial<CardType>): Promise<CardType> {
    const { data } = await axios.patch<CardType>(`${API_URL}/${id}`, task);
    return data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
