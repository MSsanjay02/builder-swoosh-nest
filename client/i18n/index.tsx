import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "en" | "ta";

export type Translations = Record<string, string>;

const en: Translations = {
  app_name: "Snap2PDF",
  tagline: "Convert. Protect. Share.",
  upload_images: "Upload images",
  drag_drop: "Drag & drop images here or click to browse",
  supported_formats: "Supported: JPG, PNG, BMP, HEIC",
  settings: "Settings",
  page_size: "Page size",
  orientation: "Orientation",
  portrait: "Portrait",
  landscape: "Landscape",
  compression: "Compression",
  add_watermark: "Watermark",
  watermark_text: "Text",
  size: "Size",
  opacity: "Opacity",
  rotation: "Rotation",
  position: "Position",
  top_left: "Top left",
  center: "Center",
  bottom_right: "Bottom right",
  convert_pdf: "Convert to PDF",
  clear_all: "Clear all",
  privacy_local: "Your files never leave your device.",
  language: "Language",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  high_contrast: "High contrast",
  font_size: "Font size",
  processing: "Processing...",
  reorder_hint: "Reorder by dragging or use the arrows",
  page: "Page",
  delete: "Delete",
  ocr: "OCR",
  ocr_soon: "Coming soon",
  success: "Success",
  download_pdf: "Download PDF",
  pdf_ready: "Your PDF is ready",
};

const ta: Translations = {
  app_name: "ஸ்நாப்2பிடிஎப்",
  tagline: "மாற்று. பாதுகாப்பு. பகிர்.",
  upload_images: "படங்களை பதிவேற்று",
  drag_drop:
    "படங்களை இங்கே இழுத்து விடவும் அல்லது கிளிக் செய்து தேர்வு செய்யவும்",
  supported_formats: "ஆதரவு: JPG, PNG, BMP, HEIC",
  settings: "அமைப்புகள்",
  page_size: "பக்க அளவு",
  orientation: "திசை",
  portrait: "நிலைவடிவ",
  landscape: "கிடைமட்ட",
  compression: "சுருக்கம்",
  add_watermark: "வாட்டர்மார்க்",
  watermark_text: "உரை",
  size: "அ���வு",
  opacity: "தெளிவு",
  rotation: "சுழற்று",
  position: "இடம்",
  top_left: "மேல் இடது",
  center: "மையம்",
  bottom_right: "கீழ் வலது",
  convert_pdf: "PDF ஆக மாற்று",
  clear_all: "அனைத்தையும் அழி",
  privacy_local: "உங்கள் கோப்புகள் உங்கள் சாதனத்தை விட்டு வெளியேறாது.",
  language: "மொழி",
  theme: "தீம்",
  light: "ஒளி",
  dark: "இருள்",
  high_contrast: "உயர் கண்டிராஸ்ட்",
  font_size: "எழுத்து அளவு",
  processing: "செயலாக்கப்படுகிறது...",
  reorder_hint:
    "இழுத்து மறுவரிசைப்படுத்துங்கள் அல்லது அம்புகளைப் பயன்படுத்துங்கள்",
  page: "பக்கம்",
  delete: "அழி",
  ocr: "OCR",
  ocr_soon: "விரைவில் வருகிறது",
  success: "வெற்றி",
  download_pdf: "PDF பதிவிறக்கு",
  pdf_ready: "உங்கள் PDF தயார்",
};

const packs: Record<Locale, Translations> = { en, ta };

export type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof en) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "ta") return saved;
    const nav = navigator.language.toLowerCase();
    return nav.startsWith("ta") ? "ta" : "en";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = useMemo(() => {
    const map = packs[locale];
    return (key: keyof typeof en) => map[key] ?? (packs.en[key] || String(key));
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
