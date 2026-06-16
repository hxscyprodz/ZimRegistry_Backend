import {
  ActionSectionRows,
  Interactive,
  InteractiveActionSection,
  ReplyButtonObject,
} from "../../../types/types";
import {
  MAIN_MENU_REPLY_ID,
  VIEW_BOOKING_MENU_REPLY_ID,
  FEATURE_COMING_SOON_REPLY_ID,
} from "../../../constants";

export const MainMenuRows: ActionSectionRows[] = [
  {
    id: MAIN_MENU_REPLY_ID.birth_certificate_application,
    title: "Birth Certificate",
    description: "Initial registration and application for standard civil birth records.",
  },
  {
    id: MAIN_MENU_REPLY_ID.national_id_application,
    title: "National ID",
    description: "First-time issuance processing for citizens aged 16 and above.",
  },
  {
    id: MAIN_MENU_REPLY_ID.application_tracking,
    title: "Track My Booking",
    description: "Real-time status tracking of submitted civil registry applications.",
  },
];

export const MainMenuSections: InteractiveActionSection[] = [
  {
    title: "Main Menu",
    rows: MainMenuRows,
  },
];

export const TrackApplication: ActionSectionRows[] = [
  {
    id: VIEW_BOOKING_MENU_REPLY_ID.cancel,
    title: "Cancel",
    description: "Cancel your existing appointment",
  },
  {
    id: VIEW_BOOKING_MENU_REPLY_ID.reschedule,
    title: "Reschedule",
    description: "Change your appointment date or time",
  },
];

export const FeatureComingSoon: ActionSectionRows [] = [
    {
        id: FEATURE_COMING_SOON_REPLY_ID.back_to_main_menu,
        title: "Back to Main Menu",
        description: "Return to the main menu",
    }
]

export const FeatureComingSoonSections: InteractiveActionSection [] = [
    {
        title: "Coming Soon",
        rows: FeatureComingSoon,
    }
]


export const ViewBookingMenuSections: InteractiveActionSection[] = [
  {
    title: "Manage Booking",
    rows: TrackApplication,
  },
];