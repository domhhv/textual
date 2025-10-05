import { Kbd, KbdGroup } from '@/components/ui/kbd';

export default function Shortcut({ keys }: { keys?: readonly string[] }) {
  if (!keys || keys.length === 0) {
    return null;
  }

  return (
    <KbdGroup>
      {keys.map((key, index) => {
        return <Kbd key={index}>{key}</Kbd>;
      })}
    </KbdGroup>
  );
}
