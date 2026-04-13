export class ResourceManager {
  images: Record<string, HTMLImageElement> = {};
  loaded = false;

  private svgSprites = {
    spider: `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="12" fill="#333" />
        <circle cx="32" cy="24" r="8" fill="#222" />
        <path d="M20 20 L10 10 M20 32 L10 32 M20 44 L10 54" stroke="#333" stroke-width="3" />
        <path d="M44 20 L54 10 M44 32 L54 32 M44 44 L54 54" stroke="#333" stroke-width="3" />
      </svg>
    `,
    fly: `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="16" rx="6" ry="4" fill="#555" />
        <ellipse cx="12" cy="12" rx="6" ry="3" fill="rgba(200,200,200,0.6)" />
        <ellipse cx="20" cy="12" rx="6" ry="3" fill="rgba(200,200,200,0.6)" />
      </svg>
    `,
    butterfly: `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 24 Q10 10 10 24 T24 38" fill="#ff66b2" />
        <path d="M24 24 Q38 10 38 24 T24 38" fill="#ff66b2" />
        <rect x="23" y="16" width="2" height="16" fill="#333" rx="1" />
      </svg>
    `,
    beetle: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="20" rx="12" ry="14" fill="#4d2600" />
        <path d="M20 6 L20 34" stroke="#261300" stroke-width="2" />
      </svg>
    `,
    nest: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
        <circle cx="64" cy="64" r="40" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
        <circle cx="64" cy="64" r="30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
        <path d="M64 14 L64 114 M14 64 L114 64 M28 28 L100 100 M28 100 L100 28" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      </svg>
    `,
    grass: `
      <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 16 L32 0 L64 16 L32 32 Z" fill="#4caf50" />
        <path d="M32 10 L30 15 L32 12 L34 15 Z" fill="#388e3c" />
      </svg>
    `
  };

  async loadAll() {
    const promises = Object.entries(this.svgSprites).map(([name, svg]) => {
      return this.loadImage(name, svg);
    });
    await Promise.all(promises);
    this.loaded = true;
  }

  private loadImage(name: string, svg: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        this.images[name] = img;
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
  }
}
