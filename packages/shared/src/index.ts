// Keep DTO decorators in shared package without pulling backend-only deps
// (e.g. @nestjs/swagger) into React Native bundles.
const ApiProperty =
  (_options?: unknown): PropertyDecorator =>
  () => {
    // no-op for shared runtime
  };

// ===========================================
// Tariq ila Al-Jannah - Shared Package
// Common types, constants, and utilities
// ===========================================

export const APP_NAME = 'طريق إلى الجنة';
export const APP_NAME_LATIN = 'Tariq ila Al-Jannah';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
export const API_TIMEOUT = 30000;

// ===========================================
// Prayer Times
// ===========================================

export enum PrayerName {
  FAJR = 'fajr',
  SUNRISE = 'sunrise',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHAA = 'ishaa',
}

export const PRAYER_NAMES_AR: Record<PrayerName, string> = {
  [PrayerName.FAJR]: 'الفجر',
  [PrayerName.SUNRISE]: 'الشروق',
  [PrayerName.DHUHR]: 'الظهر',
  [PrayerName.ASR]: 'العصر',
  [PrayerName.MAGHRIB]: 'المغرب',
  [PrayerName.ISHAA]: 'العشاء',
};

export const PRAYER_NAMES_EN: Record<PrayerName, string> = {
  [PrayerName.FAJR]: 'Fajr',
  [PrayerName.SUNRISE]: 'Sunrise',
  [PrayerName.DHUHR]: 'Dhuhr',
  [PrayerName.ASR]: 'Asr',
  [PrayerName.MAGHRIB]: 'Maghrib',
  [PrayerName.ISHAA]: 'Isha',
};

export const PRAYER_ORDER: PrayerName[] = [
  PrayerName.FAJR,
  PrayerName.SUNRISE,
  PrayerName.DHUHR,
  PrayerName.ASR,
  PrayerName.MAGHRIB,
  PrayerName.ISHAA,
];

// Calculation Methods
export enum CalculationMethod {
  MUSLIM_WORLD_LEAGUE = 'muslim_world_league',
  EGYPTIAN = 'egyptian',
  KARACHI = 'karachi',
  Umm_AL_QURA = 'umm_al_qura',
  DUBAI = 'dubai',
  KUWAIT = 'kuwait',
  MOON_PAKISTAN = 'moon_pakistan',
  TURKEY = 'turkey',
  TANZANIA = 'tanzania',
  CUSTOM = 'custom',
}

// ===========================================
// Athkar (Remembrances)
// ===========================================

export enum AthkarCategory {
  MORNING = 'morning',
  EVENING = 'evening',
  SLEEP = 'sleep',
  WAKE_UP = 'wake_up',
  PRAYER = 'prayer',
  QURAN = 'quran',
}

export const ATHKAR_CATEGORY_NAMES_AR: Record<AthkarCategory, string> = {
  [AthkarCategory.MORNING]: 'أذكار الصباح',
  [AthkarCategory.EVENING]: 'أذكار المساء',
  [AthkarCategory.SLEEP]: 'أذكار النوم',
  [AthkarCategory.WAKE_UP]: 'أذكار الاستيقاظ',
  [AthkarCategory.PRAYER]: 'أذكار الصلاة',
  [AthkarCategory.QURAN]: 'أذكار القرآن',
};

export const ATHKAR_CATEGORY_NAMES_EN: Record<AthkarCategory, string> = {
  [AthkarCategory.MORNING]: 'Morning Athkar',
  [AthkarCategory.EVENING]: 'Evening Athkar',
  [AthkarCategory.SLEEP]: 'Sleep Athkar',
  [AthkarCategory.WAKE_UP]: 'Wake Up Athkar',
  [AthkarCategory.PRAYER]: 'Prayer Athkar',
  [AthkarCategory.QURAN]: 'Quran Athkar',
};

// ===========================================
// User Preferences
// ===========================================

export enum Language {
  ARABIC = 'ar',
  ENGLISH = 'en',
  FRENCH = 'fr',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum Madhab {
  HANAFI = 'hanafi',
  MALIKI = 'maliki',
  SHAFI_I = 'shafi_i',
  HANBALI = 'hanbali',
}

export enum Dialect {
  TUNISIAN = 'tunisian',
  EGYPTIAN = 'egyptian',
  GULF = 'gulf',
  MOROCCAN = 'moroccan',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNSPECIFIED = 'unspecified',
}

export interface UserPreferences {
  language: Language;
  theme: Theme;
  calculationMethod: CalculationMethod;
  notificationsEnabled: boolean;
  prayerTimeNotifications: boolean;
  athkarReminders: boolean;
  islamicEventsNotifications: boolean;
  madhab: Madhab;
  dialect: Dialect;
  gender: Gender;
}

// ===========================================
// Location
// ===========================================

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

// ===========================================
// Location-Based Services (Qibla & Mosques)
// ===========================================

export interface Mosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number; // in meters
  travelTime?: number; // estimated travel time in minutes
  rating?: number;
}

