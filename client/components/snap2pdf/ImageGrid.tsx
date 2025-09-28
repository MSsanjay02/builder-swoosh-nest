import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical, Trash2 } from "lucide-react";

export type GridImage = {
  id: string;
  src: string;
  name: string;
};

export function ImageGrid({
  images,
  onReorder,
  onRemove,
}: {
  images: GridImage[];
  onReorder: (from: number, to: number) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useI18n();

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      aria-live="polite"
    >
      {images.map((img, idx) => (
        <figure
          key={img.id}
          className="group relative overflow-hidden rounded-xl border bg-card"
        >
          <img
            src={img.src}
            alt={`${t("page")} ${idx + 1}: ${img.name}`}
            className="h-40 w-full object-cover"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", String(idx))
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData("text/plain"));
              const to = idx;
              if (!Number.isNaN(from)) onReorder(from, to);
            }}
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 text-[10px] text-white">
            <span className="truncate max-w-[60%]">{img.name}</span>
            <span className="opacity-80">
              {t("page")} {idx + 1}
            </span>
          </figcaption>
          <div
            className={cn(
              "absolute inset-0 hidden items-start justify-between p-2 group-hover:flex",
            )}
            aria-hidden
          >
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                aria-label="Move left"
                onClick={() => onReorder(idx, Math.max(0, idx - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Move right"
                onClick={() =>
                  onReorder(idx, Math.min(images.length - 1, idx + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button variant="secondary" size="icon" aria-label="Reorder">
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                aria-label={t("delete")}
                onClick={() => onRemove(img.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}
