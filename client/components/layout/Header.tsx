import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/i18n";
import { usePreferences } from "@/hooks/usePreferences";
import { Languages, Moon, Sun } from "lucide-react";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const {
    theme,
    setTheme,
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
  } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md bg-gradient-to-br from-brand-500 to-brand-700"
            aria-hidden
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold tracking-tight text-xl">
              {t("app_name")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("tagline")}
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              aria-label={t("theme")}
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {t("high_contrast")}
            </span>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>

          <div className="hidden xl:flex items-center gap-2 w-48">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {t("font_size")}
            </span>
            <Slider
              value={[fontScale]}
              min={75}
              max={150}
              step={5}
              onValueChange={(v) => setFontScale(v[0])}
            />
          </div>

          <Button asChild variant="secondary" className="sm:hidden">
            <a href="#settings">{t("settings")}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
