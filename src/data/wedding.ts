/**
 * All guest-facing copy lives here.
 * Bracketed values are placeholders — replace them before sharing the invitation.
 * To restyle the site, edit the palette in src/styles/theme.css.
 */

export type FrameTone = "ivory" | "champagne" | "sage" | "forest" | "gold"
export type FrameSize = "short" | "mid" | "tall"

export type StoryChapter = {
  year: string
  title: string
  text: string
}

export type DetailBlock = {
  id: "ceremony" | "reception" | "venue" | "dress"
  label: string
  primary: string
  secondary: string
  note: string
}

export type ScheduleEvent = {
  time: string
  title: string
  detail: string
}

export type GalleryPhoto = {
  id: string
  year: string
  caption: string
  tone: FrameTone
  size: FrameSize
  /** Set to an image path in /public or an imported URL when photographs are ready. */
  src?: string
}

export const wedding = {
  couple: {
    partnerA: "Tania",
    partnerB: "Ramy",
    conjunction: "&",
    initials: "T & R",
  },
  envelope: {
    preface: "An invitation",
    openLabel: "Open invitation",
    tapLabel: "Tap to open",
    skipLabel: "Skip",
  },
  hero: {
    eyebrow: "Together with their families",
    invite: "We invite you to celebrate our wedding",
    date: "[WEDDING DATE]",
    venue: "[VENUE]",
    city: "[CITY]",
    sideline: "A celebration",
    scroll: "Scroll",
  },
  story: {
    index: "01",
    kicker: "Our journey",
    title: "How we got here",
    intro:
      "A few chapters from the years between meeting and marrying. Replace each note with the memory you want guests to keep.",
    chapters: [
      {
        year: "2019",
        title: "Where it all began",
        text: "[MEMORY]",
      },
      {
        year: "2020",
        title: "First adventures together",
        text: "[MEMORY]",
      },
      {
        year: "2022",
        title: "A new chapter",
        text: "[MEMORY]",
      },
      {
        year: "2024",
        title: "The proposal",
        text: "[MEMORY]",
      },
      {
        year: "2026",
        title: "Our wedding",
        text: "[MEMORY]",
      },
    ] satisfies StoryChapter[],
  },
  details: {
    index: "02",
    kicker: "The wedding",
    title: "For the day itself",
    intro: "Times, place, and what to wear — fill these in when the plans are settled.",
    blocks: [
      {
        id: "ceremony",
        label: "Ceremony",
        primary: "[DATE]",
        secondary: "[TIME]",
        note: "[A LINE ABOUT THE CEREMONY]",
      },
      {
        id: "reception",
        label: "Reception",
        primary: "[DATE]",
        secondary: "[TIME]",
        note: "[A LINE ABOUT THE RECEPTION]",
      },
      {
        id: "venue",
        label: "Venue",
        primary: "[VENUE NAME]",
        secondary: "[ADDRESS]",
        note: "[CITY]",
      },
      {
        id: "dress",
        label: "Dress code",
        primary: "[DRESS CODE]",
        secondary: "",
        note: "[A GENTLE NOTE ON ATTIRE]",
      },
    ] satisfies DetailBlock[],
    venueLink: "See the place",
  },
  venue: {
    index: "03",
    kicker: "The place",
    title: "[VENUE NAME]",
    address: "[ADDRESS]",
    city: "[CITY]",
    note: "[A SENTENCE ABOUT ARRIVING HERE]",
    mapCaption: "[MAP]",
  },
  schedule: {
    index: "04",
    kicker: "The day",
    title: "Order of the celebration",
    intro: "A quiet outline of the hours. Replace each time when the day is set.",
    events: [
      { time: "[TIME]", title: "Arrival", detail: "[GUESTS ARE WELCOMED]" },
      { time: "[TIME]", title: "Ceremony", detail: "[THE CEREMONY BEGINS]" },
      { time: "[TIME]", title: "Cocktails", detail: "[A PAUSE BETWEEN]" },
      { time: "[TIME]", title: "Dinner", detail: "[DINNER IS SERVED]" },
      { time: "[TIME]", title: "Dancing", detail: "[THE EVENING OPENS]" },
    ] satisfies ScheduleEvent[],
  },
  gallery: {
    index: "05",
    kicker: "Memories",
    title: "Fragments we love",
    intro:
      "Photographs will live in these frames. Until then, each one holds a place for a moment you choose.",
    photos: [
      { id: "m1", year: "2019", caption: "[MEMORY]", tone: "sage", size: "tall" },
      { id: "m2", year: "2020", caption: "[MEMORY]", tone: "champagne", size: "short" },
      { id: "m3", year: "2022", caption: "[MEMORY]", tone: "ivory", size: "mid" },
      { id: "m4", year: "2024", caption: "[MEMORY]", tone: "forest", size: "tall" },
      { id: "m5", year: "2026", caption: "[MEMORY]", tone: "gold", size: "mid" },
      { id: "m6", year: "[YEAR]", caption: "[MEMORY]", tone: "sage", size: "short" },
    ] as GalleryPhoto[],
  },
  rsvp: {
    index: "06",
    kicker: "Reply",
    title: "Will you join us?",
    intro: "Kindly let us know by [RSVP DATE].",
    nameLabel: "Your name",
    emailLabel: "Email",
    attendanceLabel: "Attendance",
    acceptLabel: "Joyfully accepts",
    declineLabel: "Regretfully declines",
    guestsLabel: "Number of guests",
    messageLabel: "A note",
    messagePlaceholder: "A wish, a dietary note, a song…",
    submitLabel: "Send reply",
    disclaimer:
      "Replies are kept on this device until sending is connected.",
    successTitle: "Thank you",
    successAccept: "Your acceptance is saved on this device.",
    successDecline: "Your regrets are saved on this device. You will be missed.",
    changeLabel: "Change reply",
  },
  closing: {
    kicker: "With love",
    line: "Thank you for sharing this day with us.",
  },
  nav: [
    { href: "#story", label: "Story" },
    { href: "#details", label: "Details" },
    { href: "#venue", label: "Place" },
    { href: "#schedule", label: "Day" },
    { href: "#gallery", label: "Memories" },
    { href: "#rsvp", label: "RSVP" },
  ],
}
