export function adjustColor(color: string, amount: number): string {
    if (!color || typeof color !== 'string') {
      console.error('Invalid color input:', color);
      return '#ffffff'; // return default color (white) or handle as needed
    }
  
    return (
      '#' +
      color
        .replace(/^#/, '')
        .replace(/../g, (color) =>
          ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
        )
    );
  }
  