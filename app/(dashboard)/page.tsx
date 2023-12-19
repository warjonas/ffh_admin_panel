import Image from 'next/image';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  // if (!session) {
  //   redirect('/login');
  // }

  return (
    <main className="flex min-h-screen flex-col  flex-auto p-24">
      <h1>Welcome Home, {session?.user?.name}</h1>
    </main>
  );
}
