'use client';

import * as Slider from '@radix-ui/react-slider';
import Color from 'color';
import { PipetteIcon } from 'lucide-react';
import * as React from 'react';
import type { ComponentProps, HTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';
import cn from '@/lib/utils/cn';

type ColorPickerContextValue = {
  alpha: number;
  hue: number;
  lightness: number;
  mode: string;
  saturation: number;
  changeAlpha: (alpha: number, skipHistoryStack: boolean) => void;
  changeHue: (hue: number, skipHistoryStack: boolean) => void;
  changeLightness: (lightness: number, skipHistoryStack: boolean) => void;
  changeSaturation: (saturation: number, skipHistoryStack: boolean) => void;
  setMode: (mode: string) => void;
};

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null);

function useColorPickerContext() {
  const context = React.useContext(ColorPickerContext);

  if (!context) {
    throw new Error('ColorPicker components must be used within a ColorPicker');
  }

  return context;
}

export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  defaultValue?: Parameters<typeof Color>[0];
  value?: Parameters<typeof Color>[0];
  onChange?: (value: [number, number, number, number], skipHistoryStack: boolean) => void;
};

function ColorPicker({ className, defaultValue = 'rgba(0, 0, 0, 1)', onChange, value, ...props }: ColorPickerProps) {
  type ColorInstance = ReturnType<typeof Color>;
  let selectedColor: ColorInstance;
  let defaultColor: ColorInstance;

  try {
    selectedColor = Color(value);
  } catch {
    selectedColor = Color(defaultValue);
  }

  try {
    defaultColor = Color(defaultValue);
  } catch {
    defaultColor = Color('rgba(0, 0, 0, 1)');
  }

  const [hue, setHue] = React.useState(selectedColor.hue() ?? defaultColor.hue() ?? 0);
  const [saturation, setSaturation] = React.useState(selectedColor.saturationl() ?? defaultColor.saturationl() ?? 100);
  const [lightness, setLightness] = React.useState(selectedColor.lightness() ?? defaultColor.lightness() ?? 50);
  const [alpha, setAlpha] = React.useState((selectedColor.alpha() ?? defaultColor.alpha()) * 100);
  const [skipHistoryStack, setSkipHistoryStack] = React.useState(false);
  const [mode, setMode] = React.useState('hex');

  const onChangeRef = React.useRef(onChange);
  const isInternalUpdate = React.useRef(false);

  const changeHue = React.useCallback((newHue: number, skipHistoryStack: boolean) => {
    setHue(newHue);
    setSkipHistoryStack(skipHistoryStack);
  }, []);

  const changeSaturation = React.useCallback((newSaturation: number, skipHistoryStack: boolean) => {
    setSaturation(newSaturation);
    setSkipHistoryStack(skipHistoryStack);
  }, []);

  const changeLightness = React.useCallback((newLightness: number, skipHistoryStack: boolean) => {
    setLightness(newLightness);
    setSkipHistoryStack(skipHistoryStack);
  }, []);

  const changeAlpha = React.useCallback((newAlpha: number, skipHistoryStack: boolean) => {
    setAlpha(newAlpha);
    setSkipHistoryStack(skipHistoryStack);
  }, []);

  React.useEffect(() => {
    if (value && !isInternalUpdate.current) {
      try {
        const color = Color(value);
        const [h, s, l] = color.hsl().array();

        setHue(h);
        setSaturation(s);
        setLightness(l);
        setAlpha(color.alpha() * 100);
      } catch (error) {
        console.error('Invalid color value provided:', value, error);
      }
    }

    isInternalUpdate.current = false;
  }, [value]);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (onChangeRef.current) {
      isInternalUpdate.current = true;
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      const rgba = color.rgb().array();

      onChangeRef.current(
        [Math.round(rgba[0]), Math.round(rgba[1]), Math.round(rgba[2]), alpha / 100],
        skipHistoryStack
      );
    }
  }, [hue, saturation, lightness, alpha, skipHistoryStack]);

  return (
    <ColorPickerContext.Provider
      value={{
        alpha,
        changeAlpha,
        changeHue,
        changeLightness,
        changeSaturation,
        hue,
        lightness,
        mode,
        saturation,
        setMode,
      }}
    >
      <div className={cn('flex size-full flex-col gap-4', className)} {...props} />
    </ColorPickerContext.Provider>
  );
}

export type ColorPickerSaturationProps = ComponentProps<typeof Slider.Root>;