export interface QiblaResponse {
  direction: number; // direction in degrees from North
}

export class NearbyMosquesRequest {
  @ApiProperty()
  latitude!: number;

  @ApiProperty()
  longitude!: number;

  @ApiProperty({ required: false, default: 5000 })
  radius?: number; // in meters
}

// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ===========================================
// Prayer Time Types
// ===========================================

export interface PrayerTime {
  name: PrayerName;
  time: string; // HH:mm format
  arabicName: string;
  englishName: string;
}

export interface PrayerTimesResponse {
  date: string; // YYYY-MM-DD
  location: Location;
  calculationMethod: CalculationMethod;
  prayers: PrayerTime[];
}

// ===========================================
// Prayer Tracking
// ===========================================

export interface PrayerCompletion {
  id: string;
  userId: string;
  prayerName: PrayerName;
  date: string; // YYYY-MM-DD
  completedAt: Date;
}

export interface PrayerStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate?: string;
}

// ===========================================
// Wudu Guide
// ===========================================

export interface WuduStep {
  id: number;
  title: string;
  arabicTitle: string;
  description: string;
  imageUrl: string;
}

// ===========================================
// Athkar Types
// ===========================================

export interface AthkarItem {
  id: string;
  category: AthkarCategory;
  text: string;
  transliteration?: string;
  translation?: string;
  count: number;
  source?: string;
}

export interface AthkarListResponse {
  category: AthkarCategory;
  items: AthkarItem[];
}

// ===========================================
// Fiqh Types
// ===========================================

export interface FiqhRequest {
  query: string;
  madhab?: Madhab;
  dialect?: Dialect;
}

export interface FiqhResponse {
  answer: string;
}

export interface FiqhChunk {
  text: string;
  isComplete: boolean;
}

// ===========================================
// User Types
// ===========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  provider: AuthProvider;
  providerId?: string;
  language: Language;
  theme: Theme;
  calculationMethod: CalculationMethod;
  notificationsEnabled: boolean;
  prayerTimeNotifications: boolean;
  athkarReminders: boolean;
  islamicEventsNotifications: boolean;
  madhab: Madhab;
  dialect: Dialect;
  latitude?: number;
  longitude?: number;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateFcmTokenRequest {
  @ApiProperty()
  fcmToken!: string;
}

export class UpdateNotificationSettingsRequest {
  @ApiProperty({ required: false })
  notificationsEnabled?: boolean;

  @ApiProperty({ required: false })
  prayerTimeNotifications?: boolean;

  @ApiProperty({ required: false })
  athkarReminders?: boolean;

  @ApiProperty({ required: false })
  islamicEventsNotifications?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface AppleLoginRequest {
  idToken: string;
  firstName?: string;
  lastName?: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ===========================================
// Islamic Calendar
// ===========================================

export enum IslamicEventType {
  HOLIDAY = 'holiday',
  OBSERVANCE = 'observance',
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameEn: string;
  monthNameAr: string;
}

export interface IslamicEvent {
  id: string;
  nameAr: string;
  nameEn: string;
  hijriDay: number;
  hijriMonth: number;
  type: IslamicEventType;
  gregorianDate?: string; // YYYY-MM-DD
  daysRemaining?: number;
}

export const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi\' al-Awwal',
  'Rabi\' al-Thani',
  'Jumada al-Ula',
  'Jumada al-Akhira',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah',
];

export const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

// ===========================================
// Subscriptions
// ===========================================

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  FAMILY = 'family',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// ===========================================
// Style & Outfit Guidance
// ===========================================

export interface OutfitSuggestion {
  title: string;
  description: string;
  items: string[];
  colors: string[];
  fabrics: string[];
  layers: string[];
  weatherAwareReason: string;
  fiqhAwareReason: string;
}

export interface OutfitSuggestionRequest {
  latitude?: number;
  longitude?: number;
  gender?: Gender;
}

// ===========================================
// Quran Tracking
// ===========================================

export enum QuranGoalType {
  READING = 'reading',
  MEMORIZATION = 'memorization',
  KHATM = 'khatm',
}

export enum QuranGoalFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface QuranGoal {
  id: string;
  userId: string;
  type: QuranGoalType;
  frequency: QuranGoalFrequency;
  targetAmount: number; // e.g., pages, ayahs, juz
  targetUnit: string; // 'pages', 'ayahs', 'juz', 'surahs'
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuranProgress {
  id: string;
  userId: string;
  goalId?: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  pagesRead: number;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}

export interface QuranReflection {
  id: string;
  userId: string;
  progressId: string;
  content: string;
  verseContext: string;
  createdAt: Date;
}

export interface QuranStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadingDate?: string;
}

export class CreateQuranGoalRequest {
  @ApiProperty({ enum: QuranGoalType })
  type!: QuranGoalType;

