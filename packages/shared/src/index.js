"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDreamRequest = exports.DreamMood = exports.ClaimKhatmPartRequest = exports.CreateKhatmRequest = exports.JoinCircleRequest = exports.CreateCircleRequest = exports.LogAthkarCompletionRequest = exports.LogSadaqahRequest = exports.AddZakatAssetRequest = exports.HawlCycleStatus = exports.ZakatAssetType = exports.LogQuranProgressRequest = exports.CreateQuranGoalRequest = exports.QuranGoalFrequency = exports.QuranGoalType = exports.SubscriptionStatus = exports.SubscriptionPlan = exports.HIJRI_MONTHS_AR = exports.HIJRI_MONTHS_EN = exports.IslamicEventType = exports.AuthProvider = exports.UpdateNotificationSettingsRequest = exports.UpdateFcmTokenRequest = exports.NearbyMosquesRequest = exports.Gender = exports.Dialect = exports.Madhab = exports.Theme = exports.Language = exports.ATHKAR_CATEGORY_NAMES_EN = exports.ATHKAR_CATEGORY_NAMES_AR = exports.AthkarCategory = exports.CalculationMethod = exports.PRAYER_ORDER = exports.PRAYER_NAMES_EN = exports.PRAYER_NAMES_AR = exports.PrayerName = exports.API_TIMEOUT = exports.API_BASE_URL = exports.APP_VERSION = exports.APP_NAME_LATIN = exports.APP_NAME = void 0;
const swagger_1 = require("@nestjs/swagger");
// ===========================================
// Tariq ila Al-Jannah - Shared Package
// Common types, constants, and utilities
// ===========================================
exports.APP_NAME = 'طريق إلى الجنة';
exports.APP_NAME_LATIN = 'Tariq ila Al-Jannah';
exports.APP_VERSION = '1.0.0';
// API Configuration
exports.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
exports.API_TIMEOUT = 30000;
// ===========================================
// Prayer Times
// ===========================================
var PrayerName;
(function (PrayerName) {
    PrayerName["FAJR"] = "fajr";
    PrayerName["SUNRISE"] = "sunrise";
    PrayerName["DHUHR"] = "dhuhr";
    PrayerName["ASR"] = "asr";
    PrayerName["MAGHRIB"] = "maghrib";
    PrayerName["ISHAA"] = "ishaa";
})(PrayerName || (exports.PrayerName = PrayerName = {}));
exports.PRAYER_NAMES_AR = {
    [PrayerName.FAJR]: 'الفجر',
    [PrayerName.SUNRISE]: 'الشروق',
    [PrayerName.DHUHR]: 'الظهر',
    [PrayerName.ASR]: 'العصر',
    [PrayerName.MAGHRIB]: 'المغرب',
    [PrayerName.ISHAA]: 'العشاء',
};
exports.PRAYER_NAMES_EN = {
    [PrayerName.FAJR]: 'Fajr',
    [PrayerName.SUNRISE]: 'Sunrise',
    [PrayerName.DHUHR]: 'Dhuhr',
    [PrayerName.ASR]: 'Asr',
    [PrayerName.MAGHRIB]: 'Maghrib',
    [PrayerName.ISHAA]: 'Isha',
};
exports.PRAYER_ORDER = [
    PrayerName.FAJR,
    PrayerName.SUNRISE,
    PrayerName.DHUHR,
    PrayerName.ASR,
    PrayerName.MAGHRIB,
    PrayerName.ISHAA,
];
// Calculation Methods
var CalculationMethod;
(function (CalculationMethod) {
    CalculationMethod["MUSLIM_WORLD_LEAGUE"] = "muslim_world_league";
    CalculationMethod["EGYPTIAN"] = "egyptian";
    CalculationMethod["KARACHI"] = "karachi";
    CalculationMethod["Umm_AL_QURA"] = "umm_al_qura";
    CalculationMethod["DUBAI"] = "dubai";
    CalculationMethod["KUWAIT"] = "kuwait";
    CalculationMethod["MOON_PAKISTAN"] = "moon_pakistan";
    CalculationMethod["TURKEY"] = "turkey";
    CalculationMethod["TANZANIA"] = "tanzania";
    CalculationMethod["CUSTOM"] = "custom";
})(CalculationMethod || (exports.CalculationMethod = CalculationMethod = {}));
// ===========================================
// Athkar (Remembrances)
// ===========================================
var AthkarCategory;
(function (AthkarCategory) {
    AthkarCategory["MORNING"] = "morning";
    AthkarCategory["EVENING"] = "evening";
    AthkarCategory["SLEEP"] = "sleep";
    AthkarCategory["WAKE_UP"] = "wake_up";
    AthkarCategory["PRAYER"] = "prayer";
    AthkarCategory["QURAN"] = "quran";
})(AthkarCategory || (exports.AthkarCategory = AthkarCategory = {}));
exports.ATHKAR_CATEGORY_NAMES_AR = {
    [AthkarCategory.MORNING]: 'أذكار الصباح',
    [AthkarCategory.EVENING]: 'أذكار المساء',
    [AthkarCategory.SLEEP]: 'أذكار النوم',
    [AthkarCategory.WAKE_UP]: 'أذكار الاستيقاظ',
    [AthkarCategory.PRAYER]: 'أذكار الصلاة',
    [AthkarCategory.QURAN]: 'أذكار القرآن',
};
exports.ATHKAR_CATEGORY_NAMES_EN = {
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
var Language;
(function (Language) {
    Language["ARABIC"] = "ar";
    Language["ENGLISH"] = "en";
    Language["FRENCH"] = "fr";
})(Language || (exports.Language = Language = {}));
var Theme;
(function (Theme) {
    Theme["LIGHT"] = "light";
    Theme["DARK"] = "dark";
    Theme["SYSTEM"] = "system";
})(Theme || (exports.Theme = Theme = {}));
var Madhab;
(function (Madhab) {
    Madhab["HANAFI"] = "hanafi";
    Madhab["MALIKI"] = "maliki";
    Madhab["SHAFI_I"] = "shafi_i";
    Madhab["HANBALI"] = "hanbali";
})(Madhab || (exports.Madhab = Madhab = {}));
var Dialect;
(function (Dialect) {
    Dialect["TUNISIAN"] = "tunisian";
    Dialect["EGYPTIAN"] = "egyptian";
    Dialect["GULF"] = "gulf";
    Dialect["MOROCCAN"] = "moroccan";
})(Dialect || (exports.Dialect = Dialect = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["UNSPECIFIED"] = "unspecified";
})(Gender || (exports.Gender = Gender = {}));
class NearbyMosquesRequest {
    latitude;
    longitude;
    radius; // in meters
}
exports.NearbyMosquesRequest = NearbyMosquesRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NearbyMosquesRequest.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NearbyMosquesRequest.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 5000 }),
    __metadata("design:type", Number)
], NearbyMosquesRequest.prototype, "radius", void 0);
class UpdateFcmTokenRequest {
    fcmToken;
}
exports.UpdateFcmTokenRequest = UpdateFcmTokenRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateFcmTokenRequest.prototype, "fcmToken", void 0);
class UpdateNotificationSettingsRequest {
    notificationsEnabled;
    prayerTimeNotifications;
    athkarReminders;
    islamicEventsNotifications;
}
exports.UpdateNotificationSettingsRequest = UpdateNotificationSettingsRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], UpdateNotificationSettingsRequest.prototype, "notificationsEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], UpdateNotificationSettingsRequest.prototype, "prayerTimeNotifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], UpdateNotificationSettingsRequest.prototype, "athkarReminders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], UpdateNotificationSettingsRequest.prototype, "islamicEventsNotifications", void 0);
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["LOCAL"] = "local";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["APPLE"] = "apple";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
// ===========================================
// Islamic Calendar
// ===========================================
var IslamicEventType;
(function (IslamicEventType) {
    IslamicEventType["HOLIDAY"] = "holiday";
    IslamicEventType["OBSERVANCE"] = "observance";
})(IslamicEventType || (exports.IslamicEventType = IslamicEventType = {}));
exports.HIJRI_MONTHS_EN = [
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
exports.HIJRI_MONTHS_AR = [
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
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "free";
    SubscriptionPlan["PREMIUM"] = "premium";
    SubscriptionPlan["FAMILY"] = "family";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["UNPAID"] = "unpaid";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
// ===========================================
// Quran Tracking
// ===========================================
var QuranGoalType;
(function (QuranGoalType) {
    QuranGoalType["READING"] = "reading";
    QuranGoalType["MEMORIZATION"] = "memorization";
    QuranGoalType["KHATM"] = "khatm";
})(QuranGoalType || (exports.QuranGoalType = QuranGoalType = {}));
var QuranGoalFrequency;
(function (QuranGoalFrequency) {
    QuranGoalFrequency["DAILY"] = "daily";
    QuranGoalFrequency["WEEKLY"] = "weekly";
    QuranGoalFrequency["MONTHLY"] = "monthly";
})(QuranGoalFrequency || (exports.QuranGoalFrequency = QuranGoalFrequency = {}));
class CreateQuranGoalRequest {
    type;
    frequency;
    targetAmount;
    targetUnit;
    endDate;
}
exports.CreateQuranGoalRequest = CreateQuranGoalRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: QuranGoalType }),
    __metadata("design:type", String)
], CreateQuranGoalRequest.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: QuranGoalFrequency }),
    __metadata("design:type", String)
], CreateQuranGoalRequest.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateQuranGoalRequest.prototype, "targetAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQuranGoalRequest.prototype, "targetUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], CreateQuranGoalRequest.prototype, "endDate", void 0);
class LogQuranProgressRequest {
    goalId;
    surahNumber;
    ayahStart;
    ayahEnd;
    pagesRead;
    date;
}
exports.LogQuranProgressRequest = LogQuranProgressRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], LogQuranProgressRequest.prototype, "goalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogQuranProgressRequest.prototype, "surahNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogQuranProgressRequest.prototype, "ayahStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogQuranProgressRequest.prototype, "ayahEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogQuranProgressRequest.prototype, "pagesRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogQuranProgressRequest.prototype, "date", void 0);
// ===========================================
// Zakat & Sadaqah
// ===========================================
var ZakatAssetType;
(function (ZakatAssetType) {
    ZakatAssetType["GOLD"] = "gold";
    ZakatAssetType["SILVER"] = "silver";
    ZakatAssetType["CASH"] = "cash";
    ZakatAssetType["STOCKS"] = "stocks";
    ZakatAssetType["BUSINESS"] = "business";
    ZakatAssetType["DEBT"] = "debt";
    ZakatAssetType["CRYPTO"] = "crypto";
    ZakatAssetType["OTHER"] = "other";
})(ZakatAssetType || (exports.ZakatAssetType = ZakatAssetType = {}));
var HawlCycleStatus;
(function (HawlCycleStatus) {
    HawlCycleStatus["ACTIVE"] = "active";
    HawlCycleStatus["COMPLETED"] = "completed";
})(HawlCycleStatus || (exports.HawlCycleStatus = HawlCycleStatus = {}));
class AddZakatAssetRequest {
    type;
    name;
    value;
    weightInGrams;
    currency;
}
exports.AddZakatAssetRequest = AddZakatAssetRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ZakatAssetType }),
    __metadata("design:type", String)
], AddZakatAssetRequest.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AddZakatAssetRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AddZakatAssetRequest.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], AddZakatAssetRequest.prototype, "weightInGrams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AddZakatAssetRequest.prototype, "currency", void 0);
class LogSadaqahRequest {
    amount;
    currency;
    category;
    description;
    date;
    isZakat;
}
exports.LogSadaqahRequest = LogSadaqahRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogSadaqahRequest.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogSadaqahRequest.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogSadaqahRequest.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], LogSadaqahRequest.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogSadaqahRequest.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], LogSadaqahRequest.prototype, "isZakat", void 0);
class LogAthkarCompletionRequest {
    athkarId;
    category;
    count;
    date;
}
exports.LogAthkarCompletionRequest = LogAthkarCompletionRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogAthkarCompletionRequest.prototype, "athkarId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AthkarCategory }),
    __metadata("design:type", String)
], LogAthkarCompletionRequest.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LogAthkarCompletionRequest.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LogAthkarCompletionRequest.prototype, "date", void 0);
class CreateCircleRequest {
    name;
    description;
}
exports.CreateCircleRequest = CreateCircleRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCircleRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateCircleRequest.prototype, "description", void 0);
class JoinCircleRequest {
    inviteCode;
}
exports.JoinCircleRequest = JoinCircleRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JoinCircleRequest.prototype, "inviteCode", void 0);
class CreateKhatmRequest {
    title;
    description;
}
exports.CreateKhatmRequest = CreateKhatmRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateKhatmRequest.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateKhatmRequest.prototype, "description", void 0);
class ClaimKhatmPartRequest {
    juzNumber;
}
exports.ClaimKhatmPartRequest = ClaimKhatmPartRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ClaimKhatmPartRequest.prototype, "juzNumber", void 0);
// ===========================================
// Dream Journal
// ===========================================
var DreamMood;
(function (DreamMood) {
    DreamMood["HAPPY"] = "happy";
    DreamMood["ANXIOUS"] = "anxious";
    DreamMood["PEACEFUL"] = "peaceful";
    DreamMood["CONFUSED"] = "confused";
    DreamMood["SAD"] = "sad";
})(DreamMood || (exports.DreamMood = DreamMood = {}));
class CreateDreamRequest {
    title;
    description;
    mood;
    tags;
}
exports.CreateDreamRequest = CreateDreamRequest;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDreamRequest.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDreamRequest.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DreamMood }),
    __metadata("design:type", String)
], CreateDreamRequest.prototype, "mood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], CreateDreamRequest.prototype, "tags", void 0);
