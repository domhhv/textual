'use client';

import { RefreshCwIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  ColorPicker,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerOutput,
  ColorPickerSelection,
  ColorPickerEyeDropper,
} from '@/components/ui/color-picker';

function generatePastelColors(count: number): string[] {
  return Array.from({ length: count }, () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 60;
    const lightness = Math.floor(Math.random() * 20) + 70;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
}

type EditorColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function EditorColorPicker({
  onChange,
  value,
}: EditorColorPickerProps) {
  const [presetColors, setPresetColors] = React.useState<string[]>(() => {
    return generatePastelColors(19);
  });

  const handleChange = React.useCallback(
    (rgba: [number, number, number, number]) => {
      const color = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
      onChange(color);
    },
    [onChange]
  );

  const handlePresetClick = React.useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange]
  );

  const handleRegeneratePresets = React.useCallback(() => {
    setPresetColors(generatePastelColors(19));
  }, []);

  return (
    <ColorPicker value={value} className="h-96" onChange={handleChange}>
      <div className="grid grid-cols-10 gap-2">
        {presetColors.map((color, index) => {
          return (
            <Button
              type="button"
              key={`${color}-${index}`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
              onClick={() => {
                return handlePresetClick(color);
              }}
              className="hover:ring-ring h-5 w-5 rounded p-0 transition-all hover:scale-110 hover:ring-2"
            />
          );
        })}
        <Button
          type="button"
          onClick={handleRegeneratePresets}
          className="p h-5 w-5 rounded px-0!"
          aria-label="Regenerate preset colors"
        >
          <RefreshCwIcon className="size-3" />
        </Button>
      </div>
      <ColorPickerSelection />
      <div className="flex items-center gap-4">
        <ColorPickerEyeDropper />
        <div className="grid w-full gap-1">
          <ColorPickerHue />
          <ColorPickerAlpha />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <ColorPickerOutput className="h-8! w-[68px] px-2" />
        <ColorPickerFormat />
      </div>
    </ColorPicker>
  );
}
