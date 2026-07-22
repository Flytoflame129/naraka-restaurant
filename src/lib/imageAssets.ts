import type { ImageMetadata } from "astro";

import themeHuoluo from "../assets/visuals/theme-huoluo.webp";
import themeJuku from "../assets/visuals/theme-juku.webp";
import themeLongyin from "../assets/visuals/theme-longyin.webp";
import buzhouShibanFish from "../assets/dishes/menu/buzhou-shiban-fish.webp";
import currencyJadeGreens from "../assets/dishes/menu/currency-jade-greens.webp";
import divineFireRedArmorBun from "../assets/dishes/menu/divine-fire-red-armor-bun.webp";
import featherArrowGoldenCrowCharSiu from "../assets/dishes/menu/feather-arrow-golden-crow-char-siu.webp";
import fireCageBarbecue from "../assets/dishes/menu/fire-cage-barbecue.webp";
import firemanWokToss from "../assets/dishes/menu/fireman-wok-toss.webp";
import gaoshouPeachCrisps from "../assets/dishes/menu/gaoshou-peach-crisps.webp";
import guaranteedRedFourPlatter from "../assets/dishes/menu/guaranteed-red-four-platter.webp";
import jidiCityRedSausage from "../assets/dishes/menu/jidi-city-red-sausage.webp";
import kunlunSnowLotus from "../assets/dishes/menu/kunlun-snow-lotus.webp";
import purpleHerbSevenPeaches from "../assets/dishes/menu/purple-herb-seven-peaches.webp";
import spicySandKonjac from "../assets/dishes/menu/spicy-sand-konjac.webp";
import wolfRibPlatter from "../assets/dishes/menu/wolf-rib-platter.webp";
import zhangForbiddenMushroomSeaFireflySoup from "../assets/dishes/menu/zhang-forbidden-mushroom-sea-firefly-soup.webp";
import zifuPalaceRedEgg from "../assets/dishes/menu/zifu-palace-red-egg.webp";

const imageAssets: Record<string, ImageMetadata> = {
  "/assets/visuals/theme-juku.webp": themeJuku,
  "/assets/visuals/theme-huoluo.webp": themeHuoluo,
  "/assets/visuals/theme-longyin.webp": themeLongyin,
  "/assets/dishes/menu/buzhou-shiban-fish.webp": buzhouShibanFish,
  "/assets/dishes/menu/currency-jade-greens.webp": currencyJadeGreens,
  "/assets/dishes/menu/divine-fire-red-armor-bun.webp": divineFireRedArmorBun,
  "/assets/dishes/menu/feather-arrow-golden-crow-char-siu.webp": featherArrowGoldenCrowCharSiu,
  "/assets/dishes/menu/fire-cage-barbecue.webp": fireCageBarbecue,
  "/assets/dishes/menu/fireman-wok-toss.webp": firemanWokToss,
  "/assets/dishes/menu/gaoshou-peach-crisps.webp": gaoshouPeachCrisps,
  "/assets/dishes/menu/guaranteed-red-four-platter.webp": guaranteedRedFourPlatter,
  "/assets/dishes/menu/jidi-city-red-sausage.webp": jidiCityRedSausage,
  "/assets/dishes/menu/kunlun-snow-lotus.webp": kunlunSnowLotus,
  "/assets/dishes/menu/purple-herb-seven-peaches.webp": purpleHerbSevenPeaches,
  "/assets/dishes/menu/spicy-sand-konjac.webp": spicySandKonjac,
  "/assets/dishes/menu/wolf-rib-platter.webp": wolfRibPlatter,
  "/assets/dishes/menu/zhang-forbidden-mushroom-sea-firefly-soup.webp": zhangForbiddenMushroomSeaFireflySoup,
  "/assets/dishes/menu/zifu-palace-red-egg.webp": zifuPalaceRedEgg,
};

export const mapThemeImages = {
  juku: themeJuku,
  huoluo: themeHuoluo,
  longyin: themeLongyin,
} as const;

export function getImageAsset(path: string): ImageMetadata {
  const asset = imageAssets[path];

  if (!asset) {
    throw new Error(`No optimized image asset registered for ${path}`);
  }

  return asset;
}
