export default interface CardType {
    id?: string;
    title: string;
    description: string;
    status: 'to-do' | 'in-progress' | 'done';
    labels: string;
}