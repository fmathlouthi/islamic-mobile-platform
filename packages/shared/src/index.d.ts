export declare const APP_NAME = "\u0637\u0631\u064A\u0642 \u0625\u0644\u0649 \u0627\u0644\u062C\u0646\u0629";
export declare const APP_NAME_LATIN = "Tariq ila Al-Jannah";
export declare const APP_VERSION = "1.0.0";
export declare const API_BASE_URL: string;
export declare const API_TIMEOUT = 30000;
export declare enum PrayerName {
    FAJR = "fajr",
    SUNRISE = "sunrise",
    DHUHR = "dhuhr",
    ASR = "asr",
    MAGHRIB = "maghrib",
    ISHAA = "ishaa"
}
export declare const PRAYER_NAMES_AR: Record<PrayerName, string>;
export declare const PRAYER_NAMES_EN: Record<PrayerName, string>;
export declare const PRAYER_ORDER: PrayerName[];
export declare enum CalculationMethod {
    MUSLIM_WORLD_LEAGUE = "muslim_world_league",
    EGYPTIAN = "egyptian",
    KARACHI = "karachi",
    Umm_AL_QURA = "umm_al_qura",
    DUBAI = "dubai",
    KUWAIT = "kuwait",
    MOON_PAKISTAN = "moon_pakistan",
    TURKEY = "turkey",
    TANZANIA = "tanzania",
    CUSTOM = "custom"
}
export declare enum AthkarCategory {
    MORNING = "morning",
    EVENING = "evening",
    SLEEP = "sleep",
    WAKE_UP = "wake_up",
    PRAYER = "prayer",
    QURAN = "quran"
}
export declare const ATHKAR_CATEGORY_NAMES_AR: Record<AthkarCategory, string>;
export declare const ATHKAR_CATEGORY_NAMES_EN: Record<AthkarCategory, string>;
export declare enum Language {
    ARABIC = "ar",
    ENGLISH = "en",
    FRENCH = "fr"
}
export declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system"
}
export declare enum Madhab {
    HANAFI = "hanafi",
    MALIKI = "maliki",
    SHAFI_I = "shafi_i",
    HANBALI = "hanbali"
}
export declare enum Dialect {
    TUNISIAN = "tunisian",
    EGYPTIAN = "egyptian",
    GULF = "gulf",
    MOROCCAN = "moroccan"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNSPECIFIED = "unspecified"
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
export interface Location {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    timezone?: string;
}
export interface Mosque {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    distance?: number;
    travelTime?: number;
    rating?: number;
}
export interface QiblaResponse {
    direction: number;
}
export declare class NearbyMosquesRequest {
    latitude: number;
    longitude: number;
    radius?: number;
}
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
export interface PrayerTime {
    name: PrayerName;
    time: string;
    arabicName: string;
    englishName: string;
}
export interface PrayerTimesResponse {
    date: string;
    location: Location;
    calculationMethod: CalculationMethod;
    prayers: PrayerTime[];
}
export interface PrayerCompletion {
    id: string;
    userId: string;
    prayerName: PrayerName;
    date: string;
    completedAt: Date;
}
export interface PrayerStreak {
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate?: string;
}
export interface WuduStep {
    id: number;
    title: string;
    arabicTitle: string;
    description: string;
    imageUrl: string;
}
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
export declare class UpdateFcmTokenRequest {
    fcmToken: string;
}
export declare class UpdateNotificationSettingsRequest {
    notificationsEnabled?: boolean;
    prayerTimeNotifications?: boolean;
    athkarReminders?: boolean;
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
export declare enum AuthProvider {
    LOCAL = "local",
    GOOGLE = "google",
    APPLE = "apple"
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
export declare enum IslamicEventType {
    HOLIDAY = "holiday",
    OBSERVANCE = "observance"
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
    gregorianDate?: string;
    daysRemaining?: number;
}
export declare const HIJRI_MONTHS_EN: string[];
export declare const HIJRI_MONTHS_AR: string[];
export declare enum SubscriptionPlan {
    FREE = "free",
    PREMIUM = "premium",
    FAMILY = "family"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELED = "canceled",
    INCOMPLETE = "incomplete",
    INCOMPLETE_EXPIRED = "incomplete_expired",
    PAST_DUE = "past_due",
    TRIALING = "trialing",
    UNPAID = "unpaid"
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
export declare enum QuranGoalType {
    READING = "reading",
    MEMORIZATION = "memorization",
    KHATM = "khatm"
}
export declare enum QuranGoalFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export interface QuranGoal {
    id: string;
    userId: string;
    type: QuranGoalType;
    frequency: QuranGoalFrequency;
    targetAmount: number;
    targetUnit: string;
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
    date: string;
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
export declare class CreateQuranGoalRequest {
    type: QuranGoalType;
    frequency: QuranGoalFrequency;
    targetAmount: number;
    targetUnit: string;
    endDate?: Date;
}
export declare class LogQuranProgressRequest {
    goalId?: string;
    surahNumber: number;
    ayahStart: number;
    ayahEnd: number;
    pagesRead: number;
    date: string;
}
export declare enum ZakatAssetType {
    GOLD = "gold",
    SILVER = "silver",
    CASH = "cash",
    STOCKS = "stocks",
    BUSINESS = "business",
    DEBT = "debt",
    CRYPTO = "crypto",
    OTHER = "other"
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
export declare enum HawlCycleStatus {
    ACTIVE = "active",
    COMPLETED = "completed"
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
export declare class AddZakatAssetRequest {
    type: ZakatAssetType;
    name: string;
    value: number;
    weightInGrams?: number;
    currency: string;
}
export declare class LogSadaqahRequest {
    amount: number;
    currency: string;
    category: string;
    description?: string;
    date: string;
    isZakat: boolean;
}
export interface AthkarCompletion {
    id: string;
    userId: string;
    athkarId: string;
    category: AthkarCategory;
    count: number;
    date: string;
    completedAt: Date;
}
export declare class LogAthkarCompletionRequest {
    athkarId: string;
    category: AthkarCategory;
    count: number;
    date: string;
}
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
export declare class CreateCircleRequest {
    name: string;
    description?: string;
}
export declare class JoinCircleRequest {
    inviteCode: string;
}
export declare class CreateKhatmRequest {
    title: string;
    description?: string;
}
export declare class ClaimKhatmPartRequest {
    juzNumber: number;
}
export declare enum DreamMood {
    HAPPY = "happy",
    ANXIOUS = "anxious",
    PEACEFUL = "peaceful",
    CONFUSED = "confused",
    SAD = "sad"
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
export declare class CreateDreamRequest {
    title: string;
    description: string;
    mood: DreamMood;
    tags?: string[];
}
//# sourceMappingURL=index.d.ts.map