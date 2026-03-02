import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// the app needs a userId to work with API (see README and UserWarning).
// we try to read it from `localStorage` because tests set it there before
// the application is loaded.  If the value isn't available we fall back to
// `0` which will trigger the warning UI until a real id is provided.
function readUserIdFromStorage(): number {
  try {
    const raw = localStorage.getItem('user');

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed.id === 'number') {
        return parsed.id;
      }
    }
  } catch {
    // ignore parse errors
  }

  return 0;
}

// note: USER_ID is still exported for convenience (e.g. showing warning UI
// in App) but the actual value used for network requests is read every time
// so that changes in localStorage (or manual edits) are reflected immediately.
export const USER_ID = readUserIdFromStorage();

function currentUserId() {
  return readUserIdFromStorage();
}

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${currentUserId()}`);
};

// helpers for other parts of the application
export const createTodo = (title: string) =>
  client.post<Todo>('/todos', {
    userId: currentUserId(),
    title,
    completed: false,
  });

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);

export const updateTodo = (
  id: number,
  updates: Partial<Pick<Todo, 'title' | 'completed'>>,
) => client.patch<Todo>(`/todos/${id}`, updates);
