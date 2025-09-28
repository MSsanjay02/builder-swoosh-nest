import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n";
import { useState } from "react";

export type ControlsState = {
  size: "a4" | "letter";
  orientation: "p" | "l";
  compression: boolean;
  watermark: {
    enabled: boolean;
    text: string;
    size: number;
    opacity: number;
    rotation: number;
    position: "top-left" | "center" | "bottom-right";
  };
};

export function Controls({
  state,
  setState,
  onConvert,
  disabled,
  processing,
}: {
  state: ControlsState;
  setState: (s: ControlsState) => void;
  onConvert: () => void;
  disabled?: boolean;
  processing?: boolean;
}) {
  const { t } = useI18n();
  const [quality, setQuality] = useState<number>(state.compression ? 70 : 95);

  return (
    <div id="settings" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>{t("page_size")}</Label>
          <Select
            value={state.size}
            onValueChange={(v) => setState({ ...state, size: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label>{t("orientation")}</Label>
          <Select
            value={state.orientation}
            onValueChange={(v) => setState({ ...state, orientation: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">{t("portrait")}</SelectItem>
              <SelectItem value="l">{t("landscape")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{t("compression")}</Label>
            <Switch
              checked={state.compression}
              onCheckedChange={(v) => {
                setState({ ...state, compression: v });
                setQuality(v ? 70 : 95);
              }}
            />
          </div>
          <Slider value={[quality]} min={40} max={95} step={5} onValueChange={(v) => setQuality(v[0])} />
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">{t("add_watermark")}</Label>
          <Switch
            checked={state.watermark.enabled}
            onCheckedChange={(v) => setState({ ...state, watermark: { ...state.watermark, enabled: v } })}
          />
        </div>
        {state.watermark.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wm-text">{t("watermark_text")}</Label>
              <Input id="wm-text" value={state.watermark.text} onChange={(e) => setState({ ...state, watermark: { ...state.watermark, text: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label>{t("position")}</Label>
              <Select value={state.watermark.position} onValueChange={(v) => setState({ ...state, watermark: { ...state.watermark, position: v as any } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">{t("top_left")}</SelectItem>
                  <SelectItem value="center">{t("center")}</SelectItem>
                  <SelectItem value="bottom-right">{t("bottom_right")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("size")}: {state.watermark.size}px</Label>
              <Slider value={[state.watermark.size]} min={12} max={96} step={2} onValueChange={(v) => setState({ ...state, watermark: { ...state.watermark, size: v[0] } })} />
            </div>
            <div className="space-y-2">
              <Label>{t("opacity")}: {state.watermark.opacity}</Label>
              <Slider value={[state.watermark.opacity]} min={0.1} max={1} step={0.05} onValueChange={(v) => setState({ ...state, watermark: { ...state.watermark, opacity: Number(v[0].toFixed(2)) } })} />
            </div>
            <div className="space-y-2">
              <Label>{t("rotation")}: {state.watermark.rotation}°</Label>
              <Slider value={[state.watermark.rotation]} min={-90} max={90} step={5} onValueChange={(v) => setState({ ...state, watermark: { ...state.watermark, rotation: v[0] } })} />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" disabled={disabled} onClick={() => setState({
          ...state,
          orientation: "p",
          size: "a4",
          compression: false,
          watermark: { enabled: false, text: "", size: 32, opacity: 0.3, rotation: 0, position: "center" },
        })}>{t("clear_all")}</Button>
        <Button onClick={onConvert} disabled={disabled || processing}>
          {processing ? t("processing") : t("convert_pdf")}
        </Button>
      </div>
    </div>
  );
}

export function qualityFromCompression(enabled: boolean, sliderValue: number) {
  return enabled ? Math.max(0.4, sliderValue / 100) : 0.95;
}
