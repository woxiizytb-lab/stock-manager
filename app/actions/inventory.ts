'use server'

import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;

  await prisma.category.create({ data: { name } });
  revalidatePath('/inventory');
}

export async function createProduct(formData: FormData) {
  const referenceName = formData.get('referenceName') as string;
  const defaultPurchasePrice = parseFloat(formData.get('defaultPurchasePrice') as string);
  const categoryId = parseInt(formData.get('categoryId') as string, 10);

  if (!referenceName || isNaN(defaultPurchasePrice) || isNaN(categoryId)) return;

  await prisma.product.create({
    data: {
      referenceName,
      defaultPurchasePrice,
      categoryId
    }
  });
  revalidatePath('/inventory');
}
