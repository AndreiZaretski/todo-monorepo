'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/lib/trpc';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(5, 'Минимум 5 символов'),
});

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const parsed = schema.safeParse({ email, password });

    if (!parsed.success) {
  const firstError = parsed.error.issues[0]?.message 
  ?? 'Ошибка валидации';
  setFormError(firstError);
  return;
   }


    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({ email, password });
        router.push('/todo');
        return;
      }

      if (mode === 'register') {
        await registerMutation.mutateAsync({ email, password });
        setSuccessMessage('Вы успешно зарегистрированы! Теперь войдите.');
        setMode('login');
      }
    } catch (err: any) {
      setFormError(err.message ?? 'Ошибка');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>

        {successMessage && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {formError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          type="button"
          className="text-blue-600 text-sm hover:underline"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setFormError('');
            setSuccessMessage('');
          }}
        >
          {mode === 'login'
            ? 'У меня нет аккаунта — Регистрация'
            : 'У меня уже есть аккаунт — Войти'}
        </button>
      </form>
    </div>
  );
}
