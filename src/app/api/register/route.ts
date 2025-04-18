import { NextResponse } from 'next/server';
import { addUser, getUserByEmail } from '@/lib/users';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { name, email, password, type } = await req.json();
  // Solo permitir a cierto correo ser administrador
if (type === 'administrador' && email !== 'josesanfuen@gmail.com') {
  return NextResponse.json(
    { error: 'Solo este correo está autorizado como administrador' },
    { status: 403 }
  );
}


  if (!name || !email || !password || !type) {
    return NextResponse.json({ error: 'Campos faltantes' }, { status: 400 });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'Usuario ya existe' }, { status: 409 });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
    type,
  };

  addUser(newUser);

  return NextResponse.json({ success: true });
}
