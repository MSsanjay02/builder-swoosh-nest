import heic2any from "heic2any";

export type ImageInput = File;

export type LoadedImage = {
  id: string;
  file: File;
  name: string;
  type: string;
  src: string; // data URL
  width: number;
  height: number;
};

// Read File as DataURL
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function loadImageMeta(src: string): Promise<{ width: number; height: number }>{
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

export async function convertHeicIfNeeded(file: File): Promise<File> {
  const isHeic = /heic|heif/i.test(file.type) || /\.hei(c|f)$/i.test(file.name);
  if (!isHeic) return file;
  const blob = (await heic2any({ blob: file, toType: "image/jpeg" })) as Blob;
  return new File([blob], file.name.replace(/\.(hei[c|f])$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

export async function loadImagesFromFiles(files: File[]): Promise<LoadedImage[]> {
  const out: LoadedImage[] = [];
  for (const f of files) {
    const converted = await convertHeicIfNeeded(f);
    const src = await fileToDataURL(converted);
    const { width, height } = await loadImageMeta(src);
    out.push({ id: crypto.randomUUID(), file: converted, name: converted.name, type: converted.type, src, width, height });
  }
  return out;
}

export function drawWatermark(
  base: HTMLImageElement,
  opts: {
    text?: string;
    fontSize: number; // px
    opacity: number; // 0-1
    rotation: number; // deg
    position: "top-left" | "center" | "bottom-right";
  },
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = base.naturalWidth;
  canvas.height = base.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(base, 0, 0);
  if (opts.text && opts.text.trim().length > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(opts.opacity, 0), 1);
    ctx.translate(0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = `${opts.fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans Tamil, Noto Sans, sans-serif`;
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(opts.text);
    const tw = metrics.width;
    const th = opts.fontSize;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let x = 24;
    let y = 24 + th / 2;
    if (opts.position === "center") {
      x = centerX - tw / 2;
      y = centerY;
    } else if (opts.position === "bottom-right") {
      x = canvas.width - tw - 24;
      y = canvas.height - 24 - th / 2;
    }

    ctx.translate(x + tw / 2, y);
    ctx.rotate((opts.rotation * Math.PI) / 180);
    ctx.translate(-(x + tw / 2), -y);

    // text with subtle shadow for visibility
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(opts.text, x + 2, y + 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(opts.text, x, y);

    ctx.restore();
  }
  return canvas;
}

export async function imageElementFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
