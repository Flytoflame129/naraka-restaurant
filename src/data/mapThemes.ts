export const mapThemes = [
  {
    key: "juku",
    name: "聚窟洲",
    label: "聚窟初席",
    heroTitle: "聚窟开席，劫味上桌",
    description: "雾气漫过古树与岛屿，初入江湖的一席以温润、鲜香和旧味开场。",
    heroDescription: "雾起古林，食肆灯火渐明。经典席面与江湖旧味在此落座，等候今日第一位入席之人。",
    accent: "#b99a58",
    tone: "深墨绿 / 暗金 / 温红 / 雾白",
    image: "/assets/visuals/theme-juku.webp",
    alt: "雾林、古树与远处暖灯食肆构成的聚窟洲主题原创氛围图",
  },
  {
    key: "huoluo",
    name: "火罗国",
    label: "火罗烈宴",
    heroTitle: "火罗燃宴，烈味开席",
    description: "烈日照过沙海与古城，高温爆炒、焦香烈味与异域香料同席。",
    heroDescription: "烈日沉入沙海，古城宴火正旺。高温爆炒与异域香气一同起锅，今夜只管痛快开席。",
    accent: "#d98931",
    tone: "沙金 / 赤红 / 焦橙 / 深褐",
    image: "/assets/visuals/theme-huoluo.webp",
    alt: "沙海、古城机关与宴席构成的火罗国主题原创氛围图",
  },
  {
    key: "longyin",
    name: "龙隐洞天",
    label: "龙隐秘席",
    heroTitle: "龙隐设宴，幽味入席",
    description: "紫色星盘悬于地宫宫阙，幽光、机关与奇味新菜循星轨入席。",
    heroDescription: "紫色星盘悬于辉煌宫阙，幽光照亮地宫长席。奇味新菜循着星轨上桌，静候来客入宴。",
    accent: "#34a6b2",
    tone: "曜黑 / 熔岩红 / 冷青 / 古铜金",
    image: "/assets/visuals/theme-longyin.webp",
    alt: "紫色北斗七星星盘照耀地下辉煌宫殿的龙隐洞天主题原创氛围图",
  },
] as const;

export type MapThemeKey = (typeof mapThemes)[number]["key"];

export function getMapTheme(id: string) {
  return mapThemes.find((theme) => theme.key === id || theme.name === id);
}
