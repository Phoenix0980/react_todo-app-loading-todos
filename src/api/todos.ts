import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 0;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// helpers for other parts of the application
export const createTodo = (title: string) =>
  client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });

export const deleteTodo = (id: number) =>
  client.delete(`/todos/${id}`);

export const updateTodo = (
  id: number,
  updates: Partial<Pick<Todo, 'title' | 'completed'>>,
) => client.patch<Todo>(`/todos/${id}`, updates);
