'use server';

import { revalidatePath } from 'next/cache';

import type { DocumentsInsert, DocumentsUpdate } from '@/lib/models/document.model';
import createClerkSupabaseClientSsr from '@/lib/utils/create-clerk-supabase-ssr-client';

const client = await createClerkSupabaseClientSsr();

export async function createDocument(body: DocumentsInsert) {
  const { error } = await client.from('documents').insert(body).select();

  if (error) {
    throw error;
  }

  revalidatePath('/');
}

export async function removeDocument(documentId: string) {
  const { error } = await client.from('documents').delete().eq('id', documentId);

  if (error) {
    throw error;
  }

  revalidatePath('/');
}

export async function updateDocument(documentId: string, body: DocumentsUpdate) {
  const { error } = await client.from('documents').update(body).eq('id', documentId).select();

  if (error) {
    throw error;
  }

  revalidatePath('/');
}
