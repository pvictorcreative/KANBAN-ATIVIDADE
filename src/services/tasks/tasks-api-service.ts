import api from '@/services/interceptor';
import CardType from '@/types/CardType';

class TasksApiService {
 async getAll() {
    const {data} = await api.get('/tasks');
    return data.items
 }
 async getId(id:string) {
   console.log("metodo recebido", id)
    const {data} = await api.get(`/tasks/${id}`);
   return data
 }
    async post(tasks:CardType) {
    const response = await api.post('/tasks', tasks);
    console.log(response.data);
 } 
 async put(tasks:CardType) {
    const response = await api.put(`/tasks/${tasks.id}`, tasks);
    console.log(response.data);
 } 
 async patch(tasks:CardType) {
    const response = await api.patch(`/tasks/${tasks.id}`, tasks);
    console.log(response.data);
 } 
 async delete(id:string) {
    const response = await api.delete(`/tasks/${id}`);
    console.log(response.data);
 }
}

export default new TasksApiService();