  @ApiProperty({ enum: QuranGoalFrequency })
  frequency!: QuranGoalFrequency;

  @ApiProperty()
  targetAmount!: number;

  @ApiProperty()
  targetUnit!: string;

  @ApiProperty({ required: false })
  endDate?: Date;
}

export class LogQuranProgressRequest {
  @ApiProperty({ required: false })
  goalId?: string;

  @ApiProperty()
  surahNumber!: number;

  @ApiProperty()
  ayahStart!: number;

  @ApiProperty()
  ayahEnd!: number;

  @ApiProperty()
  pagesRead!: number;

  @ApiProperty()
  date!: string;
}

// ===========================================
// Zakat & Sadaqah
// ===========================================

export enum ZakatAssetType {
  GOLD = 'gold',
  SILVER = 'silver',
  CASH = 'cash',
  STOCKS = 'stocks',
  BUSINESS = 'business',
  DEBT = 'debt',
  CRYPTO = 'crypto',
  OTHER = 'other',
}

export interface ZakatAsset {
  id: string;
  userId: string;
  type: ZakatAssetType;
  name: string;
  value: number;
  currency: string;
  weightInGrams?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum HawlCycleStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface HawlCycle {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: HawlCycleStatus;
  initialWealth: number;
  currentWealth: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SadaqahDonation {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  description?: string;
  date: string;
  isZakat: boolean;
  createdAt: Date;
}

export interface ZakatSummary {
  totalAssets: number;
  zakatDue: number;
  nisabGold: number;
  nisabSilver: number;
  isNisabReached: boolean;
  hawlDaysRemaining: number;
  totalSadaqahYear: number;
}

export class AddZakatAssetRequest {
  @ApiProperty({ enum: ZakatAssetType })
  type!: ZakatAssetType;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty({ required: false })
  weightInGrams?: number;

  @ApiProperty()
  currency!: string;
}

export class LogSadaqahRequest {
  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  isZakat!: boolean;
}

// ===========================================
// Athkar Completion
// ===========================================

export interface AthkarCompletion {
  id: string;
  userId: string;
  athkarId: string;
  category: AthkarCategory;
  count: number;
  date: string; // YYYY-MM-DD
  completedAt: Date;
}

export class LogAthkarCompletionRequest {
  @ApiProperty()
  athkarId!: string;

  @ApiProperty({ enum: AthkarCategory })
  category!: AthkarCategory;

  @ApiProperty()
  count!: number;

  @ApiProperty()
  date!: string;
}

// ===========================================
// Spiritual Community Circles
// ===========================================

export interface Circle {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  creatorId: string;
  creator?: User;
  membersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CircleMember {
  id: string;
  circleId: string;
  userId: string;
  user?: User;
  joinedAt: Date;
}

export interface CircleProgress {
  userId: string;
  userName: string;
  dhikrCount: number;
  quranPages: number;
  prayerCount: number;
  totalPoints: number;
}

export interface CircleLeaderboard {
  circleId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  rankings: CircleProgress[];
}

// ===========================================
// Group Khatm
// ===========================================

export interface GroupKhatm {
  id: string;
  circleId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCompleted: boolean;
  parts: KhatmPart[];
  createdAt: Date;
}

export interface KhatmPart {
  id: string;
  khatmId: string;
  juzNumber: number;
  claimedByUserId?: string;
  claimedByUser?: User;
  isCompleted: boolean;
  completedAt?: Date;
}

export class CreateCircleRequest {
  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class JoinCircleRequest {
  @ApiProperty()
  inviteCode!: string;
}

export class CreateKhatmRequest {
  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class ClaimKhatmPartRequest {
  @ApiProperty()
  juzNumber!: number;
}

// ===========================================
// Dream Journal
// ===========================================

export enum DreamMood {
  HAPPY = 'happy',
  ANXIOUS = 'anxious',
  PEACEFUL = 'peaceful',
  CONFUSED = 'confused',
  SAD = 'sad',
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  description: string;
  interpretation?: string;
  mood: DreamMood;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class CreateDreamRequest {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: DreamMood })
  mood!: DreamMood;

  @ApiProperty({ type: [String], required: false })
  tags?: string[];
}
