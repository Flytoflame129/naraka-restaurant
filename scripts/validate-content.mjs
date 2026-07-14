import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dishesDir = join(root, "src", "content", "dishes");
const menuItemsDir = join(root, "src", "content", "menu-items");
const requiredFields = [
  "title",
  "slug",
  "map",
  "category",
  "relatedCharacter",
  "relatedWeapon",
  "relatedOperation",
  "memeType",
  "credibility",
  "image",
  "tags",
  "sources",
  "status",
  "publishStatus",
  "curator",
];
const requiredMenuItemFields = [
  "title",
  "slug",
  "map",
  "category",
  "description",
  "order",
  "dishIntro",
  "dishSetting",
  "playerComment",
  "recommendedPairing",
  "relatedElements",
  "image",
];
const structuredMenuItemFields = new Set(["relatedElements", "image"]);

const knownMaps = new Set(["聚窟洲", "火罗国", "龙隐洞天"]);
const knownStatuses = new Set(["verified", "pending", "mixed", "rejected"]);
const knownPublishStatuses = new Set(["draft", "published", "needs-review"]);
const knownCategories = new Set(["主食", "小吃", "饮品", "招牌菜", "怪菜", "套餐"]);
const knownCredibility = new Set(["高", "中", "低", "待考证"]);
const knownMemeTypes = new Set([
  "谐音梗",
  "角色梗",
  "武器梗",
  "地图梗",
  "操作梗",
  "社区梗",
  "赛事梗",
  "二创梗",
  "其他",
]);
const knownSourceTypes = new Set(["official", "guide", "community", "video", "forum", "unknown"]);
const knownSourceReliability = new Set(["high", "medium", "low"]);
const requiredSourceFields = ["title", "platform", "sourceType", "supports", "reliability", "checkedAt", "notes"];

