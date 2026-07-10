export const siteTitle = "NARAKA Restaurant";

export const nonOfficialNotice =
  "本站为《永劫无间》玩家同好创作项目，非官方网站，与游戏官方无隶属关系。站内内容主要用于玩家交流、梗文化整理与非商业展示。若内容涉及权益问题，请联系维护者处理。";

export const copyrightNotice =
  "《永劫无间 / NARAKA: BLADEPOINT》相关名称、商标、角色、设定和素材版权归其相应权利人所有。";

export const repositoryUrl =
  import.meta.env.PUBLIC_REPOSITORY_URL ?? "https://github.com/OWNER/naraka-restaurant";

export function sitePath(path = "/") {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.replace(/^\/+/, "");

  return cleanPath ? `${cleanBase}${cleanPath}` : cleanBase;
}

export function isPublicDishStatus(status: string, publishStatus = "published") {
  return publishStatus === "published" && status !== "rejected";
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    verified: "已核验",
    pending: "待考证",
    mixed: "部分待考证",
    rejected: "不发布",
  };

  return labels[status] ?? status;
}

export function publishStatusLabel(publishStatus: string) {
  const labels: Record<string, string> = {
    draft: "草稿",
    published: "已发布",
    "needs-review": "待审核",
  };

  return labels[publishStatus] ?? publishStatus;
}
