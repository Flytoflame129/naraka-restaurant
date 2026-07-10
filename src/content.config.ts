import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const mapThemeNames = ["聚窟洲", "火罗国", "龙隐洞天"] as const;
const dishStatuses = ["verified", "pending", "mixed", "rejected"] as const;
const publishStatuses = ["draft", "published", "needs-review"] as const;
const dishCategories = ["主食", "小吃", "饮品", "招牌菜", "怪菜", "套餐"] as const;
const credibilityLevels = ["高", "中", "低", "待考证"] as const;
const memeTypes = [
  "谐音梗",
  "角色梗",
  "武器梗",
  "地图梗",
  "操作梗",
  "社区梗",
  "赛事梗",
  "二创梗",
  "其他",
] as const;
const sourceTypes = ["official", "guide", "community", "video", "forum", "unknown"] as const;
const sourceReliability = ["high", "medium", "low"] as const;

const sourceSchema = z
  .object({
    title: z.string().min(1),
    url: z.string().url().optional(),
    noPublicLinkReason: z.string().optional(),
    platform: z.string().min(1),
    sourceType: z.enum(sourceTypes),
    supports: z.array(z.string().min(1)).min(1),
    reliability: z.enum(sourceReliability),
    checkedAt: z.coerce.date(),
    notes: z.string().min(1),
  })
  .refine((source) => Boolean(source.url || source.noPublicLinkReason), {
    message: "source must include url or noPublicLinkReason",
  });

const dishes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/dishes" }),
  schema: z
    .object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      map: z.enum(mapThemeNames),
      category: z.enum(dishCategories),
      relatedCharacter: z.array(z.string()),
      relatedWeapon: z.array(z.string()).default([]),
      relatedOperation: z.array(z.string()).default([]),
      memeType: z.enum(memeTypes),
      credibility: z.enum(credibilityLevels),
      image: z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        credit: z.string().min(1),
        license: z.string().min(1),
      }),
      tags: z.array(z.string()).min(1),
      sources: z.array(sourceSchema),
      status: z.enum(dishStatuses),
      publishStatus: z.enum(publishStatuses),
      curator: z.string().min(1),
      summary: z.string().min(1),
      dishIntro: z.string().min(1),
      memeOrigin: z.string().min(1),
      dishSetting: z.string().min(1),
      playerComment: z.string().min(1),
      pairingNote: z.string().min(1),
      verificationNote: z.string().min(1),
      priceLabel: z.string().min(1),
      spiceLevel: z.number().int().min(0).max(5),
      recommendedPairing: z.string().min(1),
      updatedAt: z.coerce.date(),
    })
    .superRefine((dish, context) => {
      if ((dish.status === "verified" || dish.status === "mixed") && dish.sources.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "verified or mixed dishes require at least one source",
          path: ["sources"],
        });
      }

      if (dish.status === "verified" && dish.sources.some((source) => source.reliability === "low")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "verified dishes cannot rely on low-reliability sources",
          path: ["sources"],
        });
      }

      if (dish.publishStatus !== "draft" && !dish.image.license) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "published or review dishes need image license notes",
          path: ["image", "license"],
        });
      }

      if (dish.publishStatus === "published" && dish.status === "rejected") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "rejected dishes cannot be published",
          path: ["publishStatus"],
        });
      }
    }),
});

export const collections = { dishes };
