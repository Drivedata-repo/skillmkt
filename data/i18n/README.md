# Product catalog translations

`catalog-text.json` contains authored English and Spanish translations, keyed by the exact Portuguese source phrase. Each value is `[English, Spanish]`. This covers all 137 skill titles, categories, pains, capabilities and requirements, all five journeys, ten fictional examples, release notices, tool descriptors and derived catalog notices. Add new phrases in both languages when changing the source catalog.

`lib/catalog-i18n.cjs` exposes `localizeCatalog(catalog, locale)` and `translateCatalogText(text, locale)`. Supported locale roots are `pt`, `en` and `es`; regional variants normalize to their root. Portuguese returns the original catalog. Other locales return a new object and never mutate the source. First-use prompts and acceptance statements are constructed in the selected language using translated deliverables.

Localized cards add `categoryKey`, preserving the Portuguese category for artwork lookup while `category` contains the translated display label. IDs, codes, roles, audience enums, version identifiers, dates, hashes, filenames, links, numeric values and executable formulas remain unchanged. Fictional input and result narratives are translated together. The cleanup example intentionally keeps its `pt-BR` numeric input format because locale parsing is part of what the example teaches.

These translations describe the product and its examples. They do not rewrite the downloadable original skill sources or claim execution, compatibility, licensing or legal clearance beyond the Portuguese source. Original source languages can vary by skill.
