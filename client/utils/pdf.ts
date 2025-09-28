import jsPDF from "jspdf";
import { imageElementFromSrc, drawWatermark } from "@/utils/image";

export type PageSize = "a4" | "letter";
export type Orientation = "p" | "l"; // portrait | landscape

export type WatermarkOptions = {
  text?: string;
  size: number; // font size px
  opacity: number; // 0-1
  rotation: number; // deg
  position: "top-left" | "center" | "bottom-right";
};

export type ConvertOptions = {
  size: PageSize;
  orientation: Orientation;
  quality: number; // 0.1 - 1.0 for JPEG
  watermark?: WatermarkOptions;
};

export async function imagesToPdf(
  images: string[],
  opts: ConvertOptions,
): Promise<Blob> {
  if (images.length === 0) throw new Error("No images provided");

  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: "pt",
    format: opts.size,
  });

  for (let i = 0; i < images.length; i++) {
    const src = images[i];
    const imgEl = await imageElementFromSrc(src);

    const appliedCanvas = drawWatermark(imgEl, {
      text: opts.watermark?.text,
      fontSize: opts.watermark?.size ?? 32,
      opacity: opts.watermark?.opacity ?? 0.3,
      rotation: opts.watermark?.rotation ?? 0,
      position: opts.watermark?.position ?? "center",
    });

    const imgData = appliedCanvas.toDataURL("image/jpeg", opts.quality);

    if (i > 0) pdf.addPage();

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // Fit image keeping aspect ratio
    const imgW = appliedCanvas.width;
    const imgH = appliedCanvas.height;
    const scale = Math.min(pageW / imgW, pageH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const x = (pageW - drawW) / 2;
    const y = (pageH - drawH) / 2;

    pdf.addImage(imgData, "JPEG", x, y, drawW, drawH, undefined, "FAST");
  }

  return pdf.output("blob");
}
