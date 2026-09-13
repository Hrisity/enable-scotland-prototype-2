# Enable Scotland App UI Specification

React Native implementation guide for the Enable Scotland journey-support app prototype.

Last updated: 13 September 2026

## 1. Product UI Intent

The app should feel calm, direct, and highly supportive. It is for people who may need extra confidence while travelling, so the interface must prioritise clear choices, large touch targets, plain language, predictable navigation, and accessibility.

The current prototype is a mobile-first app with five primary areas:

- Home
- My Journeys
- SOS
- Help
- Settings

The React Native app should preserve the same flow and hierarchy as the prototype while using native iOS and Android interaction patterns where appropriate.

## 2. Design Principles

- Keep core actions visible from the main screens.
- Use simple words and short labels.
- Avoid hidden functionality except where the interaction is intentionally native, such as swipe-to-delete.
- Support one-handed use with large controls and generous spacing.
- Keep emergency actions visually distinct and immediately recognisable.
- Design every state for offline use.
- Meet WCAG 2.2 AA colour contrast where possible, with high-contrast theme support.

## 3. Brand And Theme Tokens

The app supports multiple colour palettes. The default theme follows Enable Scotland brand colours from the current prototype.

### 3.1 Enable Standard

| Token | Value | Usage |
| --- | --- | --- |
| `primary` | `#4C16B3` | Primary buttons, selected states, active journey surfaces |
| `primaryLight` | `#F1EEFF` | Soft backgrounds and secondary surfaces |
| `primaryDark` | `#28066A` | Navigation bar and strong headings |
| `accent` | `#CC007A` | Active badges, progress accents, highlights |
| `accentLight` | `#FCE7F4` | Soft accent backgrounds |
| `support` | `#227E91` | Supporting information and secondary highlights |
| `supportLight` | `#E7F6F8` | Supporting surface background |
| `nav` | `#28066A` | Bottom navigation background |
| `navText` | `#FFFFFF` | Text and icons on nav |
| `badge` | `#CC007A` | Status badges |

### 3.2 Ocean Blue

| Token | Value |
| --- | --- |
| `primary` | `#1565C0` |
| `primaryLight` | `#E3F0FF` |
| `primaryDark` | `#0D47A1` |
| `accent` | `#FF8F00` |
| `accentLight` | `#FFF8E1` |
| `support` | `#005F8A` |
| `supportLight` | `#E8F5FB` |
| `nav` | `#1565C0` |
| `navText` | `#FFFFFF` |
| `badge` | `#FF8F00` |

### 3.3 Highland Teal

| Token | Value |
| --- | --- |
| `primary` | `#00695C` |
| `primaryLight` | `#E0F2F0` |
| `primaryDark` | `#004D40` |
| `accent` | `#BF360C` |
| `accentLight` | `#FBE9E7` |
| `support` | `#00695C` |
| `supportLight` | `#E0F2F0` |
| `nav` | `#00695C` |
| `navText` | `#FFFFFF` |
| `badge` | `#BF360C` |

### 3.4 High Contrast

| Token | Value |
| --- | --- |
| `primary` | `#000000` |
| `primaryLight` | `#F5F5F5` |
| `primaryDark` | `#000000` |
| `accent` | `#FFD600` |
| `accentLight` | `#FFFDE7` |
| `support` | `#000000` |
| `supportLight` | `#F5F5F5` |
| `nav` | `#000000` |
| `navText` | `#FFD600` |
| `badge` | `#FFD600` |

## 4. Layout Tokens

### 4.1 Spacing

Use an 8-point spacing system.

| Token | Value | Usage |
| --- | --- | --- |
| `space-1` | `4` | Small icon gaps |
| `space-2` | `8` | Compact row gaps |
| `space-3` | `12` | Card internal spacing |
| `space-4` | `16` | Screen padding |
| `space-5` | `20` | Section spacing |
| `space-6` | `24` | Large screen groups |
| `space-8` | `32` | Major section breaks |

### 4.2 Radius

The app should use friendly but controlled corners. Cards should not become overly pill-shaped.

| Token | Value | Usage |
| --- | --- | --- |
| `radius-xs` | `4` | Small badges, compact chips |
| `radius-sm` | `6` | Inputs, small controls |
| `radius-md` | `8` | Default buttons and cards |
| `radius-lg` | `12` | Feature cards and media thumbnails |
| `radius-xl` | `16` | Large panels and modals |
| `radius-pill` | `999` | Circular buttons, avatars, pills |

