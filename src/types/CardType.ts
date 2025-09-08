export type StatusKey = "todo" | "doing" | "done";

export default interface CardType {
  id?: string;
  title: string;
  description: string;
  labels: string[];
  status: "todo" | "doing" | "done";
  created_at?: string;
  updated_at?: string;
}
