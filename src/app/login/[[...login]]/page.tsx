import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <SignIn />
    </div>
  );
}
