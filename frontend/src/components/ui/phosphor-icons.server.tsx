import React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ArrowCounterClockwise as ArrowCounterClockwisePhosphor,
  ArrowLeft as ArrowLeftPhosphor,
  ArrowRight as ArrowRightPhosphor,
  ArrowSquareOut as ArrowSquareOutPhosphor,
  ArrowsDownUp as ArrowsDownUpPhosphor,
  ArrowsLeftRight as ArrowsLeftRightPhosphor,
  Bank as BankPhosphor,
  BookOpen as BookOpenPhosphor,
  BookOpenText as BookOpenTextPhosphor,
  BookmarkSimple as BookmarkSimplePhosphor,
  Books as BooksPhosphor,
  Bug as BugPhosphor,
  Buildings as BuildingsPhosphor,
  CaretDown as CaretDownPhosphor,
  CaretLeft as CaretLeftPhosphor,
  CaretRight as CaretRightPhosphor,
  CaretUp as CaretUpPhosphor,
  ChartLineUp as ChartLineUpPhosphor,
  ChatTeardropText as ChatTeardropTextPhosphor,
  Check as CheckPhosphor,
  CheckCircle as CheckCirclePhosphor,
  ClockCounterClockwise as ClockCounterClockwisePhosphor,
  Code as CodePhosphor,
  Copy as CopyPhosphor,
  Database as DatabasePhosphor,
  DotsThree as DotsThreePhosphor,
  DotsThreeVertical as DotsThreeVerticalPhosphor,
  Envelope as EnvelopePhosphor,
  Eye as EyePhosphor,
  EyeSlash as EyeSlashPhosphor,
  FacebookLogo as FacebookLogoPhosphor,
  Flag as FlagPhosphor,
  FunnelSimple as FunnelSimplePhosphor,
  Gavel as GavelPhosphor,
  Gear as GearPhosphor,
  Globe as GlobePhosphor,
  GraduationCap as GraduationCapPhosphor,
  Headset as HeadsetPhosphor,
  Heart as HeartPhosphor,
  Highlighter as HighlighterPhosphor,
  IdentificationCard as IdentificationCardPhosphor,
  Info as InfoPhosphor,
  InstagramLogo as InstagramLogoPhosphor,
  Lightbulb as LightbulbPhosphor,
  ArrowsOutLineVertical as ArrowsOutLineVerticalPhosphor,
  List as ListPhosphor,
  ListNumbers as ListNumbersPhosphor,
  Lock as LockPhosphor,
  MagnifyingGlass as MagnifyingGlassPhosphor,
  Megaphone as MegaphonePhosphor,
  Microphone as MicrophonePhosphor,
  Moon as MoonPhosphor,
  MoonStars as MoonStarsPhosphor,
  MusicNote as MusicNotePhosphor,
  Note as NotePhosphor,
  Palette as PalettePhosphor,
  PaperPlaneRight as PaperPlaneRightPhosphor,
  Pencil as PencilPhosphor,
  PersonArmsSpread as PersonArmsSpreadPhosphor,
  PersonSimple as PersonSimplePhosphor,
  Quotes as QuotesPhosphor,
  Share as SharePhosphor,
  Shield as ShieldPhosphor,
  ShieldCheck as ShieldCheckPhosphor,
  Sparkle as SparklePhosphor,
  Sun as SunPhosphor,
  TextAlignLeft as TextAlignLeftPhosphor,
  TextT as TextTPhosphor,
  TextUnderline as TextUnderlinePhosphor,
  Translate as TranslatePhosphor,
  TwitterLogo as TwitterLogoPhosphor,
  User as UserPhosphor,
  Users as UsersPhosphor,
  UsersThree as UsersThreePhosphor,
  WhatsappLogo as WhatsappLogoPhosphor,
  X as XPhosphor,
  YoutubeLogo as YoutubeLogoPhosphor
} from '@phosphor-icons/react/ssr';

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

type MuiIconProps = React.ComponentProps<'svg'> & {
  color?: string;
  size?: number | string;
  weight?: IconWeight;
  mirrored?: boolean;
  sx?: SxProps<Theme>;
  fontSize?: 'inherit' | 'small' | 'medium' | 'large' | number | string;
};

const BoxRoot = Box as React.ComponentType<any>;

const sizeMap: Record<string, number | string> = {
  inherit: '1em',
  small: 20,
  medium: 24,
  large: 35,
};

const coerceSize = (value: unknown): number | string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace('!important', '').trim();
    return sizeMap[cleaned] ?? cleaned;
  }

  return undefined;
};

