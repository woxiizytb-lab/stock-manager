'use server'

import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;

  await prisma.client.create({ data: { name } });
  revalidatePath('/clients');
}
