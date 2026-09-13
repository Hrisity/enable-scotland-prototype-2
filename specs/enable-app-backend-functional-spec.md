# Enable Scotland App Backend And Functional Specification

Offline-first React Native implementation guide for the Enable Scotland journey-support app.

Last updated: 13 September 2026

## 1. Scope

This document defines the functional architecture, local data model, permissions, storage, and service behaviour needed to build the current prototype as a production React Native app for iOS and Android.

The app is offline-first. Core journeys, journey steps, checklist items, emergency contacts, media references, and settings must work without internet connectivity.

## 2. Core Technical Assumptions

- Platform: React Native for iOS and Android.
- Navigation: React Navigation.
- Storage: local-first database plus secure local preferences.
- Network dependency: none for core app usage.
- Cloud account: not required.
- Registration data: user name only.
- Mandatory personal data: none beyond the user's chosen name.

Recommended local storage stack:

- SQLite or WatermelonDB for relational journey data.
- Encrypted MMKV or secure SQLite layer for emergency contacts and settings.
- Device filesystem for photos, audio files, and generated thumbnails.
- Keychain/Keystore-backed storage for encryption keys.

## 3. Data Entities

### 3.1 UserProfile

Stores the minimal user profile.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `name` | string | yes | Only required registration field |
| `createdAt` | ISO datetime | yes | Local timestamp |
| `updatedAt` | ISO datetime | yes | Local timestamp |

### 3.2 Journey

Represents a journey created by the user.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `title` | string | yes | Journey name |
| `imageUri` | string | no | Local file URI or bundled sample URI |
| `status` | enum | yes | `saved`, `active`, `completed` |
| `sortOrder` | number | no | Manual ordering if needed |
| `createdAt` | ISO datetime | yes | Local timestamp |
| `updatedAt` | ISO datetime | yes | Local timestamp |
| `startedAt` | ISO datetime | no | Set when journey begins |
| `completedAt` | ISO datetime | no | Set by Complete Journey |

Do not store transport type. Do not require journey dates.

### 3.3 JourneyStep

Represents one ordered step in a journey.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `journeyId` | string | yes | Parent journey |
| `order` | number | yes | Display order |
| `title` | string | yes | Step instruction |
| `isDone` | boolean | yes | Completion state |
| `createdAt` | ISO datetime | yes | Local timestamp |
| `updatedAt` | ISO datetime | yes | Local timestamp |

### 3.4 StepMedia

Stores media attached to a specific journey step.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `stepId` | string | yes | Parent step |
| `type` | enum | yes | `photo`, `voice`, `note` |
| `uri` | string | no | Local file URI for photo/audio |
| `thumbnailUri` | string | no | Local thumbnail for image/video if used |
| `noteText` | string | no | Required for note type |
| `durationMs` | number | no | Audio duration |
| `waveformData` | JSON | no | Optional audio preview data |
| `createdAt` | ISO datetime | yes | Local timestamp |

Media belongs to the current step, not to the journey globally.

### 3.5 ChecklistItem

Represents the editable pre-journey checklist template.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `label` | string | yes | Example: `Keys` |
| `order` | number | yes | Display order |
| `isEnabled` | boolean | yes | Soft hide rather than hard delete if preferred |
| `createdAt` | ISO datetime | yes | Local timestamp |
| `updatedAt` | ISO datetime | yes | Local timestamp |

Default items:

- Keys
- Ticket or travel card
- Phone charged
- Umbrella or coat
- Support contact card

### 3.6 JourneyChecklistState

Stores the checklist state for a specific journey start.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `journeyId` | string | yes | Journey being started |
| `checklistItemId` | string | yes | Source checklist item |
| `labelSnapshot` | string | yes | Copy of label at start time |
| `isChecked` | boolean | yes | User checked state |
| `checkedAt` | ISO datetime | no | Set when checked |
| `createdAt` | ISO datetime | yes | Local timestamp |

Use `labelSnapshot` so an old journey start is not changed if the checklist template is edited later.

### 3.7 EmergencyContact

Stores emergency contacts locally.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Local UUID |
| `name` | string | yes | Contact name |
| `phone` | string | yes | Callable/messageable number |
| `relationship` | string | no | Example: Parent, Support Worker |
| `source` | enum | yes | `manual` or `deviceContacts` |
| `createdAt` | ISO datetime | yes | Local timestamp |
| `updatedAt` | ISO datetime | yes | Local timestamp |

