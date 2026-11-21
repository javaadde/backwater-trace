import type { Landmark } from "@/types/domain";

/**
 * Small gazetteer of Alappuzha landmarks used to turn spoken/written place
 * names into map coordinates. Coordinates are approximate.
 */
export const LANDMARKS: Landmark[] = [
  { id: "ksrtc", name: "Alappuzha KSRTC", nameMl: "കെഎസ്ആർടിസി", aliases: ["ksrtc", "bus stand", "bus station", "കെ.എസ്.ആർ.ടി.സി", "ബസ് സ്റ്റാൻഡ്", "ബസ്സ്റ്റാൻഡ്"], latitude: 9.4937, longitude: 76.3318 },
  { id: "mullakkal", name: "Mullakkal", nameMl: "മുല്ലയ്ക്കൽ", aliases: ["mullakkal", "mullakal", "മുല്ലക്കൽ"], latitude: 9.4986, longitude: 76.3382 },
  { id: "beach", name: "Alappuzha Beach", nameMl: "ആലപ്പുഴ ബീച്ച്", aliases: ["beach", "ബീച്ച്"], latitude: 9.4907, longitude: 76.3168 },
  { id: "vadai-canal", name: "Vadai Canal", nameMl: "വാടക്കനാൽ", aliases: ["vadai", "vada canal", "vadakanal", "വാടക്കനാൽ", "വാടകനാൽ"], latitude: 9.4999, longitude: 76.3342 },
  { id: "commercial-canal", name: "Commercial Canal", nameMl: "കൊമേഴ്സ്യൽ കനാൽ", aliases: ["commercial canal", "കൊമേഴ്സ്യൽ"], latitude: 9.4962, longitude: 76.3356 },
  { id: "punnamada", name: "Punnamada", nameMl: "പുന്നമട", aliases: ["punnamada", "പുന്നമട"], latitude: 9.5108, longitude: 76.3547 },
  { id: "kalarcode", name: "Kalarcode", nameMl: "കളർകോട്", aliases: ["kalarcode", "kalarkode", "കളർകോട്"], latitude: 9.4632, longitude: 76.3349 },
  { id: "thathampally", name: "Thathampally", nameMl: "തത്തംപള്ളി", aliases: ["thathampally", "തത്തംപള്ളി"], latitude: 9.5082, longitude: 76.3373 },
  { id: "kommady", name: "Kommady", nameMl: "കൊമ്മാടി", aliases: ["kommady", "കൊമ്മാടി"], latitude: 9.5158, longitude: 76.3302 },
  { id: "chungam", name: "Chungam", nameMl: "ചുങ്കം", aliases: ["chungam", "ചുങ്കം"], latitude: 9.5003, longitude: 76.3479 },
  { id: "pazhaveedu", name: "Pazhaveedu", nameMl: "പഴവീട്", aliases: ["pazhaveedu", "പഴവീട്"], latitude: 9.4851, longitude: 76.3421 },
  { id: "pallathuruthy", name: "Pallathuruthy", nameMl: "പള്ളാത്തുരുത്തി", aliases: ["pallathuruthy", "പള്ളാത്തുരുത്തി"], latitude: 9.4762, longitude: 76.3656 },
  { id: "kainakary", name: "Kainakary", nameMl: "കൈനകരി", aliases: ["kainakary", "കൈനകരി"], latitude: 9.4721, longitude: 76.3982 },
  { id: "vandanam", name: "Vandanam Medical College", nameMl: "വണ്ടാനം", aliases: ["vandanam", "medical college", "വണ്ടാനം", "മെഡിക്കൽ കോളേജ്"], latitude: 9.4431, longitude: 76.3301 },
  { id: "kanjiramchira", name: "Kanjiramchira", nameMl: "കാഞ്ഞിരംചിറ", aliases: ["kanjiramchira", "കാഞ്ഞിരംചിറ"], latitude: 9.4748, longitude: 76.3297 },
  { id: "mankombu", name: "Mankombu", nameMl: "മങ്കൊമ്പ്", aliases: ["mankombu", "മങ്കൊമ്പ്"], latitude: 9.4289, longitude: 76.4378 },
];

export function findLandmark(text: string): Landmark | null {
  const haystack = text.toLowerCase();
  for (const lm of LANDMARKS) {
    const needles = [lm.name.toLowerCase(), lm.nameMl, ...lm.aliases.map((a) => a.toLowerCase())];
    if (needles.some((n) => n && haystack.includes(n))) return lm;
  }
  return null;
}