const makeIcon = (IconComponent: React.ElementType, defaultWeight: IconWeight = 'bold') => {
  const Wrapped = React.forwardRef<SVGSVGElement, MuiIconProps>(
    ({ sx, fontSize, size, color, weight, ...rest }, ref) => {
      const resolvedSize = size ?? coerceSize(fontSize) ?? '1em';

      return (
        <BoxRoot component="span" sx={sx} {...rest}>
          <IconComponent
            ref={ref}
            size={resolvedSize}
            weight={weight ?? defaultWeight}
            color={color ?? 'currentColor'}
          />
        </BoxRoot>
      );
    },
  );

  const iconName =
    (IconComponent as React.ComponentType<any>).displayName
    ?? (IconComponent as React.ComponentType<any>).name
    ?? 'PhosphorIcon';
  Wrapped.displayName = iconName;
  return Wrapped;
};

export const AccessibilityNew = makeIcon(PersonArmsSpreadPhosphor);
export const AccessibilityNewIcon = AccessibilityNew;

export const AccountBalanceOutlined = makeIcon(BankPhosphor);
export const AccountBalanceOutlinedIcon = AccountBalanceOutlined;

export const AccountBox = makeIcon(IdentificationCardPhosphor);
export const AccountBoxIcon = AccountBox;

export const Analytics = makeIcon(ChartLineUpPhosphor);
export const AnalyticsIcon = Analytics;

export const ArchitectureOutlined = makeIcon(BuildingsPhosphor);
export const ArchitectureOutlinedIcon = ArchitectureOutlined;

export const ArrowBack = makeIcon(ArrowLeftPhosphor);
export const ArrowBackIcon = ArrowBack;

export const ArrowBackIosNew = makeIcon(CaretLeftPhosphor);
export const ArrowBackIosNewIcon = ArrowBackIosNew;

export const ArrowForward = makeIcon(ArrowRightPhosphor);
export const ArrowForwardIcon = ArrowForward;

export const ArrowForwardIos = makeIcon(CaretRightPhosphor);
export const ArrowForwardIosIcon = ArrowForwardIos;

export const ArrowRight = makeIcon(ArrowRightPhosphor);
export const ArrowRightIcon = ArrowRight;

export const ArrowDownIcon = makeIcon(CaretDownPhosphor);

export const AutoAwesome = makeIcon(SparklePhosphor);
export const AutoAwesomeIcon = AutoAwesome;

export const AutoAwesomeMotionOutlined = makeIcon(SparklePhosphor);
export const AutoAwesomeMotionOutlinedIcon = AutoAwesomeMotionOutlined;

export const AutoAwesomeOutlined = makeIcon(SparklePhosphor);
export const AutoAwesomeOutlinedIcon = AutoAwesomeOutlined;

export const Bookmark = makeIcon(BookmarkSimplePhosphor, 'fill');
export const BookmarkIcon = Bookmark;

export const BookmarkBorder = makeIcon(BookmarkSimplePhosphor);
export const BookmarkBorderIcon = BookmarkBorder;

export const BookmarkBorderOutlined = makeIcon(BookmarkSimplePhosphor);
export const BookmarkBorderOutlinedIcon = BookmarkBorderOutlined;

export const Brightness4 = makeIcon(MoonPhosphor);
export const Brightness4Icon = Brightness4;

export const Brightness6 = makeIcon(SunPhosphor);
export const Brightness6Icon = Brightness6;

export const Brightness7 = makeIcon(SunPhosphor);
export const Brightness7Icon = Brightness7;

export const BugReport = makeIcon(BugPhosphor);
export const BugReportIcon = BugReport;

export const Business = makeIcon(BuildingsPhosphor);
export const BusinessIcon = Business;

export const Campaign = makeIcon(MegaphonePhosphor);
export const CampaignIcon = Campaign;

export const Check = makeIcon(CheckPhosphor);
export const CheckIcon = Check;

export const CheckCircle = makeIcon(CheckCirclePhosphor);
export const CheckCircleIcon = CheckCircle;

export const ChevronLeft = makeIcon(CaretLeftPhosphor);
export const ChevronLeftIcon = ChevronLeft;

export const ChevronRight = makeIcon(CaretRightPhosphor);
export const ChevronRightIcon = ChevronRight;

export const Clear = makeIcon(XPhosphor);
export const ClearIcon = Clear;

export const ClearOutlined = makeIcon(XPhosphor);
export const ClearOutlinedIcon = ClearOutlined;

export const Close = makeIcon(XPhosphor);
export const CloseIcon = Close;

export const CloseOutlined = makeIcon(XPhosphor);
export const CloseOutlinedIcon = CloseOutlined;

