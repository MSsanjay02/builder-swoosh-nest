import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Uploader } from "@/components/snap2pdf/Uploader";
import { ImageGrid } from "@/components/snap2pdf/ImageGrid";
import { Controls, ControlsState, qualityFromCompression } from "@/components/snap2pdf/Controls";
import { useI18n, I18nProvider } from "@/i18n";
import { loadImagesFromFiles } from "@/utils/image";
import { imagesToPdf } from "@/utils/pdf";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function Snap2PDFPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [images, setImages] = useState<{ id: string; src: string; name: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [controls, setControls] = useState<ControlsState>({
    size: "a4",
    orientation: "p",
    compression: false,
    watermark: { enabled: false, text: "", size: 32, opacity: 0.3, rotation: 0, position: "center" },
  });

  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  const onFiles = async (files: File[]) => {
    const loaded = await loadImagesFromFiles(files);
    setImages((prev) => [...prev, ...loaded.map((l) => ({ id: l.id, src: l.src, name: l.name }))]);
  };

  const onReorder = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const onRemove = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const quality = useMemo(() => qualityFromCompression(controls.compression, controls.compression ? 70 : 95), [controls.compression]);

  const onConvert = async () => {
    if (images.length === 0) return;
    try {
      setProcessing(true);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const blob = await imagesToPdf(
        images.map((i) => i.src),
        {
          size: controls.size,
          orientation: controls.orientation,
          quality,
          watermark: controls.watermark.enabled
            ? {
                text: controls.watermark.text,
                size: controls.watermark.size,
                opacity: controls.watermark.opacity,
                rotation: controls.watermark.rotation,
                position: controls.watermark.position,
              }
            : undefined,
        },
      );
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      toast({ title: t("success"), description: t("pdf_ready") });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: String(e) });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <section className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-transparent p-6 dark:from-brand-950/30 border">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t("app_name")}</h1>
                <p className="mt-2 text-muted-foreground max-w-prose">{t("privacy_local")}</p>
              </div>
              <div className="flex items-center gap-3">
                {pdfUrl && (
                  <Button asChild>
                    <a href={pdfUrl} download>
                      {t("download_pdf")}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Uploader onFiles={onFiles} />
            {images.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">{t("reorder_hint")}</p>
                <ImageGrid images={images} onReorder={onReorder} onRemove={onRemove} />
              </>
            )}
          </div>
          <div className="lg:col-span-1">
            <Controls state={controls} setState={setControls} onConvert={onConvert} disabled={images.length === 0} processing={processing} />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {t("app_name")} · <span className="font-medium">{t("tagline")}</span>
        </p>
      </footer>
    </div>
  );
}

export default function Index() {
  return (
    <I18nProvider>
      <Snap2PDFPage />
    </I18nProvider>
  );
}
