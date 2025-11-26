import Color from 'colorjs.io';

export default function cssColorToRgba(cssColor: string): [number, number, number, number] {
  try {
    const color = new Color(cssColor);
    const srgb = color.to('srgb');

    return [
      Math.round(srgb.coords[0] * 255),
      Math.round(srgb.coords[1] * 255),
      Math.round(srgb.coords[2] * 255),
      srgb.alpha ?? 1,
    ];
  } catch {
    return [0, 0, 0, 1];
  }
}
