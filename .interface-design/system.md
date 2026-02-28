# SecurePay Checkout Interface System

## Direction & Feel
- Experience mirrors un terminal boutique: marfil mate, grafito y acentos verde sello bancario.
- Typography: Geist for sans, Geist Mono for numeric microcopy; uppercase tracking for labels.
- Layout splits dossier fijo (resumen de producto) y formulario modular en tarjetas suaves.

## Depth Strategy
- Whisper borders only (rgba/low-opacity) between elevation levels; avoid shadows excepto en cards principales (sm: 0 1px 3px, 0 4px 12px at 6% opacity).
- Inputs usan `--control-bg` ligeramente más oscuro que `--surface-0` para efecto inset.

## Spacing Scale
- Base unit: 4px.
- Micro gaps (icons/labels): 4–8px.
- Component padding (inputs/cards): 16–24px.
- Section separation: 32–48px.

## Token Reminders
- Canvas/surfaces: `--canvas`, `--surface-0`, `--surface-1`, `--surface-2`, `--control-bg` (papel cálido).
- Text hierarchy: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted`, `--text-green`.
- Borders: `--border-subtle`, `--border-default`, `--border-strong`.

## Reusable Patterns
- **Form Infrastructure:** React Hook Form + Yup wrapped via `withCheckoutForm`. Dynamic config objects supply `{ name, component, placeholder, section, style }` for each field.
- **TextField:** Rounded-2xl, uppercase label, background `var(--control-bg)`, focus border negro.
- **AutocompleteField:** Same visual language + floating list (max-height 48) sharing border tokens; default to 5 suggestions.
- **Checkout Layout:** Two-column grid (summary card + form card) from `md:` upward, sticky CTA bar only on mobile via `.sticky-bottom-bar` helper.
- **Step Header:** Wizard uses store `ui.step` to color connectors (`var(--text-green)` for active, `var(--border-default)` inactive).

## Usage Notes
- CTA buttons prefer negro grafito (`#020617`) con texto blanco; maintain pill radius (24px+).
- Autocomplete datasets (countries/cities) viven en `modules/checkout/presentation/constants` y deben devolver `{ label, value, helper }`.
- Cuando se agreguen nuevos formularios, reutilizar config/HOC y tokens para coherencia.
