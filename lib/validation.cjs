const { z } = require("zod");
const { CATEGORIES, SOLUTIONS } = require("../dist/catalog.js");
const skills = require("../dist/skills.js");
const text = (n) => z.string().trim().max(n).default("");
const context = z.object({
  audience: z.enum(["business", "technical"]),
  pain: z.string().trim().min(20).max(2000),
  area: z.enum(["", ...CATEGORIES.map((x) => x.id)]).default(""),
  systems: text(300),
  impact: text(500),
  urgency: text(100),
  size: text(100),
  budget: text(150),
});
const lead = z.object({
  requestId: z.uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  company: z.string().trim().min(2).max(150),
  phone: text(40),
  context,
  solutions: z.array(z.enum(SOLUTIONS.map((x) => x.id))).max(22),
  skillIds: z
    .array(z.enum(skills.map((x) => x.id)))
    .max(137)
    .default([]),
  consent: z.literal(true),
  website: z.literal("").default(""),
});
module.exports = { context, lead };
