'use client';

import type { ColorLike } from 'color';
import { XIcon } from 'lucide-react';
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
import cn from '@/lib/utils/cn';

type EditorColorPickerProps = {
  className?: string;
  label: string;
  value: ColorLike;
  onChange: (value: ColorLike) => void;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function EditorColorPicker({
  className,
  label,
  onChange,
  onClose,
  onSubmit,
  value,
}: EditorColorPickerProps) {
  const handleChange = React.useCallback(
    (rgba: [number, number, number, number]) => {
      const color = `rgba(${Math.round(rgba[0])}, ${Math.round(rgba[1])}, ${Math.round(rgba[2])}, ${rgba[3]})`;
      onChange(color);
    },
    [onChange]
  );

  return (
    <ColorPicker
      value={value}
      onChange={handleChange}
      id="editor-color-picker"
      className={cn(
        'bg-background max-w-sm rounded-md border p-4 shadow-sm',
        className
      )}
    >
      <div className="text-muted-foreground flex items-center justify-between">
        <p className="text-sm">{label}</p>
        <Button size="xs" variant="ghost" onClick={onClose}>
          <XIcon className="size-4" />
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
      <div className="flex items-center gap-2">
        <ColorPickerOutput className="h-8!" />
        <ColorPickerFormat />
      </div>
      <Button size="sm" className="w-full" onClick={onSubmit}>
        <span className="text-sm">Apply</span>
      </Button>
    </ColorPicker>
  );
}