export const Code = makeIcon(CodePhosphor);
export const CodeIcon = Code;

export const ContactMail = makeIcon(EnvelopePhosphor);
export const ContactMailIcon = ContactMail;

export const ContentCopy = makeIcon(CopyPhosphor);
export const ContentCopyIcon = ContentCopy;

export const ContentCopyOutlined = makeIcon(CopyPhosphor);
export const ContentCopyOutlinedIcon = ContentCopyOutlined;

export const Edit = makeIcon(PencilPhosphor);
export const EditIcon = Edit;

export const Email = makeIcon(EnvelopePhosphor);
export const EmailIcon = Email;

export const Facebook = makeIcon(FacebookLogoPhosphor);
export const FacebookIcon = Facebook;

export const Favorite = makeIcon(HeartPhosphor);
export const FavoriteIcon = Favorite;

export const FavoriteBorderRounded = makeIcon(HeartPhosphor);
export const FavoriteBorderRoundedIcon = FavoriteBorderRounded;

export const FavoriteRounded = makeIcon(HeartPhosphor, 'fill');
export const FavoriteRoundedIcon = FavoriteRounded;

export const FilterList = makeIcon(FunnelSimplePhosphor);
export const FilterListIcon = FilterList;

export const FlagOutlined = makeIcon(FlagPhosphor);
export const FlagOutlinedIcon = FlagOutlined;

export const FormatLineSpacing = makeIcon(ArrowsOutLineVerticalPhosphor);
export const FormatLineSpacingIcon = FormatLineSpacing;

export const FormatListNumbered = makeIcon(ListNumbersPhosphor);
export const FormatListNumberedIcon = FormatListNumbered;

export const FormatQuote = makeIcon(QuotesPhosphor);
export const FormatQuoteIcon = FormatQuote;

export const FormatUnderlinedOutlined = makeIcon(TextUnderlinePhosphor);
export const FormatUnderlinedOutlinedIcon = FormatUnderlinedOutlined;

export const Gavel = makeIcon(GavelPhosphor);
export const GavelIcon = Gavel;

export const Highlight = makeIcon(HighlighterPhosphor);
export const HighlightIcon = Highlight;

export const HistoryOutlined = makeIcon(ClockCounterClockwisePhosphor);
export const HistoryOutlinedIcon = HistoryOutlined;

export const Info = makeIcon(InfoPhosphor);
export const InfoIcon = Info;

export const InfoOutlined = makeIcon(InfoPhosphor);
export const InfoOutlinedIcon = InfoOutlined;

export const Instagram = makeIcon(InstagramLogoPhosphor);
export const InstagramIcon = Instagram;

export const IosShare = makeIcon(SharePhosphor);
export const IosShareIcon = IosShare;

export const KeyboardArrowDown = makeIcon(CaretDownPhosphor);
export const KeyboardArrowDownIcon = KeyboardArrowDown;

export const KeyboardArrowRight = makeIcon(CaretRightPhosphor);
export const KeyboardArrowRightIcon = KeyboardArrowRight;

export const KeyboardArrowUp = makeIcon(CaretUpPhosphor);
export const KeyboardArrowUpIcon = KeyboardArrowUp;

export const LibraryBooks = makeIcon(BooksPhosphor);
export const LibraryBooksIcon = LibraryBooks;

export const LightbulbOutlined = makeIcon(LightbulbPhosphor);
export const LightbulbOutlinedIcon = LightbulbOutlined;

export const LocalLibrary = makeIcon(BookOpenPhosphor);
export const LocalLibraryIcon = LocalLibrary;

export const LockOutlined = makeIcon(LockPhosphor);
export const LockOutlinedIcon = LockOutlined;

export const Menu = makeIcon(ListPhosphor);
export const MenuIcon = Menu;

export const MenuBook = makeIcon(BookOpenTextPhosphor);
export const MenuBookIcon = MenuBook;

export const MenuBookOutlined = makeIcon(BookOpenTextPhosphor);
export const MenuBookOutlinedIcon = MenuBookOutlined;

export const MoreHoriz = makeIcon(DotsThreePhosphor);
export const MoreHorizIcon = MoreHoriz;

export const MoreVert = makeIcon(DotsThreeVerticalPhosphor);
export const MoreVertIcon = MoreVert;

export const MusicNote = makeIcon(MusicNotePhosphor);
export const MusicNoteIcon = MusicNote;

export const NavigateNext = makeIcon(CaretRightPhosphor);
export const NavigateNextIcon = NavigateNext;

export const NightlightRound = makeIcon(MoonStarsPhosphor);
export const NightlightRoundIcon = NightlightRound;