Emergency contacts should be stored securely on the device.

### 3.8 AppSettings

Stores local app preferences.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `themeKey` | enum | yes | `enable`, `blue`, `teal`, `contrast` |
| `textToSpeechEnabled` | boolean | yes | Controls TTS behaviour |
| `hasCompletedOnboarding` | boolean | no | If onboarding is added |
| `updatedAt` | ISO datetime | yes | Local timestamp |

Do not include an offline mode setting. The app is always offline-capable.

## 4. Functional Requirements

### 4.1 Registration

- Ask only for the user's name.
- Store the name locally.
- Do not require email, password, date of birth, address, or cloud account.

### 4.2 Home Data

Home screen needs:

- Active journey, if one exists.
- Three latest non-active journeys.
- Shortcut to all journeys.
- Shortcut to new journey.
- Shortcut to editable checklist.

Backend/service behaviour:

- `getActiveJourney()`
- `getLatestJourneys(limit = 3, excludeActive = true)`
- `getChecklistTemplate()`

### 4.3 Editable Checklist

Users can:

- Edit checklist item text.
- Add a new checklist item.
- Remove a checklist item.
- Reorder items in a future enhancement.

Checklist data must persist locally and load before every journey start.

### 4.4 Starting A Journey

When a user taps a journey:

1. Load the current checklist template.
2. Create or refresh a journey checklist state for that journey start.
3. Show the pre-journey checklist.
4. On `Start Journey`, mark the journey as `active`.
5. Open journey detail.

Only one active journey should be allowed unless the product team explicitly decides otherwise.

### 4.5 Journey Detail

Users can:

- View ordered steps.
- See current step.
- Mark steps complete.
- Add media to the current step.
- Complete the journey.

`Complete Journey` behaviour:

- Set journey `status` to `completed`.
- Set `completedAt`.
- Clear active journey state if this was the active journey.
- Return the user to My Journeys or Home, depending on navigation context.

### 4.6 Create Journey

The create journey flow must collect:

- Journey image.
- Journey name.
- Journey steps.
- Optional media per step.

The create journey flow must not collect:

- Journey dates.
- Transport type.

Service behaviour:

- Save selected image to app-controlled local storage.
- Create the Journey.
- Create ordered JourneyStep records.
- Create StepMedia records for any step-level photo, voice, or note previews.

### 4.7 Step Media

Supported media:

- Photo.
- Voice note.
- Text note.

Photo requirements:

- Capture from camera or select from media library.
- Copy selected file into app-controlled local storage.
- Generate or store a thumbnail URI.
- Attach to the selected step.

Voice requirements:

- Request microphone permission.
- Record audio locally.
- Store duration.
- Optionally generate waveform data for preview.
- Attach to the selected step.

Note requirements:

- Store note text directly in local database.
- Attach to the selected step.

### 4.8 SOS And Emergency Contacts

SOS screen must support:

- Large SOS action.
- Emergency contacts list.
- Call contact.
- Message contact.
- Add contact.
- Delete contact through swipe-left plus confirmation.
- Guidance to ask a trusted adult, driver, conductor, or staff member.

Removed functionality:

- Do not request location permission for the current prototype.
- Do not include share location.

Contact actions:

- Call: open native phone dialler using `tel:`.
- Message: open native SMS composer using `sms:`.

Add contact:

- Request Contacts permission only when the user chooses `Choose from phone contacts`.
- If permission is denied, manual entry must remain available.
- Validate that name and phone number are present before saving.

Delete contact:

- Swipe left reveals Delete.
- Tapping Delete opens confirmation modal.
- Confirming deletes the contact from local secure storage.

### 4.9 Help

Help contains:

- FAQ.
- Visit Enable Scotland website link.

FAQ content can be bundled static content and available offline.

Website link:

- Opens the external website in the device browser or in-app browser.
- Requires network only for the website itself.
- Failure to open should show a friendly error.

### 4.10 Settings

Settings contains:

- Colour Theme.
- Text-to-Speech.

Removed settings:

- Offline mode toggle.
- Language selector.
- Text size selector.

The app must still respect OS-level accessibility text size.

### 4.11 Text-To-Speech

When enabled:

