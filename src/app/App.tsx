import { useState, useRef, type Dispatch, type SetStateAction } from "react";
import {
  Home,
  Map,
  AlertOctagon,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Bell,
  Phone,
  MapPin,
  Camera,
  Mic,
  FileText,
  Check,
  CheckCircle,
  Circle,
  X,
  Volume2,
  VolumeX,
  Globe,
  Type,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  Image,
  Edit3,
  Share2,
  BookOpen,
  Star,
  Train,
  Bus,
  Navigation,
  Clock,
  AlertTriangle,
  Info,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react";

// ── Enable Scotland brand palette ────────────────────────────────────────────

const THEMES = {
  enable: {
    name: "Enable Standard",
    primary: "#4C16B3",
    primaryLight: "#F1EEFF",
    primaryDark: "#28066A",
    accent: "#CC007A",
    accentLight: "#FCE7F4",
    support: "#227E91",
    supportLight: "#E7F6F8",
    nav: "#28066A",
    navText: "#FFFFFF",
    badge: "#CC007A",
  },
  blue: {
    name: "Ocean Blue",
    primary: "#1565C0",
    primaryLight: "#E3F0FF",
    primaryDark: "#0D47A1",
    accent: "#FF8F00",
    accentLight: "#FFF8E1",
    support: "#005F8A",
    supportLight: "#E8F5FB",
    nav: "#1565C0",
    navText: "#FFFFFF",
    badge: "#FF8F00",
  },
  teal: {
    name: "Highland Teal",
    primary: "#00695C",
    primaryLight: "#E0F2F0",
    primaryDark: "#004D40",
    accent: "#BF360C",
    accentLight: "#FBE9E7",
    support: "#00695C",
    supportLight: "#E0F2F0",
    nav: "#00695C",
    navText: "#FFFFFF",
    badge: "#BF360C",
  },
  contrast: {
    name: "High Contrast",
    primary: "#000000",
    primaryLight: "#F5F5F5",
    primaryDark: "#000000",
    accent: "#FFD600",
    accentLight: "#FFFDE7",
    support: "#000000",
    supportLight: "#F5F5F5",
    nav: "#000000",
    navText: "#FFD600",
    badge: "#FFD600",
  },
};

type ThemeKey = keyof typeof THEMES;
type Screen =
  | "home"
  | "journeys"
  | "checklist-edit"
  | "journey-prep"
  | "journey-detail"
  | "journey-new"
  | "safety"
  | "help"
  | "settings"
  | "faq"
  | "tutorial"
  | "contacts";

// ── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_JOURNEYS = [
  {
    id: 1,
    title: "Glasgow Central to Edinburgh Waverley",
    type: "Train",
    status: "active",
    steps: [
      { id: 1, text: "Leave home and walk to bus stop on Main Street", done: true },
      { id: 2, text: "Take Bus 38 to Glasgow Central Station", done: true },
      { id: 3, text: "Go to platform 11 — check the big board", done: false },
      { id: 4, text: "Board the 14:30 ScotRail train to Edinburgh", done: false },
      { id: 5, text: "Stay on the train — it stops at Edinburgh Waverley", done: false },
      { id: 6, text: "Exit at the main entrance and call support worker", done: false },
    ],
    notes: "Ask a conductor or station staff if you need help.",
    image: "https://images.unsplash.com/photo-1551801841-ecad875a5142?w=400&h=160&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "Weekly Shopping Trip — Tesco Partick",
    type: "Bus",
    status: "upcoming",
    steps: [
      { id: 1, text: "Take Bus 9 from Byres Road stop", done: false },
      { id: 2, text: "Get off at Partick Cross (4 stops)", done: false },
      { id: 3, text: "Walk 2 minutes to Tesco on Dumbarton Road", done: false },
      { id: 4, text: "Use the shopping checklist in your bag", done: false },
      { id: 5, text: "Return bus stop is across the road", done: false },
    ],
    notes: "Your oyster card is in your front pocket.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=160&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "GP Appointment — Woodlands Medical",
    type: "Walk",
    status: "upcoming",
    steps: [
      { id: 1, text: "Walk along Great Western Road — 12 minutes", done: false },
      { id: 2, text: "Enter through the main glass doors", done: false },
      { id: 3, text: "Tell the receptionist your name and appointment time", done: false },
      { id: 4, text: "Wait in the blue chairs by the window", done: false },
    ],
    notes: "Appointment is with Dr Ahmed. You can bring your phone.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=160&fit=crop&auto=format",
  },
  {
    id: 4,
    title: "Visit to Edinburgh Castle",
    type: "Train",
    status: "saved",
    steps: [
      { id: 1, text: "Pack ticket, wallet, phone and support card", done: false },
      { id: 2, text: "Take the train to Edinburgh Waverley", done: false },
      { id: 3, text: "Follow signs to the taxi rank", done: false },
      { id: 4, text: "Ask staff for help if the route feels busy", done: false },
    ],
    notes: "Use the quieter entrance if the main gate is crowded.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=160&fit=crop&auto=format",
  },
];

const SAMPLE_CONTACTS = [
  { id: 1, name: "Sarah (Support Worker)", phone: "07700 900123", relation: "Support Worker" },
  { id: 2, name: "Mum", phone: "07700 900456", relation: "Family" },
  { id: 3, name: "Enable Scotland Helpline", phone: "0300 0200 101", relation: "Enable Scotland" },
];

const DEFAULT_PRE_JOURNEY_CHECKLIST = [
  { id: "keys", label: "Keys" },
  { id: "ticket", label: "Ticket or travel card" },
  { id: "phone", label: "Phone charged" },
  { id: "umbrella", label: "Umbrella or coat" },
  { id: "support", label: "Support contact card" },
];

const FAQS = [
  {
    q: "What do I do if my bus or train is delayed?",
    a: "Stay calm and wait. Check the information boards at the stop or station. If you're unsure what to do, use SOS to call or message an emergency contact.",
  },
  {
    q: "How do I add an emergency contact?",
    a: "Go to Safety tab, tap 'Contacts', then tap the '+' button. You can choose from your phone contacts or type a number manually.",
  },
  {
    q: "Does the app work without internet?",
    a: "Yes! All your journeys and contacts are saved on your phone. You can use the app fully offline — great for when you have poor signal.",
  },
  {
    q: "How do I add photos to my journey?",
    a: "Open a journey, scroll down and tap 'Add Photo'. You can take a new photo or choose one from your camera roll.",
  },
  {
    q: "Can I change the colour palette?",
    a: "Yes — go to Settings and choose the colour theme that feels clearest and easiest to use.",
  },
  {
    q: "What is text-to-speech?",
    a: "Text-to-speech reads the steps of your journey out loud. Turn it on in Settings. Tap any step while on a journey to hear it read aloud.",
  },
];

