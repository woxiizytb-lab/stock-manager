'use server'

import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

export async function createMovement(formData: FormData) {
  const productId = parseInt(formData.get('productId') as string, 10);
  const type = formData.get('type') as string; // 'IN' or 'OUT'
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const clientIdRaw = formData.get('clientId');
  const clientId = clientIdRaw ? parseInt(clientIdRaw as string, 10) : null;
  const assignmentType = formData.get('assignmentType') as string || null;

  if (isNaN(productId) || isNaN(quantity) || quantity <= 0 || !['IN', 'OUT'].includes(type)) return;

  await prisma.stockMovement.create({
    data: {
      productId,
      type,
      quantityChange: type === 'IN' ? quantity : -quantity,
      clientId: clientId || null,
      assignmentType: type === 'OUT' ? assignmentType : null
    }
  });

  revalidatePath('/movements');
  revalidatePath('/'); // Refresh dashboard valuation
}
