'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/app/lib/trpc';
import { useRouter } from 'next/navigation';

export default function TodoPage() {
  const router = useRouter();

  const listQuery = trpc.todo.list.useQuery();
  const createMutation = trpc.todo.create.useMutation();
  const deleteMutation = trpc.todo.delete.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [error, success]);


  const handleAdd = async () => {
    setError('');
    setSuccess('');

    if (!text.trim()) {
      setError('Введите текст задачи');
      return;
    }

    try {
      await createMutation.mutateAsync({ text });
      setText('');
      setSuccess('Задача добавлена');
      listQuery.refetch();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');

    try {
      await deleteMutation.mutateAsync({ id });
      setSuccess('Задача удалена');
      listQuery.refetch();
    } catch (err: any) {
      setError(err.message ?? 'Ошибка');
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push('/login'); // middleware поймает отсутствие cookie
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold">Ваши задачи</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Выйти
        </button>
      </div>

      <div className="h-12 mb-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Новая задача..."
          className="flex-1 p-3 border rounded-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Добавить
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {listQuery.data?.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
          >
            <span>{todo.text}</span>

            <button
              onClick={() => handleDelete(todo.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Удалить
            </button>
          </div>
        ))}

        {listQuery.data?.length === 0 && (
          <div className="text-gray-500 text-center mt-10">
            У вас пока нет задач
          </div>
        )}
      </div>
    </div>
  );
}