function ColorPickerSaturation({ className, ...props }: ColorPickerSaturationProps) {
  const { changeSaturation, hue, lightness, saturation } = useColorPickerContext();

  const backgroundGradient = React.useMemo(() => {
    return `linear-gradient(90deg, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`;
  }, [hue, lightness]);

  return (
    <Slider.Root
      step={1}
      max={100}
      value={[saturation]}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([saturation]) => {
        return changeSaturation(saturation, true);
      }}
      onValueCommit={([saturation]) => {
        return changeSaturation(saturation, false);
      }}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full"
        style={{
          background: backgroundGradient,
        }}
      >
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerLightnessProps = ComponentProps<typeof Slider.Root>;

function ColorPickerLightness({ className, ...props }: ColorPickerLightnessProps) {
  const { changeLightness, hue, lightness, saturation } = useColorPickerContext();

  const backgroundGradient = React.useMemo(() => {
    return `linear-gradient(90deg, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
  }, [hue, saturation]);

  return (
    <Slider.Root
      step={1}
      max={100}
      value={[lightness]}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([lightness]) => {
        return changeLightness(lightness, true);
      }}
      onValueCommit={([lightness]) => {
        return changeLightness(lightness, false);
      }}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full"
        style={{
          background: backgroundGradient,
        }}
      >
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

function ColorPickerHue({ className, ...props }: ColorPickerHueProps) {
  const { changeHue, hue } = useColorPickerContext();

  return (
    <Slider.Root
      step={1}
      max={360}
      value={[hue]}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([hue]) => {
        return changeHue(hue, true);
      }}
      onValueCommit={([hue]) => {
        return changeHue(hue, false);
      }}
      {...props}
    >
      <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

function ColorPickerAlpha({ className, ...props }: ColorPickerAlphaProps) {
  const { alpha, changeAlpha } = useColorPickerContext();

  return (
    <Slider.Root
      step={1}
      max={100}
      value={[alpha]}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([alpha]) => {
        return changeAlpha(alpha, true);
      }}
      onValueCommit={([alpha]) => {
        return changeAlpha(alpha, false);
      }}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

function ColorPickerEyeDropper({ className, ...props }: ColorPickerEyeDropperProps) {
  const { changeAlpha, changeHue, changeLightness, changeSaturation } = useColorPickerContext();

  const handleEyeDropper = React.useCallback(async () => {
    try {
      // @ts-expect-error - EyeDropper is not yet in the TypeScript library
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = Color(result.sRGBHex);
      const [h, s, l] = color.hsl().array();

      changeAlpha(h, false);
      changeSaturation(s, false);
      changeLightness(l, false);
      changeHue(100, false);
    } catch (error) {
      console.error('EyeDropper failed:', error);
    }
  }, [changeAlpha, changeSaturation, changeLightness, changeHue]);

  return (
    <Button
      size="icon"
      type="button"
      variant="outline"
      onClick={handleEyeDropper}
      disabled={!('EyeDropper' in window)}
      className={cn('text-muted-foreground shrink-0', className)}
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
}

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ['hex', 'rgb', 'css', 'hsl'];

function ColorPickerOutput({ className, ...props }: ColorPickerOutputProps) {
  const { mode, setMode } = useColorPickerContext();

  return (
    <Select value={mode} onValueChange={setMode}>
      <SelectTrigger className={cn('h-8 w-20 shrink-0 text-xs', className)} {...props}>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => {
          return (
            <SelectItem key={format} value={format} className="text-xs">
              {format.toUpperCase()}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

type PercentageInputProps = ComponentProps<typeof Input>;

function PercentageInput({ className, ...props }: PercentageInputProps) {
  return (
    <div className="relative">
      <Input
        readOnly
        type="number"
        {...props}
        className={cn('h-8 w-[3.5rem] rounded-l-none px-2 text-xs shadow-none', className)}
      />
      <span className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-xs">%</span>
    </div>
  );
}

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

function ColorPickerFormat({ className, ...props }: ColorPickerFormatProps) {
  const { alpha, hue, lightness, mode, saturation } = useColorPickerContext();
  const color = Color.hsl(hue, saturation, lightness, alpha / 100);

  if (mode === 'hex') {
    const hex = color.hex();

    return (
      <div
        className={cn('relative flex w-full items-center justify-end -space-x-px rounded-md shadow-xs', className)}
        {...props}
      >
        <Input readOnly type="text" value={hex} className="h-8 w-36 rounded-r-none px-2 text-xs shadow-none" />
        <PercentageInput value={alpha} />
      </div>
    );
  }

  if (mode === 'rgb') {
    const rgb = color
      .rgb()
      .array()
      .slice(0, 3)
      .map((value) => {
        return Math.round(value);
      });

    return (
      <div className={cn('flex items-center -space-x-px rounded-md shadow-xs', className)} {...props}>
        {rgb.map((value, index) => {
          return (
            <Input
              readOnly
              key={index}
              type="text"
              value={value}
              className={cn('h-8 w-12 rounded-r-none px-2 text-xs shadow-none', index && 'rounded-l-none', className)}
            />
          );
        })}
        <PercentageInput value={alpha} />
      </div>
    );
  }

  if (mode === 'css') {
    const rgb = color
      .rgb()
      .array()
      .slice(0, 3)
      .map((value) => {
        return Math.round(value);
      });

    return (
      <div className={cn('w-full rounded-md shadow-xs', className)} {...props}>
        <Input
          readOnly
          type="text"
          value={`rgba(${rgb.join(', ')}, ${alpha}%)`}
          className="h-8 w-full px-2 text-xs shadow-none"
          {...props}
        />
      </div>
    );
  }

  if (mode === 'hsl') {
    const hsl = color
      .hsl()
      .array()
      .slice(0, 3)
      .map((value) => {
        return Math.round(value);
      });

    return (
      <div className={cn('flex items-center -space-x-px rounded-md shadow-xs', className)} {...props}>
        {hsl.map((value, index) => {
          return (
            <Input
              readOnly
              key={index}
              type="text"
              value={value}
              className={cn('h-8 w-12 rounded-r-none px-2 text-xs shadow-none', index && 'rounded-l-none', className)}
            />
          );
        })}
        <PercentageInput value={alpha} />
      </div>
    );
  }

  return null;
}

export {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerLightness,
  ColorPickerOutput,
  ColorPickerSaturation,
};
