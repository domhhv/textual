import * as React from 'react';

export default function useCssVar(varName: string) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    function update() {
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      setValue(val);
    }

    update();

    const observer = new MutationObserver(update);

    observer.observe(document.documentElement, {
      attributeFilter: ['class', 'data-theme', 'style'],
      attributes: true,
    });

    return () => {
      return observer.disconnect();
    };
  }, [varName]);

  return value;
}