- Journey step text can be read aloud.
- Important instructions may be read aloud on supported screens.
- TTS should stop when navigating away from a screen.

Recommended library:

- `react-native-tts`, or Expo Speech if the app uses Expo.

## 5. Permissions

| Permission | Required? | Trigger | Fallback |
| --- | --- | --- | --- |
| Contacts | Optional | User taps Choose from phone contacts | Manual contact entry |
| Camera | Optional | User taps Add Photo and chooses camera | Select from library or skip |
| Photo / Media Library | Optional | User chooses existing media | Use camera or skip |
| Microphone | Optional | User taps Add Voice | Add note/photo instead |
| Phone/SMS linking | Platform dependent | Call or message contact | Show number to copy if unsupported |

Location permission is not required for the current prototype because share location has been removed.

## 6. Offline Behaviour

The following must work fully offline:

- View Home.
- View active and saved journeys.
- Start a journey.
- Use pre-journey checklist.
- Edit checklist.
- Create and edit journeys.
- Add notes.
- View locally stored photos and audio.
- Record audio if OS permissions allow it.
- View emergency contacts.
- Call or message through native phone/SMS capability where the device supports it.
- Change theme.
- Use text-to-speech if available on device.
- Read FAQ.

External website access is the only feature expected to need internet connectivity.

## 7. Security And Privacy

- Store all journey and contact data locally.
- Do not send journey data to a server.
- Do not require analytics.
- Use encrypted storage for emergency contacts where feasible.
- Keep media inside app-controlled storage.
- Provide delete behaviour for emergency contacts.
- Future production app should include clear privacy copy explaining that data stays on the device.

## 8. Suggested Service Layer

Use a repository/service layer so UI screens do not directly manage database logic.

Suggested modules:

- `UserRepository`
- `JourneyRepository`
- `JourneyStepRepository`
- `StepMediaRepository`
- `ChecklistRepository`
- `EmergencyContactRepository`
- `SettingsRepository`
- `MediaStorageService`
- `AudioRecordingService`
- `TextToSpeechService`
- `PermissionsService`
- `ContactImportService`

## 9. Example App State Shape

```ts
type ThemeKey = "enable" | "blue" | "teal" | "contrast";

type JourneyStatus = "saved" | "active" | "completed";

type StepMediaType = "photo" | "voice" | "note";

type AppSettings = {
  themeKey: ThemeKey;
  textToSpeechEnabled: boolean;
};
```

## 10. Error And Empty States

Required states:

- No active journey.
- No saved journeys.
- No emergency contacts.
- Contacts permission denied.
- Camera permission denied.
- Microphone permission denied.
- Media file missing or deleted by OS.
- Website cannot be opened.
- Failed audio recording.
- Storage write failure.

Error messages should be plain and supportive. Avoid technical wording.

## 11. Testing Requirements

Unit tests:

- Journey creation.
- Journey completion.
- Latest journeys query.
- Active journey query.
- Checklist add/edit/delete.
- Checklist snapshot for journey start.
- Step media attachment.
- Emergency contact add/delete.
- Theme setting persistence.
- TTS setting persistence.

Integration tests:

- Create journey with image, steps, and step media.
- Start journey through checklist.
- Add photo/voice/note to current step.
- Complete journey.
- Add emergency contact manually.
- Delete emergency contact with confirmation.

End-to-end tests:

- Home to journey start flow.
- Home to editable checklist flow.
- Create journey flow.
- SOS contact call/message visibility.
- Settings theme change.

Recommended E2E tooling:

- Detox for React Native.

## 12. Production Acceptance Criteria

- App installs and runs on supported iOS and Android devices released within the last five years.
- App can be opened and used with no internet connection.
- User registration requires only name.
- Home reflects the current prototype hierarchy.
- Journeys can be created without date or transport data.
- Journey steps can store photo, voice, and note media.
- Current-step media appears attached to that step.
- Pre-journey checklist appears before opening a journey.
- Checklist can be edited by the user.
- Emergency contacts can be added manually.
- Device contacts import is optional.
- Contacts can be called and messaged.
- Contacts can be deleted through swipe-left plus confirmation.
- SOS screen does not include location sharing.
- Help contains only FAQ and website link.
- Settings contains only theme and text-to-speech.
- Core data persists after app restart.
- Core data remains available offline.