// ── Small helpers ────────────────────────────────────────────────────────────

function JourneyIcon({ type, size = 16, color }: { type: string; size?: number; color: string }) {
  if (type === "Train") return <Train size={size} color={color} />;
  if (type === "Bus") return <Bus size={size} color={color} />;
  return <Navigation size={size} color={color} />;
}

function StatusBadge({ status, theme }: { status: string; theme: typeof THEMES.enable }) {
  if (status === "active")
    return (
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: theme.accent, color: "#FFFFFF" }}
      >
        IN PROGRESS
      </span>
    );
  return null;
}

// ── Screens ──────────────────────────────────────────────────────────────────

function HomeScreen({
  theme,
  setScreen,
  journeys,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen, extra?: number) => void;
  journeys: typeof SAMPLE_JOURNEYS;
  fontSize: number;
}) {
  const active = journeys.find((j) => j.status === "active");
  const ts = { fontSize };

  return (
    <div className="flex flex-col gap-0">
      <div className="px-4 py-4 flex flex-col gap-4 bg-[#F8F5FC]">
        {/* Active journey card */}
        {active && (
          <button
            onClick={() => setScreen("journey-prep", active.id)}
            className="w-full text-left rounded-2xl overflow-hidden shadow-md"
          >
            {active.image && (
              <img
                src={active.image}
                alt={active.title}
                className="w-full h-20 object-cover"
              />
            )}
            <div
              className="px-3 py-3 flex items-center justify-between"
              style={{ backgroundColor: theme.primary }}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Zap size={11} color={theme.accent} />
                  <span className="text-[10px] font-bold" style={{ color: theme.accent }}>
                    ACTIVE JOURNEY
                  </span>
                </div>
                <p className="text-white font-bold text-sm truncate" style={ts}>
                  {active.title}
                </p>
                <p className="text-white/70 text-[11px]">
                  Step {active.steps.filter((s) => s.done).length + 1} of {active.steps.length}
                </p>
              </div>
              <ChevronRight size={18} color="white" />
            </div>
            {/* Progress bar */}
            <div className="h-1.5" style={{ backgroundColor: theme.primaryLight }}>
              <div
                className="h-full rounded-r-full"
                style={{
                  backgroundColor: theme.accent,
                  width: `${(active.steps.filter((s) => s.done).length / active.steps.length) * 100}%`,
                }}
              />
            </div>
          </button>
        )}

        {/* Latest journeys */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold text-[#595959] uppercase tracking-wider">
              Latest journeys
            </p>
            <button onClick={() => setScreen("journeys")} className="text-[11px] font-semibold" style={{ color: theme.primary }}>
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {journeys.filter((j) => j.status !== "active").slice(0, 3).map((j) => (
              <button
                key={j.id}
                onClick={() => setScreen("journey-prep", j.id)}
                className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm border border-[#EDE8F4] text-left active:bg-[#F3E8FF] transition-colors"
              >
                {j.image ? (
                  <img src={j.image} alt={j.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: theme.primaryLight }}
                  >
                    <Map size={16} color={theme.primary} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate" style={ts}>
                    {j.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCircle size={10} color="#176C45" />
                    <span className="text-[10px] text-[#4B5563]">
                      {j.steps.length} journey steps
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} color="#C0A8D8" />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <p className="text-[11px] font-bold text-[#595959] uppercase tracking-wider mb-2.5">
            Actions
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                icon: Plus,
                label: "New Journey",
                sub: "Plan where you are going",
                screen: "journey-new" as Screen,
                bg: theme.primary,
                fg: "#FFFFFF",
              },
              {
                icon: CheckCircle,
                label: "Checklist",
                sub: "Review saved journey tasks",
                screen: "checklist-edit" as Screen,
                bg: theme.primaryLight,
                fg: theme.primary,
              },
            ].map(({ icon: Icon, label, sub, screen: s, bg, fg }) => (
              <button
                key={label}
                onClick={() => setScreen(s)}
                className="flex flex-col gap-2 rounded-2xl p-3 text-left active:scale-95 transition-transform"
                style={{ backgroundColor: bg }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${fg}22` }}
                >
                  <Icon size={18} color={fg} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: fg, ...ts }}>
                    {label}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: `${fg}BB` }}>
                    {sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneysScreen({
  theme,
  journeys,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  journeys: typeof SAMPLE_JOURNEYS;
  setScreen: (s: Screen, extra?: number) => void;
  fontSize: number;
}) {
  const ts = { fontSize };
  const [swipedContactId, setSwipedContactId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const contactToDelete = contacts.find((contact) => contact.id === confirmDeleteId);

  const revealDelete = (id: number) => setSwipedContactId(id);
  const handlePointerUp = (id: number, x: number) => {
    if (dragStartX != null && dragStartX - x > 36) {
      revealDelete(id);
    }
    setDragStartX(null);
  };
  return (
    <div className="flex flex-col gap-0 bg-[#F8F5FC] min-h-full">
      <div className="px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <h2 className="text-lg font-black text-[#1A1A1A]" style={ts}>My Journeys</h2>
        <p className="text-xs text-[#767676]">Saved on this device</p>
      </div>
      <div className="px-4 pt-3 pb-24 flex flex-col gap-3">
        <button
          onClick={() => setScreen("journey-new")}
          className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm border-2 border-dashed transition-colors active:scale-95"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus size={16} />
          Create New Journey
        </button>
        {journeys.map((j) => (
          <button
            key={j.id}
            onClick={() => setScreen("journey-prep", j.id)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE8F4] text-left active:shadow-md transition-shadow"
          >
            {j.image && (
              <img src={j.image} alt={j.title} className="w-full h-28 object-cover" />
            )}
            <div className="px-3 py-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug" style={ts}>
                    {j.title}
                  </p>
                </div>
                <StatusBadge status={j.status} theme={theme} />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle size={10} color="#176C45" />
                  <span className="text-[10px] text-[#176C45]">
                    {j.steps.filter((s) => s.done).length}/{j.steps.length} steps
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function JourneyPrepScreen({
  theme,
  journey,
  checklistItems,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  journey: (typeof SAMPLE_JOURNEYS)[0];
  checklistItems: typeof DEFAULT_PRE_JOURNEY_CHECKLIST;
  setScreen: (s: Screen, extra?: number) => void;
  fontSize: number;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    keys: true,
    phone: true,
  });
  const ts = { fontSize };

  return (
    <div className="relative flex flex-col bg-[#F8F5FC] min-h-full">
      <div className="bg-white border-b border-[#EDE8F4]">
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <button
            onClick={() => setScreen("journeys")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.primaryLight }}
          >
            <ChevronLeft size={16} color={theme.primary} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#767676] font-semibold uppercase tracking-wide">
              Before you go
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A] truncate" style={ts}>
              Journey checklist
            </h2>
          </div>
        </div>
        {journey.image && (
          <img src={journey.image} alt={journey.title} className="w-full h-28 object-cover" />
        )}
      </div>

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        <div className="bg-white rounded-xl border border-[#EDE8F4] p-3">
          <p className="text-sm font-bold text-[#1A1A1A]" style={ts}>
            {journey.title}
          </p>
          <p className="text-xs text-[#4B5563] mt-1">
            Check these before opening your journey steps.
          </p>
        </div>

        {checklistItems.map((item) => {
          const isChecked = checked[item.id] ?? false;
          return (
            <button
              key={item.id}
              onClick={() => setChecked((prev) => ({ ...prev, [item.id]: !isChecked }))}
              className="bg-white rounded-xl border border-[#EDE8F4] px-3 py-3 flex items-center gap-3 text-left"
            >
              {isChecked ? (
                <CheckCircle size={20} color="#176C45" fill="#176C45" />
              ) : (
                <Circle size={20} color={theme.primary} />
              )}
              <span
                className="text-sm font-semibold"
                style={{ color: isChecked ? "#176C45" : "#1A1A1A", ...ts }}
              >
                Don't forget your {item.label.toLowerCase()}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setScreen("journey-detail", journey.id)}
          className="w-full rounded-xl py-3.5 font-bold text-sm text-white active:scale-95 transition-transform"
          style={{ backgroundColor: theme.primary }}
        >
          Start Journey
        </button>
      </div>
    </div>
  );
}

function ChecklistEditScreen({
  theme,
  checklistItems,
  setChecklistItems,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  checklistItems: typeof DEFAULT_PRE_JOURNEY_CHECKLIST;
  setChecklistItems: Dispatch<SetStateAction<typeof DEFAULT_PRE_JOURNEY_CHECKLIST>>;
  setScreen: (s: Screen) => void;
  fontSize: number;
}) {
  const [newItem, setNewItem] = useState("Water bottle");
  const ts = { fontSize };

  const updateItem = (id: string, label: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label } : item))
    );
  };

  const addItem = () => {
    const label = newItem.trim();
    if (!label) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, label },
    ]);
    setNewItem("");
  };

  const removeItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="relative flex flex-col bg-[#F8F5FC] min-h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <button
          onClick={() => setScreen("home")}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <ChevronLeft size={16} color={theme.primary} />
        </button>
        <div>
          <h2 className="text-sm font-black text-[#1A1A1A]" style={ts}>
            Edit journey checklist
          </h2>
          <p className="text-[10px] text-[#767676]">Shown before every journey starts</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {checklistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-[#D8D1E3] p-2.5 flex items-center gap-2">
            <CheckCircle size={18} color="#176C45" className="flex-shrink-0" />
            <input
              value={item.label}
              onChange={(e) => updateItem(item.id, e.target.value)}
              className="flex-1 rounded-lg border border-[#D8D1E3] px-2.5 py-2 text-sm text-[#1A1A1A] outline-none"
              style={{ fontFamily: "inherit" }}
            />
            <button
              onClick={() => removeItem(item.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FFEBE9" }}
              aria-label={`Remove ${item.label}`}
            >
              <X size={14} color="#B42318" />
            </button>
          </div>
        ))}

        <div className="bg-white rounded-xl border border-[#D8D1E3] p-3">
          <label className="text-xs font-bold text-[#4B5563]">
            Add checklist item
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="mt-1 w-full border-2 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none"
              style={{ borderColor: "#D8D1E3", fontFamily: "inherit" }}
              placeholder="e.g. Medication"
            />
          </label>
          <button
            onClick={addItem}
            className="mt-3 w-full rounded-xl py-3 font-bold text-sm text-white"
            style={{ backgroundColor: theme.primary }}
          >
            Add to checklist
          </button>
        </div>
      </div>
    </div>
  );
}

function StepMediaPreview({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {items.includes("Photo") && (
        <div className="rounded-lg overflow-hidden border border-[#D8D1E3]">
          <img
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=360&h=140&fit=crop&auto=format"
            alt="Step photo preview"
            className="w-full h-20 object-cover"
          />
        </div>
      )}
      {items.includes("Voice") && (
        <div className="rounded-lg border border-[#D8D1E3] bg-[#F7F6F9] px-2.5 py-2 flex items-center gap-2">
          <Mic size={13} color="#4C16B3" />
          <div className="flex-1 flex items-end gap-0.5 h-5" aria-hidden="true">
            {[8, 14, 10, 18, 12, 16, 9, 13, 19, 11, 15, 8].map((height, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-[#4C16B3]"
                style={{ height }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#4B5563]">0:18</span>
        </div>
      )}
      {items.includes("Note") && (
        <div className="rounded-lg border border-[#D8D1E3] bg-[#FFF4D6] px-2.5 py-2">
          <p className="text-[10px] font-bold text-[#7A4B00]">Note preview</p>
          <p className="text-[11px] text-[#4B5563]">
            Ask staff for help if the platform changes.
          </p>
        </div>
      )}
    </div>
  );
}

function JourneyDetailScreen({
  theme,
  journey,
  setScreen,
  tts,
  fontSize,
  onToggleStep,
}: {
  theme: typeof THEMES.enable;
  journey: (typeof SAMPLE_JOURNEYS)[0];
  setScreen: (s: Screen) => void;
  tts: boolean;
  fontSize: number;
  onToggleStep: (journeyId: number, stepId: number) => void;
}) {
  const ts = { fontSize };
  const done = journey.steps.filter((s) => s.done).length;
  const progress = (done / journey.steps.length) * 100;
  const currentStep = journey.steps[done] ?? journey.steps[journey.steps.length - 1];
  const [stepMedia, setStepMedia] = useState<Record<number, string[]>>(() => ({
    [currentStep.id]: ["Photo", "Voice", "Note"],
  }));
  const addStepMedia = (stepId: number, type: string) => {
    setStepMedia((prev) => ({
      ...prev,
      [stepId]: Array.from(new Set([...(prev[stepId] ?? []), type])),
    }));
  };

  return (
    <div className="relative flex flex-col bg-[#F8F5FC] min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8F4]">
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <button
            onClick={() => setScreen("journeys")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.primaryLight }}
          >
            <ChevronLeft size={16} color={theme.primary} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#767676] font-semibold uppercase tracking-wide">
              Journey
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A] truncate" style={ts}>
              {journey.title}
            </h2>
          </div>
          <StatusBadge status={journey.status} theme={theme} />
        </div>
        {journey.image && (
          <img src={journey.image} alt={journey.title} className="w-full h-24 object-cover" />
        )}
        {/* Progress */}
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#1A1A1A]">
              Step {Math.min(done + 1, journey.steps.length)} of {journey.steps.length}
            </span>
          </div>
          <div className="h-2 bg-[#EDE8F4] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: theme.primary }}
            />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex flex-col gap-2 mb-4">
          {journey.steps.map((step, i) => {
            const isCurrent = !step.done && i === done;
            return (
              <div
                key={step.id}
                className="flex items-start gap-3 rounded-xl px-3 py-3 text-left w-full transition-all active:scale-98"
                style={{
                  backgroundColor: step.done
                    ? "#F0FAF2"
                    : isCurrent
                    ? theme.primaryLight
                    : "#FFFFFF",
                  border: `1.5px solid ${
                    step.done ? "#B8E6C0" : isCurrent ? theme.primary : "#EDE8F4"
                  }`,
                }}
              >
                <button
                  onClick={() => onToggleStep(journey.id, step.id)}
                  className="flex-shrink-0 mt-0.5"
                  aria-label={step.done ? "Mark step incomplete" : "Mark step complete"}
                >
                  {step.done ? (
                    <CheckCircle size={20} color="#186830" fill="#186830" />
                  ) : (
                    <Circle
                      size={20}
                      color={isCurrent ? theme.primary : "#C0A8D8"}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                    />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug font-medium"
                    style={{
                      color: step.done ? "#186830" : isCurrent ? theme.primary : "#767676",
                      textDecoration: step.done ? "line-through" : "none",
                      ...ts,
                    }}
                  >
                    {step.text}
                  </p>
                  {isCurrent && (
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={10} color={theme.accent} />
                      <span className="text-[10px] font-bold" style={{ color: theme.accent }}>
                        Current step
                      </span>
                    </div>
                  )}
                  {tts && isCurrent && (
                    <div
                      className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full w-fit"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Volume2 size={9} color="white" />
                      <span className="text-[9px] text-white font-semibold">Tap to hear</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="mt-2 rounded-lg border border-[#D8D1E3] bg-white p-2">
                      <p className="text-[10px] font-bold text-[#4B5563] mb-1">
                        Add media to this step
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { icon: Camera, label: "Photo" },
                          { icon: Mic, label: "Voice" },
                          { icon: FileText, label: "Note" },
                        ].map(({ icon: Icon, label }) => (
                          <button
                            key={label}
                            onClick={() => addStepMedia(step.id, label)}
                            className="flex items-center justify-center gap-1 rounded-md border border-[#D8D1E3] bg-[#FBFAFC] px-1.5 py-1.5 text-[10px] font-bold"
                            style={{ color: theme.primary }}
                          >
                            <Icon size={11} />
                            {label}
                          </button>
                        ))}
                      </div>
                      {(stepMedia[step.id] ?? []).length > 0 && (
                        <p className="mt-1.5 text-[10px] text-[#4B5563]">
                          Attached to step {i + 1}: {(stepMedia[step.id] ?? []).join(", ")}
                        </p>
                      )}
                      <StepMediaPreview items={stepMedia[step.id] ?? []} />
                    </div>
                  )}
                  {!isCurrent && <StepMediaPreview items={stepMedia[step.id] ?? []} />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setScreen("journeys")}
          className="w-full rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-sm text-white active:scale-95 transition-transform"
          style={{ backgroundColor: "#176C45" }}
        >
          <CheckCircle size={16} />
          Complete Journey
        </button>
      </div>
    </div>
  );
}

function NewJourneyScreen({
  theme,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen) => void;
  fontSize: number;
}) {
  const [step, setStep] = useState(0);
  const journeyImages = [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=180&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=180&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=180&fit=crop&auto=format",
  ];
  const [journeyImage, setJourneyImage] = useState(journeyImages[0]);
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([
    { text: "", media: [] as string[] },
    { text: "", media: [] as string[] },
  ]);
  const ts = { fontSize };

  const addStep = () => setSteps([...steps, { text: "", media: [] }]);
  const updateStep = (i: number, v: string) => {
    const copy = [...steps];
    copy[i] = { ...copy[i], text: v };
    setSteps(copy);
  };
  const addMediaToDraftStep = (i: number, type: string) => {
    const copy = [...steps];
    copy[i] = { ...copy[i], media: Array.from(new Set([...copy[i].media, type])) };
    setSteps(copy);
  };

  const wizardSteps = [
    { title: "Journey Image", sub: "Add a picture so the journey is easy to recognise." },
    { title: "Journey Name", sub: "What are you calling this journey?" },
    { title: "Journey Steps", sub: "What are the steps to follow?" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F8F5FC]">
      <div className="bg-white border-b border-[#EDE8F4] px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => (step === 0 ? setScreen("journeys") : setStep(step - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.primaryLight }}
          >
            <ChevronLeft size={16} color={theme.primary} />
          </button>
          <div>
            <p className="text-[10px] text-[#767676] font-semibold uppercase tracking-wide">
              New Journey · Step {step + 1} of 3
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A]" style={ts}>
              {wizardSteps[step].title}
            </h2>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {wizardSteps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-all"
              style={{ backgroundColor: i <= step ? theme.primary : "#EDE8F4" }}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex-1">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#595959]" style={ts}>{wizardSteps[0].sub}</p>
            <div className="bg-white rounded-xl border border-[#D8D1E3] overflow-hidden">
              <img
                src={journeyImage}
                alt="Journey image preview"
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <p className="text-xs font-bold text-[#1A1A1A]">Journey image preview</p>
                <p className="text-[11px] text-[#4B5563]">
                  In the real app this would use camera roll access or a new photo.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {journeyImages.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setJourneyImage(img)}
                  className="rounded-xl border-2 overflow-hidden"
                  style={{ borderColor: journeyImage === img ? theme.primary : "#D8D1E3" }}
                  aria-label={`Choose journey image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-14 object-cover" />
                </button>
              ))}
            </div>
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-[#D8D1E3] bg-white py-3 text-sm font-bold"
              style={{ color: theme.primary }}
            >
              <Image size={16} />
              Upload journey image
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#595959]" style={ts}>{wizardSteps[1].sub}</p>
            <input
              className="w-full border-2 rounded-xl px-3 py-3 text-sm text-[#1A1A1A] outline-none"
              style={{ borderColor: title ? theme.primary : "#EDE8F4", fontFamily: "inherit" }}
              placeholder="e.g. Trip to Edinburgh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <div className="bg-[#FFF3E0] rounded-xl px-3 py-2.5 flex gap-2">
              <Info size={14} color="#E65100" className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#E65100] leading-relaxed">
                Choose a clear name so you can find this journey easily later.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[#595959]" style={ts}>{wizardSteps[2].sub}</p>
            {steps.map((s, i) => (
              <div key={i} className="rounded-xl border border-[#D8D1E3] bg-white p-2.5">
                <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white"
                  style={{ backgroundColor: s.text ? theme.primary : "#C0A8D8" }}
                >
                  {i + 1}
                </div>
                <input
                  className="flex-1 border-2 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none"
                  style={{ borderColor: s.text ? theme.primary : "#EDE8F4", fontFamily: "inherit" }}
                  placeholder={`Step ${i + 1}...`}
                  value={s.text}
                  onChange={(e) => updateStep(i, e.target.value)}
                />
                </div>
                <div className="ml-8 mt-2 grid grid-cols-3 gap-1.5">
                  {[
                    { icon: Camera, label: "Photo" },
                    { icon: Mic, label: "Voice" },
                    { icon: FileText, label: "Note" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => addMediaToDraftStep(i, label)}
                      className="flex items-center justify-center gap-1 rounded-md border border-[#D8D1E3] bg-[#FBFAFC] px-1.5 py-1.5 text-[10px] font-bold"
                      style={{ color: theme.primary }}
                    >
                      <Icon size={11} />
                      {label}
                    </button>
                  ))}
                </div>
                {s.media.length > 0 && (
                  <p className="ml-8 mt-1.5 text-[10px] text-[#4B5563]">
                    Attached to step {i + 1}: {s.media.join(", ")}
                  </p>
                )}
                <div className="ml-8">
                  <StepMediaPreview items={s.media} />
                </div>
              </div>
            ))}
            <button
              onClick={addStep}
              className="flex items-center gap-2 py-2 text-sm font-semibold"
              style={{ color: theme.primary }}
            >
              <Plus size={15} />
              Add another step
            </button>
          </div>
        )}
      </div>

      <div className="px-4 pb-24 pt-2">
        <button
          onClick={() => (step < 2 ? setStep(step + 1) : setScreen("journeys"))}
          disabled={step === 1 && !title.trim()}
          className="w-full rounded-2xl py-3.5 font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: theme.primary }}
        >
          {step < 2 ? "Continue" : "Save Journey"}
        </button>
      </div>
    </div>
  );
}

function SafetyScreen({
  theme,
  contacts,
  setScreen,
  onRemoveContact,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  contacts: typeof SAMPLE_CONTACTS;
  setScreen: (s: Screen) => void;
  onRemoveContact: (id: number) => void;
  fontSize: number;
}) {
  const ts = { fontSize };

  return (
    <div className="flex flex-col bg-[#F8F5FC] min-h-full">
      {/* SOS big button */}
      <div
        className="px-4 pt-5 pb-5 flex flex-col items-center gap-3"
        style={{ background: "linear-gradient(160deg, #B71C1C 0%, #C62828 100%)" }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-white/80 text-xs font-semibold" style={ts}>
            Press if you need immediate help
          </p>
          <button
            className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform border-4 border-white/30"
            aria-label="SOS Emergency Button"
          >
            <div className="flex flex-col items-center">
              <AlertOctagon size={32} color="#C62828" />
              <span className="text-[#C62828] font-black text-xl leading-none mt-1">SOS</span>
            </div>
          </button>
          <p className="text-white/70 text-[11px] max-w-[180px] leading-relaxed">
            Pressing SOS will alert your emergency contacts.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 flex flex-col gap-4">
        {/* Emergency contacts */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Shield size={13} color={theme.primary} />
              <span className="text-[11px] font-bold text-[#595959] uppercase tracking-wider">
                Emergency Contacts
              </span>
            </div>
            <button
              className="text-[11px] font-semibold flex items-center gap-1"
              style={{ color: theme.primary }}
              onClick={() => setScreen("contacts")}
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="relative overflow-hidden rounded-xl border border-[#EDE8F4] bg-[#B42318]"
              >
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    onClick={() => setConfirmDeleteId(c.id)}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#B42318]"
                  >
                    Delete
                  </button>
                </div>
                <div
                  className="relative bg-white px-3 py-2.5 flex items-center gap-2 transition-transform"
                  style={{
                    transform: swipedContactId === c.id ? "translateX(-82px)" : "translateX(0)",
                  }}
                  onPointerDown={(event) => setDragStartX(event.clientX)}
                  onPointerUp={(event) => handlePointerUp(c.id, event.clientX)}
                  onDoubleClick={() => revealDelete(c.id)}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate" style={ts}>
                      {c.name}
                    </p>
                    <p className="text-[10px] text-[#767676] font-mono">{c.phone}</p>
                    <p className="text-[9px] text-[#767676]">Swipe left to delete</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#E8F5EC" }}
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone size={14} color="#186830" />
                  </a>
                  <a
                    href={`sms:${c.phone}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.primaryLight }}
                    aria-label={`Message ${c.name}`}
                  >
                    <MessageSquare size={14} color={theme.primary} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidance */}
        <div
          className="rounded-2xl px-4 py-3 flex gap-3"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <MessageSquare size={15} color={theme.primary} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold" style={{ color: theme.primaryDark }}>
              Remember
            </p>
            <p className="text-xs leading-relaxed" style={{ color: theme.primaryDark }}>
              If you need help on a journey, ask a bus driver, train conductor, station staff member,
              or any trusted adult nearby.
            </p>
          </div>
        </div>
      </div>
      {contactToDelete && (
        <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-4 shadow-2xl border border-[#D8D1E3]">
            <h3 className="text-base font-black text-[#1A1A1A]" style={ts}>
              Delete emergency contact?
            </h3>
            <p className="text-xs text-[#4B5563] mt-2">
              Are you sure you want to delete {contactToDelete.name} as an emergency contact?
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-[#D8D1E3] py-2.5 text-sm font-bold"
                style={{ color: theme.primary }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRemoveContact(contactToDelete.id);
                  setConfirmDeleteId(null);
                  setSwipedContactId(null);
                }}
                className="rounded-xl py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: "#B42318" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactsScreen({
  theme,
  setScreen,
  onAddContact,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen) => void;
  onAddContact: (contact: { name: string; phone: string; relation: string }) => void;
  fontSize: number;
}) {
  const [name, setName] = useState("Aisha (Support Worker)");
  const [phone, setPhone] = useState("07700 900789");
  const [relation, setRelation] = useState("Support Worker");
  const ts = { fontSize };

  const save = () => {
    if (!name.trim() || !phone.trim()) return;
    onAddContact({ name, phone, relation });
    setScreen("safety");
  };

  return (
    <div className="flex flex-col bg-[#F8F5FC] min-h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <button
          onClick={() => setScreen("safety")}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <ChevronLeft size={16} color={theme.primary} />
        </button>
        <div>
          <h2 className="text-sm font-black text-[#1A1A1A]" style={ts}>Add contact</h2>
          <p className="text-[10px] text-[#767676]">Choose from contacts or enter manually</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        <button
          className="bg-white rounded-xl border border-[#D8D1E3] px-4 py-3 flex items-center gap-3 text-left"
          style={{ color: theme.primary }}
        >
          <User size={16} />
          <span className="text-sm font-bold">Choose from phone contacts</span>
        </button>

        <div className="bg-white rounded-xl border border-[#D8D1E3] p-3 flex flex-col gap-3">
          <label className="text-xs font-bold text-[#4B5563]">
            Name
            <input
              className="mt-1 w-full border-2 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none"
              style={{ borderColor: "#D8D1E3", fontFamily: "inherit" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-[#4B5563]">
            Phone number
            <input
              className="mt-1 w-full border-2 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none"
              style={{ borderColor: "#D8D1E3", fontFamily: "inherit" }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-[#4B5563]">
            Relationship
            <input
              className="mt-1 w-full border-2 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none"
              style={{ borderColor: "#D8D1E3", fontFamily: "inherit" }}
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
            />
          </label>
        </div>

        <div className="bg-white rounded-xl border border-[#D8D1E3] px-3 py-2.5 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
            style={{ backgroundColor: theme.primary }}
          >
            {name.trim()[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1A1A1A] truncate" style={ts}>{name}</p>
            <p className="text-[10px] text-[#767676] font-mono">{phone}</p>
          </div>
          <span className="text-[10px] font-bold text-[#4B5563]">{relation}</span>
        </div>

        <button
          onClick={save}
          className="w-full rounded-xl py-3.5 font-bold text-sm text-white"
          style={{ backgroundColor: theme.primary }}
        >
          Save contact
        </button>
      </div>
    </div>
  );
}

function HelpScreen({
  theme,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen) => void;
  fontSize: number;
}) {
  const ts = { fontSize };
  return (
    <div className="bg-[#F8F5FC] min-h-full">
      <div className="px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <h2 className="text-lg font-black text-[#1A1A1A]" style={ts}>Help & Guidance</h2>
        <p className="text-xs text-[#767676]">FAQs and Enable Scotland support</p>
      </div>
      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {[
          {
            icon: HelpCircle,
            title: "Frequently Asked Questions",
            sub: "Common questions and answers",
            screen: "faq" as Screen,
            color: "#6B21A8",
            bg: "#F3E8FF",
          },
          {
            icon: ExternalLink,
            title: "Enable Scotland Website",
            sub: "Visit enable.org.uk for more support",
            screen: null,
            color: "#00695C",
            bg: "#E0F2F0",
            href: "https://www.enable.org.uk",
          },
        ].map(({ icon: Icon, title, sub, screen: s, color, bg, href }) => {
          const content = (
            <>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon size={18} color={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1A1A1A]" style={ts}>{title}</p>
                <p className="text-xs text-[#767676]">{sub}</p>
              </div>
              <ChevronRight size={16} color="#C0A8D8" />
            </>
          );

          return href ? (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="bg-white rounded-2xl border border-[#EDE8F4] px-4 py-4 flex items-center gap-3 text-left active:bg-[#F3E8FF] transition-colors"
            >
              {content}
            </a>
          ) : (
            <button
            key={title}
            onClick={() => s && setScreen(s)}
            className="bg-white rounded-2xl border border-[#EDE8F4] px-4 py-4 flex items-center gap-3 text-left active:bg-[#F3E8FF] transition-colors"
          >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FAQScreen({
  theme,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen) => void;
  fontSize: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const ts = { fontSize };
  return (
    <div className="flex flex-col bg-[#F8F5FC] min-h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <button
          onClick={() => setScreen("help")}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <ChevronLeft size={16} color={theme.primary} />
        </button>
        <div>
          <h2 className="text-sm font-black text-[#1A1A1A]" style={ts}>FAQs</h2>
          <p className="text-[10px] text-[#767676]">Frequently asked questions</p>
        </div>
      </div>
      <div className="px-4 pt-3 pb-24 flex flex-col gap-2">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#EDE8F4] overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-3 text-left gap-2"
            >
              <p className="text-sm font-semibold text-[#1A1A1A] flex-1 leading-snug" style={ts}>
                {faq.q}
              </p>
              {open === i ? (
                <ChevronUp size={14} color={theme.primary} className="flex-shrink-0" />
              ) : (
                <ChevronDown size={14} color="#C0A8D8" className="flex-shrink-0" />
              )}
            </button>
            {open === i && (
              <div
                className="px-3 pb-3 pt-0 text-xs text-[#595959] leading-relaxed border-t border-[#EDE8F4]"
                style={ts}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TutorialScreen({
  theme,
  setScreen,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  setScreen: (s: Screen) => void;
  fontSize: number;
}) {
  const ts = { fontSize };
  const tutorials = [
    { title: "Getting Started", duration: "2 min", done: true },
    { title: "Creating Your First Journey", duration: "3 min", done: true },
    { title: "Using the Checklist", duration: "2 min", done: false },
    { title: "Adding Emergency Contacts", duration: "2 min", done: false },
    { title: "Sharing Your Location", duration: "1 min", done: false },
    { title: "Accessibility Options", duration: "2 min", done: false },
  ];
  return (
    <div className="flex flex-col bg-[#F8F5FC] min-h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <button
          onClick={() => setScreen("help")}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <ChevronLeft size={16} color={theme.primary} />
        </button>
        <div>
          <h2 className="text-sm font-black text-[#1A1A1A]" style={ts}>Tutorials</h2>
          <p className="text-[10px] text-[#767676]">
            {tutorials.filter((t) => t.done).length} of {tutorials.length} complete
          </p>
        </div>
      </div>
      <div className="px-4 pt-3 pb-24 flex flex-col gap-2.5">
        {tutorials.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#EDE8F4] px-3 py-3 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: t.done ? "#E8F5EC" : theme.primaryLight }}
            >
              {t.done ? (
                <CheckCircle size={18} color="#186830" />
              ) : (
                <BookOpen size={16} color={theme.primary} />
              )}
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: t.done ? "#186830" : "#1A1A1A", ...ts }}
              >
                {t.title}
              </p>
              <p className="text-[10px] text-[#767676]">{t.duration} read</p>
            </div>
            <button
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: t.done ? "#E8F5EC" : theme.primary,
                color: t.done ? "#186830" : "#FFFFFF",
              }}
            >
              {t.done ? "Done" : "Start"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({
  theme,
  themeKey,
  setThemeKey,
  tts,
  setTts,
  fontSize,
}: {
  theme: typeof THEMES.enable;
  themeKey: ThemeKey;
  setThemeKey: (k: ThemeKey) => void;
  tts: boolean;
  setTts: (v: boolean) => void;
  fontSize: number;
}) {
  const ts = { fontSize };

  const Toggle = ({
    value,
    onChange,
    label,
    sub,
    icon: Icon,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
    sub: string;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center gap-3 py-3 border-b border-[#EDE8F4] last:border-0">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: theme.primaryLight }}
      >
        <Icon size={15} color={theme.primary} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1A1A1A]" style={ts}>{label}</p>
        <p className="text-[10px] text-[#767676]">{sub}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
        style={{ backgroundColor: value ? theme.primary : "#C0A8D8" }}
        aria-pressed={value}
      >
        <div
          className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm"
          style={{ left: value ? "26px" : "2px" }}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-[#F8F5FC] min-h-full">
      <div className="px-4 pt-4 pb-3 bg-white border-b border-[#EDE8F4]">
        <h2 className="text-lg font-black text-[#1A1A1A]" style={ts}>Settings</h2>
        <p className="text-xs text-[#767676]">Personalise your experience</p>
      </div>

      <div className="px-4 pt-4 pb-24 flex flex-col gap-4">
        {/* Colour theme */}
        <div>
          <p className="text-[11px] font-bold text-[#595959] uppercase tracking-wider mb-2.5">
            Colour Theme
          </p>
          <div className="bg-white rounded-2xl border border-[#EDE8F4] p-3 grid grid-cols-2 gap-2">
            {(Object.entries(THEMES) as [ThemeKey, typeof THEMES.enable][]).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setThemeKey(key)}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 border-2 transition-all"
                style={{
                  borderColor: themeKey === key ? t.primary : "#EDE8F4",
                  backgroundColor: themeKey === key ? t.primaryLight : "#FAFAFA",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 border border-white/50"
                  style={{ backgroundColor: t.primary }}
                />
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: themeKey === key ? t.primary : "#767676" }}
                >
                  {t.name}
                </span>
                {themeKey === key && (
                  <CheckCircle size={13} color={t.primary} className="ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <p className="text-[11px] font-bold text-[#595959] uppercase tracking-wider mb-2.5">
            Accessibility
          </p>
          <div className="bg-white rounded-2xl border border-[#EDE8F4] px-4">
            <Toggle
              value={tts}
              onChange={setTts}
              label="Text-to-Speech"
              sub="Read journey steps out loud"
              icon={Volume2}
            />
          </div>
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl border border-[#EDE8F4] px-4 py-3 flex items-center gap-3">
          <div className="bg-[#6B21A8] rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs">en</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A]">Enable Scotland App</p>
            <p className="text-[10px] text-[#767676]">Version 1.0.0 · All data stored locally</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("enable");
  const [screen, setScreen] = useState<Screen>("home");
  const [activeJourneyId, setActiveJourneyId] = useState<number | null>(null);
  const [tts, setTts] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const [journeys, setJourneys] = useState(SAMPLE_JOURNEYS);
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS);
  const [checklistItems, setChecklistItems] = useState(DEFAULT_PRE_JOURNEY_CHECKLIST);

  const theme = THEMES[themeKey];

  const navigate = (s: Screen, extra?: number) => {
    if ((s === "journey-detail" || s === "journey-prep") && extra != null) {
      setActiveJourneyId(extra);
    }
    setScreen(s);
  };

  const toggleStep = (journeyId: number, stepId: number) => {
    setJourneys((prev) =>
      prev.map((j) =>
        j.id === journeyId
          ? {
              ...j,
              steps: j.steps.map((st) =>
                st.id === stepId ? { ...st, done: !st.done } : st
              ),
            }
          : j
      )
    );
  };

  const activeJourney = journeys.find((j) => j.id === activeJourneyId) ?? journeys[0];
  const addContact = (contact: { name: string; phone: string; relation: string }) => {
    setContacts((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((c) => c.id)) + 1,
        ...contact,
      },
    ]);
  };
  const removeContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const NAV_TABS = [
    { id: "home" as Screen, icon: Home, label: "Home" },
    { id: "journeys" as Screen, icon: Map, label: "Journeys" },
    { id: "safety" as Screen, icon: AlertOctagon, label: "Safety", sos: true },
    { id: "help" as Screen, icon: HelpCircle, label: "Help" },
    { id: "settings" as Screen, icon: Settings, label: "Settings" },
  ];

  const isSubScreen = ["checklist-edit", "journey-prep", "journey-detail", "journey-new", "faq", "tutorial", "contacts"].includes(screen);
  const mainTab = isSubScreen
    ? screen.startsWith("journey")
      ? "journeys"
      : "help"
    : screen;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D0057] via-[#4C0099] to-[#1A0035] p-4 sm:p-8"
      style={{ fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif" }}
    >
      {/* Phone frame */}
      <div className="relative w-full max-w-[375px] mx-auto">
        {/* Outer shell */}
        <div
          className="relative rounded-[44px] shadow-2xl overflow-hidden border-[5px]"
          style={{
            borderColor: "#1a1a2e",
            background: "#F8F5FC",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* Notch */}
          <div className="bg-black h-7 flex items-center justify-center relative z-10">
            <div className="w-28 h-5 bg-black rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 border-b border-x border-[#1a1a2e]" />
            <div className="absolute right-5 top-1.5 flex items-center gap-1.5">
              <span className="text-[8px] text-[#AAAAAA] font-mono">14:32</span>
            </div>
          </div>

          {/* Screen content — scrollable */}
          <div className="overflow-y-auto" style={{ height: "680px" }}>
            {/* App header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 sticky top-0 z-10"
              style={{ backgroundColor: theme.nav }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-lg px-2 py-1">
                  <span className="font-black text-xs" style={{ color: theme.primary }}>
                    enable
                  </span>
                </div>
                <span className="text-white/80 text-[11px] font-semibold">Scotland</span>
              </div>
              <div className="flex items-center gap-2">
                {tts && <Volume2 size={13} color="rgba(255,255,255,0.7)" />}
              </div>
            </div>

            {/* Screen router */}
            {screen === "home" && (
              <HomeScreen
                theme={theme}
                setScreen={navigate}
                journeys={journeys}
                fontSize={fontSize}
              />
            )}
            {screen === "journeys" && (
              <JourneysScreen
                theme={theme}
                journeys={journeys}
                setScreen={navigate}
                fontSize={fontSize}
              />
            )}
            {screen === "checklist-edit" && (
              <ChecklistEditScreen
                theme={theme}
                checklistItems={checklistItems}
                setChecklistItems={setChecklistItems}
                setScreen={navigate}
                fontSize={fontSize}
              />
            )}
            {screen === "journey-prep" && (
              <JourneyPrepScreen
                theme={theme}
                journey={activeJourney}
                checklistItems={checklistItems}
                setScreen={navigate}
                fontSize={fontSize}
              />
            )}
            {screen === "journey-detail" && (
              <JourneyDetailScreen
                theme={theme}
                journey={activeJourney}
                setScreen={navigate}
                tts={tts}
                fontSize={fontSize}
                onToggleStep={toggleStep}
              />
            )}
            {screen === "journey-new" && (
              <NewJourneyScreen
                theme={theme}
                setScreen={navigate}
                fontSize={fontSize}
              />
            )}
            {screen === "safety" && (
              <SafetyScreen
                theme={theme}
                contacts={contacts}
                setScreen={navigate}
                onRemoveContact={removeContact}
                fontSize={fontSize}
              />
            )}
            {screen === "help" && (
              <HelpScreen theme={theme} setScreen={navigate} fontSize={fontSize} />
            )}
            {screen === "faq" && (
              <FAQScreen theme={theme} setScreen={navigate} fontSize={fontSize} />
            )}
            {screen === "tutorial" && (
              <TutorialScreen theme={theme} setScreen={navigate} fontSize={fontSize} />
            )}
            {screen === "contacts" && (
              <ContactsScreen
                theme={theme}
                setScreen={navigate}
                onAddContact={addContact}
                fontSize={fontSize}
              />
            )}
            {screen === "settings" && (
              <SettingsScreen
                theme={theme}
                themeKey={themeKey}
                setThemeKey={setThemeKey}
                tts={tts}
                setTts={setTts}
                fontSize={fontSize}
              />
            )}
          </div>

          {/* Bottom nav */}
          <div
            className="border-t flex items-end justify-around px-2 pt-2 pb-3"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#EDE8F4" }}
          >
            {NAV_TABS.map(({ id, icon: Icon, label, sos }) =>
              sos ? (
                <button
                  key={id}
                  onClick={() => navigate("safety")}
                  className="-mt-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-transform"
                  style={{ backgroundColor: "#C62828" }}
                  aria-label="SOS Safety"
                >
                  <AlertOctagon size={22} color="white" />
                </button>
              ) : (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors"
                  style={
                    mainTab === id
                      ? { backgroundColor: theme.primaryLight }
                      : undefined
                  }
                >
                  <Icon
                    size={18}
                    color={mainTab === id ? theme.primary : "#9E9E9E"}
                    strokeWidth={mainTab === id ? 2.5 : 1.5}
                  />
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: mainTab === id ? theme.primary : "#9E9E9E" }}
                  >
                    {label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Side label */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          <div className="w-1 h-8 bg-[#1a1a2e] rounded-full" />
          <div className="w-1 h-8 bg-[#1a1a2e] rounded-full" />
        </div>
        <div className="absolute -left-3 top-[30%] -translate-y-1/2">
          <div className="w-1 h-6 bg-[#1a1a2e] rounded-full mb-2" />
          <div className="w-1 h-10 bg-[#1a1a2e] rounded-full mb-2" />
          <div className="w-1 h-10 bg-[#1a1a2e] rounded-full" />
        </div>
      </div>

      {/* Legend below phone */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-center">
        <div className="bg-black/70 backdrop-blur text-white text-[10px] rounded-full px-4 py-2 flex items-center gap-3 flex-wrap justify-center max-w-sm">
          <span className="font-bold text-white/60">PROTOTYPE</span>
          <span>Tap to navigate screens</span>
          <span className="text-white/40">·</span>
          <span>Change theme in Settings</span>
        </div>
      </div>
    </div>
  );
}