### 4.3 Elevation

Keep shadows subtle.

| Token | Usage |
| --- | --- |
| `shadow-sm` | Latest journey rows and small cards |
| `shadow-md` | Active journey card and floating surfaces |
| `shadow-lg` | Confirmation modals |

## 5. Typography

Preferred font: Atkinson Hyperlegible. If unavailable, use the platform system font.

React Native implementation:

- iOS fallback: `System`
- Android fallback: `sans-serif`
- Support Dynamic Type and font scaling.
- Do not disable user text scaling.

| Style | Size | Weight | Usage |
| --- | ---: | --- | --- |
| Screen title | 20-24 | 800/900 | Main screen headings |
| Section label | 11-12 | 700 | Uppercase labels such as “Latest journeys” |
| Body | 14-16 | 400/500 | General text |
| Card title | 14-16 | 700 | Journey and contact names |
| Helper text | 11-13 | 400/500 | Instructions and descriptions |
| Button | 14-16 | 700/800 | Primary actions |

## 6. Accessibility Requirements

- Minimum touch target: 44 x 44 points.
- All interactive elements need accessible labels.
- Buttons must expose roles as `button`.
- Links must expose roles as `link`.
- Tab navigation must announce selected state.
- Support VoiceOver and TalkBack.
- Preserve logical reading order from top to bottom.
- Use native focus order; avoid absolute positioning for core content.
- Provide text alternatives for journey images where the title is known.
- Do not rely on colour alone for status. Use text labels such as “Active journey” and “In progress”.
- Provide high contrast theme option.

## 7. App Shell

### 7.1 Top Area

The prototype uses a compact app header with Enable Scotland branding. The online/offline indicator has been removed and should not be implemented.

### 7.2 Bottom Navigation

Five navigation items:

- Home
- Journeys
- SOS
- Help
- Settings

The SOS tab is a prominent red circular centre action. It should remain accessible from anywhere in the main app.

## 8. Screen Specifications

### 8.1 Home

The Home screen starts directly with journey content. There is no greeting hero.

Content order:

1. Active Journey card
2. Latest journeys
3. Actions

Active Journey card:

- Full-width card.
- Journey image at top if available.
- Label: `ACTIVE JOURNEY`.
- Journey title.
- Current step indicator, for example `Step 2 of 4`.
- Progress bar using theme accent.
- Tap opens the pre-journey checklist before opening the journey.

Latest journeys:

- Section heading: `Latest journeys`.
- `View all` button opens My Journeys.
- Show three most recent non-active journeys.
- Each row includes image thumbnail, journey title, step count, and chevron.
- Tapping a journey opens the pre-journey checklist first.

Actions:

- `New Journey`: opens the create journey wizard.
- `Checklist`: opens editable checklist screen.
- Do not include Get Help, SOS, or reminders as home action tiles.

### 8.2 Editable Checklist

Purpose: allow the user to manage the checklist that appears before journeys begin.

Default checklist items:

- Keys
- Ticket or travel card
- Phone charged
- Umbrella or coat
- Support contact card

Required UI:

- Header: `Edit journey checklist`.
- Editable text input for each checklist item.
- Remove control for each item.
- Add item action.
- Saved checklist automatically loads before starting any journey.

### 8.3 Pre-Journey Checklist

This screen appears after tapping a journey and before the journey detail opens.

Required UI:

- Journey image.
- Journey title.
- Heading: `Before you go`.
- Checklist items with check controls.
- Primary button: `Start Journey`.

The checklist should be editable from Home, but on this screen the user is checking off items for the current journey start.

### 8.4 My Journeys

Required UI:

- List of saved journeys.
- Journey image thumbnail.
- Journey title.
- Step count or current progress text.
- In-progress badge only where relevant.
- Create New Journey button.

Do not show:

- Journey date.
- Transport type.
- Upcoming status indicator.

Tapping a journey opens the pre-journey checklist before the journey detail.

### 8.5 Journey Detail

Required UI:

- Journey title.
- Journey image.
- In-progress badge when applicable.
- Step count.
- Progress bar.
- Ordered journey step list.
- Current step highlighted.
- Media controls on the current step only:
  - Photo
  - Voice
  - Note
- Step-level media previews:
  - Image thumbnail preview.
  - Voice message preview or waveform.
  - Note preview text.
- Final action: `Complete Journey`.

Do not include:

- SOS button at the end of the journey.
- Journey notes section.
- Separate media section outside steps.
- Percentage label for progress.

### 8.6 Create Journey Wizard

