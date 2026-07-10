export const mapThemes = [
  {
    key: "juku",
    name: "聚窟洲",
    label: "聚窟初席",
    description: "雾气、古树、岛屿与初入江湖的开席感，适合经典玩家梗、老地图梗和入门梗。",
    heroDescription: "聚窟洲席面偏雾色江湖：把玩家热梗、来源线索和同好创作装进一份初入局的暗色菜单。",
    accent: "#b99a58",
    tone: "深墨绿 / 暗金 / 温红 / 雾白",
    image: "/assets/visuals/theme-juku.png",
    alt: "雾林、古树与远处暖灯食肆构成的聚窟洲主题原创氛围图",
  },
  {
    key: "huoluo",
    name: "火罗国",
    label: "火罗烈宴",
    description: "烈日、沙海、古城与机关席面，适合高温、爆炒、烈性、机关和沙漠相关梗。",
    heroDescription: "火罗国席面切到沙海烈宴：焦橙热浪、古城机关和爆炒口味更重的玩家梗一起上桌。",
    accent: "#d98931",
    tone: "沙金 / 赤红 / 焦橙 / 深褐",
    image: "/assets/visuals/theme-huoluo.png",
    alt: "沙海、古城机关与宴席构成的火罗国主题原创氛围图",
  },
  {
    key: "longyin",
    name: "龙隐洞天",
    label: "龙隐秘席",
    description: "地宫、矿洞、龙纹幽光与机关遗迹，适合地下、阴间、机关、翻盘和幽默怪菜梗。",
    heroDescription: "龙隐洞天席面沉入地宫幽光：曜黑、冷青、龙纹机关和翻盘怪味梗都先交给后厨试菜。",
    accent: "#34a6b2",
    tone: "曜黑 / 熔岩红 / 冷青 / 古铜金",
    image: "/assets/visuals/theme-longyin.png",
    alt: "地宫、矿洞、机关与幽光后厨构成的龙隐洞天主题原创氛围图",
  },
] as const;

export type MapThemeKey = (typeof mapThemes)[number]["key"];

export function getMapTheme(id: string) {
  return mapThemes.find((theme) => theme.key === id || theme.name === id);
}
