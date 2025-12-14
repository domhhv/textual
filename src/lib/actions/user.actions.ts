'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { encryptKey } from '@/lib/utils/encryption';

export async function updateUserApiKey(provider: 'openai', apiKey: string) {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      [`${provider}ApiKey`]: apiKey ?? encryptKey(apiKey),
    },
  });

  revalidatePath('/account');
}
