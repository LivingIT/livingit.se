# Story 3.7: Gate Buy Ticket Button on saleIsOpen

Status: done

## Story

As a **visitor**,
I want the "Buy ticket" button to reflect whether ticket sales are actually open,
so that I am not misled into attempting a purchase that cannot proceed.

## Acceptance Criteria

1. **Given** an event with `price.saleIsOpen === false`, **When** the event detail page loads, **Then** the "Buy ticket" button is rendered as disabled and its label says the ticket sale is not open (in the event's language).
2. **Given** an event with `price.saleIsOpen === true`, **When** the event detail page loads, **Then** the "Buy ticket" button is rendered as active and fully functional — no change to the existing purchase flow.
3. **Given** an event with no `price` field (free event), **When** the event detail page loads, **Then** the form behaves exactly as before — `saleIsOpen` gating applies only when a price exists.
4. **Given** the disabled state, **When** a visitor views the button, **Then** the button is visually distinguishable from the active state (dimmed/greyed) and is not clickable.
5. **Given** both Swedish and English events, **When** `saleIsOpen === false`, **Then** the "sale not open" label is displayed in the correct language via i18n.

## Tasks / Subtasks

- [x] Add i18n key `form.saleClosed` to `src/i18n/sv.ts` and `src/i18n/en.ts` (AC: #1, #5)
  - [x] sv: `'Biljettförsäljningen är stängd'`
  - [x] en: `'Sale is closed'`
- [x] Update `RegistrationForm.astro` to compute `saleIsOpen` and pass it to the template (AC: #1–#3)
  - [x] Add `const saleIsOpen = event.price?.saleIsOpen ?? true;` in Astro frontmatter
  - [x] Add `data-sale-is-open={String(saleIsOpen)}` to the `#registration-form` root div
  - [x] In the `data-state="paid-initial"` block, conditionally render either: active button (saleIsOpen) or disabled button + "sale not open" text (AC: #1, #4)
- [x] Verify `npm run build` passes with zero TypeScript errors

## Dev Notes

### Files to Touch

| File | Change |
|------|--------|
| `src/i18n/sv.ts` | Add `form.saleClosed` key |
| `src/i18n/en.ts` | Add `form.saleClosed` key |
| `src/components/RegistrationForm.astro` | Gate the buy button on `saleIsOpen` |

**Do NOT touch:** `src/types/api.ts` — `price.saleIsOpen: boolean` already exists in the `ApiEvent` interface.

### Type Already Exists

`src/types/api.ts` already defines `saleIsOpen` as part of `ApiEvent.price`:

```typescript
price?: {
  ticketPrice: number;
  vatAmount: number;
  vatPercentage: number;
  minimumTicketsForInvoicing: number;
  saleIsOpen: boolean;  // ← already there
};
```

No type changes required.

### i18n: Add One Key to Both Locale Files

Add `saleClosed` under the `form` namespace in both files. The `Translations` type is derived from `sv.ts` (`export type Translations = typeof sv`) — adding the key there automatically enforces it in `en.ts` via TypeScript.

```typescript
// src/i18n/sv.ts — add inside the `form` object
saleClosed: 'Biljettförsäljningen är stängd',

// src/i18n/en.ts — add inside the `form` object
saleClosed: 'Sale is closed',
```

### RegistrationForm.astro — Frontmatter Change

Add after the existing computed vars (around line 14–16):

```typescript
const saleIsOpen = event.price?.saleIsOpen ?? true;
```

`?? true` ensures free events (no `price` field) are never blocked — the `hasPrice` guard already protects the buy-button section.

### RegistrationForm.astro — Root Div Data Attribute

Add to the `#registration-form` div (alongside the existing `data-has-price`, etc.):

```astro
data-sale-is-open={String(saleIsOpen)}
```

This allows client-side JS to know the sale state if needed in future enhancements. It also makes the intent explicit in the DOM.

### RegistrationForm.astro — Template Change (paid-initial block)

Current code (lines ~60–71):

```astro
{hasPrice && (
  <div data-state="paid-initial" hidden>
    <div class="button-group button-group--vertical">
      <button type="button" class="button" id="btn-buy-ticket">
        {t.form.buyTicket}
      </button>
      <button type="button" class="button button--secondary" id="btn-have-code">
        {t.form.haveCode}
      </button>
    </div>
  </div>
)}
```

Replace with:

```astro
{hasPrice && (
  <div data-state="paid-initial" hidden>
    <div class="button-group button-group--vertical">
      {saleIsOpen ? (
        <button type="button" class="button" id="btn-buy-ticket">
          {t.form.buyTicket}
        </button>
      ) : (
        <button type="button" class="button button--disabled" disabled aria-disabled="true">
          {t.form.saleClosed}
        </button>
      )}
      <button type="button" class="button button--secondary" id="btn-have-code">
        {t.form.haveCode}
      </button>
    </div>
  </div>
)}
```

The "I have a code" button (`btn-have-code`) is always rendered — it is for participants who already hold a referral code/ticket and need to access the registration form. Only the "Buy ticket" button is replaced when the sale is closed.

### CSS for disabled button

The project uses `var(--color-*)` tokens. Add `.button--disabled` scoped style in `RegistrationForm.astro` if it does not already exist. Check `src/styles/globals.css` and existing `<style>` block in `RegistrationForm.astro` first — reuse any existing disabled/muted button class before adding a new one.

Suggested style if none exists:

```css
.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

The `disabled` HTML attribute already prevents interaction; the class provides the visual cue.

### No JS Changes Required

The `data-state="paid-initial"` div is shown by client JS on init. Since the buy button is now rendered inside a conditional branch, the JS will still reveal the `paid-initial` div — it will simply show the disabled button instead of the active one. No JS state machine changes needed.

If `saleIsOpen` is false, the `btn-buy-ticket` element does not exist in the DOM, so JS code referencing `document.getElementById('btn-buy-ticket')` will return `null`. Verify that no JS code throws on this null reference. The existing JS pattern should use optional chaining or null-check before attaching click handlers.

### Referral Code / "Have Code" Path

The `btn-have-code` button is **always rendered**, regardless of `saleIsOpen`. A participant who already purchased (or received) a referral code needs to be able to enter it to access the registration form. The sale being closed only blocks *new* ticket purchases — it does not block existing code-holders from registering.

### Key Pattern References

- **Where buy button lives:** `src/components/RegistrationForm.astro`, inside `{hasPrice && (<div data-state="paid-initial" hidden>...)}`
- **i18n pattern:** `t.form.buyTicket` (existing) → `t.form.saleClosed` (new, same namespace)
- **Data attribute pattern:** `data-has-price={String(hasPrice)}` → add `data-sale-is-open={String(saleIsOpen)}` in the same div
- **Disabled ARIA pattern:** `disabled` attribute + `aria-disabled="true"` for full accessibility compliance (WCAG 2.1 AA)

### Previous Story Intelligence

From story 3.2 (RegistrationForm build):
- All state rendering inside `RegistrationForm.astro` is driven by `data-state="*"` divs with `hidden` attribute — client JS manages which one is visible
- Computed props (`hasPrice`, `hasFoodOptions`, etc.) are derived in Astro frontmatter, not inline in the template

From story 3.6 (last completed story):
- `saleIsOpen` was not yet used anywhere in the codebase — this is the first consumer
- `ApiEvent.price.saleIsOpen` was added to `src/types/api.ts` in prior work (no story associated); always read from the live API response

### References

- **Type source:** `src/types/api.ts` — `ApiEvent.price.saleIsOpen: boolean`
- **Button location:** `src/components/RegistrationForm.astro` ~line 60
- **i18n files:** `src/i18n/sv.ts`, `src/i18n/en.ts`
- **i18n type:** `src/i18n/sv.ts` — `export type Translations = typeof sv`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_No issues encountered._

### Completion Notes List

- Added `form.saleClosed` i18n key to both `sv.ts` and `en.ts`.
- Added `const saleIsOpen = event.price?.saleIsOpen ?? true;` in RegistrationForm.astro frontmatter (`?? true` ensures free events are unaffected).
- Added `data-sale-is-open` data attribute to `#registration-form` root div.
- Replaced static buy-ticket button with conditional render: active `btn-buy-ticket` when `saleIsOpen`, or a `disabled` / `aria-disabled` button showing `t.form.saleClosed` when false.
- Reused existing `.button:disabled` CSS (opacity 0.6, cursor not-allowed) — no new class needed.
- JS null-safety confirmed: `btn-buy-ticket` click handler uses `?.addEventListener` so no error when element is absent.
- `btn-have-code` always rendered regardless of `saleIsOpen` (code-holder path unaffected).
- `npm run build` passed with zero TypeScript errors.

### File List

- `src/i18n/sv.ts`
- `src/i18n/en.ts`
- `src/components/RegistrationForm.astro`

## Change Log

- 2026-03-30: Story created — gate Buy Ticket button on `price.saleIsOpen`; disabled state with i18n label when false.
- 2026-03-30: Corrected — "I have a code" button always visible; only Buy Ticket is disabled. i18n key renamed to `saleClosed` with exact strings: sv `'Biljettförsäljningen är stängd'`, en `'Sale is closed'`.
- 2026-03-30: Implemented — all tasks complete, build passes, story set to review.