function fail(message) {
  console.error(`content validation failed: ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(filePath) {
  const text = readFileSync(filePath, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  const fields = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (field) {
      fields.set(field[1], field[2].trim());
    }
  }
  return { fields, raw: match[1], body: text.slice(match[0].length) };
}

function hasArrayItem(raw, field) {
  const match = raw.match(new RegExp(`^${field}:\\s*\\r?\\n([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z0-9]*:|$)`, "m"));
  return Boolean(match && /^\s*-\s+\S/m.test(match[1]));
}

function hasObjectField(raw, field, child) {
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((line) => line.match(new RegExp(`^${field}:\\s*$`)));
  if (start === -1) {
    return false;
  }

  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][A-Za-z0-9]*:\s*/.test(line)) {
      return false;
    }

    if (new RegExp(`^\\s+${child}:\\s*\\S`).test(line)) {
      return true;
    }
  }

  return false;
}

function sourceBlocks(raw) {
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((line) => /^sources:\s*$/.test(line));
  if (start === -1) {
    return [];
  }

  const sourceLines = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][A-Za-z0-9]*:\s*/.test(line)) {
      break;
    }

    sourceLines.push(line);
  }

  const blocks = [];
  let current = [];
  for (const line of sourceLines) {
    if (/^\s{2}-\s+/.test(line)) {
      if (current.length > 0) {
        blocks.push(current.join("\n"));
      }
      current = [line];
    } else if (current.length > 0) {
      current.push(line);
    }
  }

  if (current.length > 0) {
    blocks.push(current.join("\n"));
  }

  return blocks;
}

function sourceScalar(block, field) {
  const match = block.match(new RegExp(`^\\s*(?:-\\s*)?${field}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
}

function sourceHasField(block, field) {
  if (field === "supports") {
    const supportsMatch = block.match(/^\s*supports:\s*\r?\n([\s\S]*?)(?=\n\s{4}[A-Za-z][A-Za-z0-9]*:|(?![\s\S]))/m);
    return Boolean(supportsMatch && /^\s*-\s+\S/m.test(supportsMatch[1]));
  }

  return new RegExp(`^\\s*(?:-\\s*)?${field}:\\s*\\S`, "m").test(block);
}

function scalar(fields, name) {
  return (fields.get(name) ?? "").replace(/^["']|["']$/g, "");
}

if (!existsSync(dishesDir)) {
  fail("src/content/dishes is missing");
  process.exit();
}

if (!existsSync(menuItemsDir)) {
  fail("src/content/menu-items is missing");
  process.exit();
}

const dishFiles = readdirSync(dishesDir).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
const menuItemFiles = readdirSync(menuItemsDir).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
const expectedMenuCounts = new Map([
  ["聚窟洲", 8],
  ["火罗国", 4],
  ["龙隐洞天", 3],
]);

if (dishFiles.length === 0) {
  fail("at least one dish markdown file is required");
}

for (const file of dishFiles) {
  const filePath = join(dishesDir, file);
  const parsed = parseFrontmatter(filePath);

  if (!parsed) {
    fail(`${file}: missing YAML frontmatter`);
    continue;
  }

  const { fields, raw, body } = parsed;
  for (const field of requiredFields) {
    if (!fields.has(field)) {
      fail(`${file}: missing required field ${field}`);
    }
  }

  const slug = scalar(fields, "slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(`${file}: slug must be lowercase hyphen-case`);
  }

  const map = scalar(fields, "map");
  if (!knownMaps.has(map)) {
    fail(`${file}: map must be one of ${Array.from(knownMaps).join(", ")}`);
  }

  const status = scalar(fields, "status");
  if (!knownStatuses.has(status)) {
    fail(`${file}: status must be one of ${Array.from(knownStatuses).join(", ")}`);
  }

  const publishStatus = scalar(fields, "publishStatus");
  if (!knownPublishStatuses.has(publishStatus)) {
    fail(`${file}: publishStatus must be one of ${Array.from(knownPublishStatuses).join(", ")}`);
  }

  const category = scalar(fields, "category");
  if (!knownCategories.has(category)) {
    fail(`${file}: category must be one of ${Array.from(knownCategories).join(", ")}`);
  }

  const memeType = scalar(fields, "memeType");
  if (!knownMemeTypes.has(memeType)) {
    fail(`${file}: memeType must use the controlled vocabulary`);
  }

  const credibility = scalar(fields, "credibility");
  if (!knownCredibility.has(credibility)) {
    fail(`${file}: credibility must be one of ${Array.from(knownCredibility).join(", ")}`);
  }

  if (publishStatus !== "draft" && !hasArrayItem(raw, "tags")) {
    fail(`${file}: published or review content needs at least one tag`);
  }

  if (publishStatus !== "draft" && !hasArrayItem(raw, "sources")) {
    fail(`${file}: published or review content needs source notes`);
  }

  if (publishStatus !== "draft" && !hasObjectField(raw, "image", "license")) {
    fail(`${file}: image needs a license note`);
  }

  const sources = sourceBlocks(raw);
  sources.forEach((source, index) => {
    for (const field of requiredSourceFields) {
      if (!sourceHasField(source, field)) {
        fail(`${file}: source ${index + 1} missing required field ${field}`);
      }
    }

    if (!sourceHasField(source, "url") && !sourceHasField(source, "noPublicLinkReason")) {
      fail(`${file}: source ${index + 1} needs url or noPublicLinkReason`);
    }

    const sourceType = sourceScalar(source, "sourceType");
    if (sourceType && !knownSourceTypes.has(sourceType)) {
      fail(`${file}: source ${index + 1} sourceType must be one of ${Array.from(knownSourceTypes).join(", ")}`);
    }

    const sourceReliability = sourceScalar(source, "reliability");
    if (sourceReliability && !knownSourceReliability.has(sourceReliability)) {
      fail(`${file}: source ${index + 1} reliability must be one of ${Array.from(knownSourceReliability).join(", ")}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(sourceScalar(source, "checkedAt"))) {
      fail(`${file}: source ${index + 1} checkedAt must be YYYY-MM-DD`);
    }
  });

  if (status === "verified" && sources.some((source) => sourceScalar(source, "reliability") === "low")) {
    fail(`${file}: verified content cannot rely on low-reliability sources`);
  }

  if ((status === "pending" || status === "mixed") && !raw.includes("待考证") && !body.includes("待考证") && !body.includes("资料整理中")) {
    fail(`${file}: pending or mixed content must visibly include 待考证 or 资料整理中`);
  }

  if (publishStatus === "published" && status !== "verified") {
    fail(`${file}: only verified content can be published`);
  }
}

const menuItemSlugs = new Set();
const menuCounts = new Map(Array.from(expectedMenuCounts.keys(), (map) => [map, 0]));

for (const file of menuItemFiles) {
  const parsed = parseFrontmatter(join(menuItemsDir, file));

  if (!parsed) {
    fail(`${file}: missing YAML frontmatter`);
    continue;
  }

  const { fields, raw } = parsed;
  for (const field of requiredMenuItemFields) {
    if (!fields.has(field) || (!structuredMenuItemFields.has(field) && !scalar(fields, field))) {
      fail(`${file}: missing required field ${field}`);
    }
  }

  if (!hasArrayItem(raw, "relatedElements")) {
    fail(`${file}: relatedElements needs at least one item`);
  }

  for (const child of ["src", "alt", "credit", "license"]) {
    if (!hasObjectField(raw, "image", child)) {
      fail(`${file}: image missing required field ${child}`);
    }
  }

  const slug = scalar(fields, "slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(`${file}: slug must be lowercase hyphen-case`);
  } else if (menuItemSlugs.has(slug)) {
    fail(`${file}: duplicate menu item slug ${slug}`);
  }
  menuItemSlugs.add(slug);

  const map = scalar(fields, "map");
  if (!knownMaps.has(map)) {
    fail(`${file}: map must be one of ${Array.from(knownMaps).join(", ")}`);
  } else {
    menuCounts.set(map, menuCounts.get(map) + 1);
  }

  const category = scalar(fields, "category");
  if (!knownCategories.has(category)) {
    fail(`${file}: category must be one of ${Array.from(knownCategories).join(", ")}`);
  }

  const order = Number(scalar(fields, "order"));
  if (!Number.isInteger(order) || order < 1) {
    fail(`${file}: order must be a positive integer`);
  }
}

for (const [map, expectedCount] of expectedMenuCounts) {
  const actualCount = menuCounts.get(map);
  if (actualCount !== expectedCount) {
    fail(`menu item count for ${map} must be ${expectedCount}, received ${actualCount}`);
  }
}

if (!process.exitCode) {
  console.log(
    `content validation passed: ${dishFiles.length} dish file(s), ${menuItemFiles.length} menu item file(s) checked`,
  );
}
