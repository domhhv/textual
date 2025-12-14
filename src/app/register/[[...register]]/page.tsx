import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <SignUp />
    </div>
  );
}
