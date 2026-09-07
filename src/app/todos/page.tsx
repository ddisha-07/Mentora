import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Supabase Todos</h1>
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
            {todo.name}
          </li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && (
        <p className="text-sm text-slate-400 mt-4">
          No todos found. If you just connected your Supabase project, create a <code>todos</code> table with an <code>id</code> and <code>name</code> column in the Supabase Table Editor.
        </p>
      )}
    </div>
  );
}
