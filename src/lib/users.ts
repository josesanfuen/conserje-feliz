export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'conserje' | 'corredora' | 'administrador';
}

// Usuarios predefinidos
export const users: User[] = [
  {
    id: 'admin1',
    name: 'José Administrador',
    email: 'josesanfuen@gmail.com',
    password: 'shelipe',
    type: 'administrador',
  },
  {
    id: 'conserje1',
    name: 'Carlos Conserje',
    email: 'conserje1@gmail.com',
    password: 'conserje1',
    type: 'conserje',
  },
  {
    id: 'corredora1',
    name: 'Ana Corredora',
    email: 'corredora1@gmail.com',
    password: 'corredora1',
    type: 'corredora',
  },
  {
    id: 'corredora2',
    name: 'Beatriz Corredora',
    email: 'corredora2@gmail.com',
    password: 'corredora2',
    type: 'corredora',
  },
];

export function addUser(user: User) {
  users.push(user);
}

export function getUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

// ✅ Esta es la función que debes agregar para mostrar el nombre de corredoras
export function getCorredoras() {
  return users
    .filter((u) => u.type === 'corredora')
    .map((c) => ({
      id: c.email,     // usamos email como identificador
      name: c.name,    // este nombre es el que verá el admin
    }));
}
