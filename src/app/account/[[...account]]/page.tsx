import { currentUser } from '@clerk/nextjs/server';

import Account from '@/components/account/account';

export default async function AccountPage() {
  const user = await currentUser();
  const hasOpenaiApiKey = Boolean(user?.privateMetadata.openaiApiKey);

  return (
    <div className="flex h-full items-center justify-center">
      <Account hasOpenaiApiKey={hasOpenaiApiKey} />
    </div>
  );
}