export const NoteOutlined = makeIcon(NotePhosphor);
export const NoteOutlinedIcon = NoteOutlined;

export const OpenInNew = makeIcon(ArrowSquareOutPhosphor);
export const OpenInNewIcon = OpenInNew;

export const Palette = makeIcon(PalettePhosphor);
export const PaletteIcon = Palette;

export const People = makeIcon(UsersPhosphor);
export const PeopleIcon = People;

export const PeopleAlt = makeIcon(UsersThreePhosphor);
export const PeopleAltIcon = PeopleAlt;

export const Person = makeIcon(UserPhosphor);
export const PersonIcon = Person;

export const PersonOutline = makeIcon(UserPhosphor);
export const PersonOutlineIcon = PersonOutline;

export const PersonOutlineRounded = makeIcon(UserPhosphor);
export const PersonOutlineRoundedIcon = PersonOutlineRounded;

export const PersonRounded = makeIcon(UserPhosphor);
export const PersonRoundedIcon = PersonRounded;

export const Policy = makeIcon(ShieldCheckPhosphor);
export const PolicyIcon = Policy;

export const PublicOutlined = makeIcon(GlobePhosphor);
export const PublicOutlinedIcon = PublicOutlined;

export const RateReview = makeIcon(ChatTeardropTextPhosphor);
export const RateReviewIcon = RateReview;

export const RecordVoiceOver = makeIcon(MicrophonePhosphor);
export const RecordVoiceOverIcon = RecordVoiceOver;

export const Replay = makeIcon(ArrowCounterClockwisePhosphor);
export const ReplayIcon = Replay;

export const School = makeIcon(GraduationCapPhosphor);
export const SchoolIcon = School;

export const SchoolOutlined = makeIcon(GraduationCapPhosphor);
export const SchoolOutlinedIcon = SchoolOutlined;

export const Search = makeIcon(MagnifyingGlassPhosphor);
export const SearchIcon = Search;

export const SearchOutlined = makeIcon(MagnifyingGlassPhosphor);
export const SearchOutlinedIcon = SearchOutlined;

export const Security = makeIcon(ShieldPhosphor);
export const SecurityIcon = Security;

export const SelfImprovement = makeIcon(PersonSimplePhosphor);
export const SelfImprovementIcon = SelfImprovement;

export const Send = makeIcon(PaperPlaneRightPhosphor);
export const SendIcon = Send;

export const Settings = makeIcon(GearPhosphor);
export const SettingsIcon = Settings;

export const SettingsOutlined = makeIcon(GearPhosphor);
export const SettingsOutlinedIcon = SettingsOutlined;

export const Share = makeIcon(SharePhosphor);
export const ShareIcon = Share;

export const ShareOutlined = makeIcon(SharePhosphor);
export const ShareOutlinedIcon = ShareOutlined;

export const ShortText = makeIcon(TextAlignLeftPhosphor);
export const ShortTextIcon = ShortText;

export const Sort = makeIcon(ArrowsDownUpPhosphor);
export const SortIcon = Sort;

export const Storage = makeIcon(DatabasePhosphor);
export const StorageIcon = Storage;

export const Subject = makeIcon(TextAlignLeftPhosphor);
export const SubjectIcon = Subject;

export const SubjectOutlined = makeIcon(TextAlignLeftPhosphor);
export const SubjectOutlinedIcon = SubjectOutlined;

export const ParagraphIcon = SubjectOutlined;

export const Support = makeIcon(HeadsetPhosphor);
export const SupportIcon = Support;

export const SwapHoriz = makeIcon(ArrowsLeftRightPhosphor);
export const SwapHorizIcon = SwapHoriz;

export const TextFields = makeIcon(TextTPhosphor);
export const TextFieldsIcon = TextFields;

export const Translate = makeIcon(TranslatePhosphor);
export const TranslateIcon = Translate;

export const Twitter = makeIcon(TwitterLogoPhosphor);
export const TwitterIcon = Twitter;

export const Visibility = makeIcon(EyePhosphor);
export const VisibilityIcon = Visibility;

export const VisibilityOff = makeIcon(EyeSlashPhosphor);
export const VisibilityOffIcon = VisibilityOff;

export const WbSunny = makeIcon(SunPhosphor);
export const WbSunnyIcon = WbSunny;

export const WbSunnyOutlined = makeIcon(SunPhosphor);
export const WbSunnyOutlinedIcon = WbSunnyOutlined;

export const WhatsApp = makeIcon(WhatsappLogoPhosphor);
export const WhatsAppIcon = WhatsApp;

export const YouTube = makeIcon(YoutubeLogoPhosphor);
export const YouTubeIcon = YouTube;
