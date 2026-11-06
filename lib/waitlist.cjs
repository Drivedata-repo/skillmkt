const { z } = require("zod");
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((x) => x.toLowerCase()),
  audience: z.enum(["business", "technical"]),
  interest: z.enum(["spreadsheets", "bi", "product", "content", "explore"]),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});
function validateWaitlist(raw) {
  return schema.parse(raw);
}
module.exports = { validateWaitlist };
