import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/users';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }

  const user = getUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      type: user.type,
    },
  });
}
