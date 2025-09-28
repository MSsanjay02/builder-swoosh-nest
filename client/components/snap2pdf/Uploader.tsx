import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export function Uploader({ onFiles }: { onFiles: (files: File[]) => void }) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) => /image\/(jpeg|png|bmp|gif|webp|heic|heif)/i.test(f.type) || /\.(jpe?g|png|bmp|gif|webp|heic|heif)$/i.test(f.name));
      if (files.length) onFiles(files);
    },
    [onFiles],
  );

  const onPick = () => inputRef.current?.click();

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center transition-colors hover:border-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
      role="region"
      aria-label={t("upload_images")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-brand-700/0 group-hover:from-brand-500/5 group-hover:to-brand-700/5 transition-colors" />
      <div className="mb-3 text-sm text-muted-foreground">{t("drag_drop")}</div>
      <div className="mb-6 text-xs text-muted-foreground">{t("supported_formats")}</div>
      <div className="flex gap-3">
        <Button onClick={onPick}>{t("upload_images")}</Button>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={(e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            if (files.length) onFiles(files);
          }}
        />
      </div>
    </div>
  );
}