The create journey flow has three steps.

Step 1: Journey Image

- User can add or choose a journey image.
- Show preview thumbnails in the prototype and live app.
- Example use case: a photo of Edinburgh for a journey to Edinburgh.

Step 2: Journey Name

- Text input for journey name.
- Example placeholder: `e.g. Trip to Edinburgh`.
- Do not collect dates.
- Do not collect transport type.

Step 3: Journey Steps

- User can add multiple journey steps.
- Each step has a text input.
- Each step supports:
  - Add Photo
  - Add Voice
  - Add Note
- Show previews for added photo, voice, and note content.
- User can add another step.
- Primary action saves the journey.

### 8.7 SOS Screen

Purpose: provide emergency support and access to emergency contacts.

Required UI:

- Large SOS button.
- Supporting text explaining that SOS alerts emergency contacts.
- Emergency Contacts section.
- Add contact button.
- Guidance card reminding users to ask a trusted adult, driver, conductor, or staff member when needed.

Do not include:

- Share location option.

### 8.8 Emergency Contact Card

Each emergency contact card must include:

- Initial avatar.
- Name.
- Phone number.
- Hint: `Swipe left to delete`.
- Call button.
- Message button.

Delete behaviour:

- The delete action is revealed by swiping left.
- After tapping Delete, show a confirmation modal.
- Modal text: `Delete emergency contact?`
- Modal asks: `Are you sure you want to delete [Name] as an emergency contact?`
- Actions: `Cancel` and `Delete`.

### 8.9 Add Contact

Required UI:

- Header: `Add contact`.
- Button: `Choose from phone contacts`.
- Manual fields:
  - Name
  - Phone number
  - Relationship
- Preview row showing the contact as it will appear.
- Save action.

If contacts permission is declined, manual entry must still work.

### 8.10 Help

The Help screen should contain only:

- FAQ
- Visit Enable Scotland website

Remove tutorials, tips, and other help content from the visible Help screen.

FAQ topics in the prototype:

- What to do if transport is delayed.
- How to add an emergency contact.
- Offline use.
- Adding photos to journeys.
- Changing colour palette.
- Text-to-speech.

### 8.11 Settings

Required settings:

- Colour Theme
- Text-to-Speech

Remove:

- Offline mode toggle.
- Language control.
- Text size control.

The app should still respect system-level text size accessibility settings.

## 9. Component Inventory

React Native components should be reusable and token-driven.

| Component | Purpose |
| --- | --- |
| `AppHeader` | Brand/header area |
| `BottomTabBar` | Main navigation with prominent SOS tab |
| `ActiveJourneyCard` | Active journey summary on Home |
| `JourneyRow` | Latest journey and My Journeys rows |
| `ActionTile` | Home action buttons |
| `ChecklistEditor` | Editable checklist management |
| `ChecklistCheckItem` | Pre-journey checklist item |
| `JourneyStepCard` | Step display on journey detail |
| `StepMediaControls` | Photo, voice, note controls |
| `MediaPreview` | Photo, voice, and note previews |
| `CreateJourneyWizard` | Three-step journey creation flow |
| `EmergencyContactCard` | Swipeable contact row |
| `DeleteContactDialog` | Confirmation modal |
| `ThemeSelector` | Palette selection |
| `TextToSpeechToggle` | TTS setting |

## 10. Native Interaction Notes

- Use React Navigation for stacks and bottom tabs.
- Use `react-native-gesture-handler` and Reanimated for swipe-to-delete.
- Use native modal presentation for delete confirmation.
- Use native image picker/camera APIs for journey and step images.
- Use native audio recording APIs for voice notes.
- Use `Linking.openURL("tel:...")` for calls.
- Use `Linking.openURL("sms:...")` for messages.
- Use platform-safe areas for iOS and Android.

## 11. UI Acceptance Criteria

- Home has no greeting hero, no reminder, no Get Help tile, and no SOS tile.
- Home displays active journey first, then three latest journeys, then actions.
- Journey starts only after showing the pre-journey checklist.
- Journey detail uses `Complete Journey`, not SOS, at the end.
- Create Journey does not ask for dates or transport type.
- Journey image appears during create flow and on journey cards/details.
- Photo, voice, and note media attach to individual steps.
- SOS screen has call and message actions for contacts.
- Emergency contact deletion uses swipe reveal and confirmation.
- Help contains only FAQ and website link.
- Settings contains only colour theme and text-to-speech.
- All key flows work with VoiceOver and TalkBack.
