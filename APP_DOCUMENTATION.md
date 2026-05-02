# Tariq ila Al-Jannah (طريق إلى الجنة) - Full Documentation

Tariq ila Al-Jannah is a state-of-the-art AI-powered Islamic companion application. It is built as a high-performance monorepo using **Bun**, **Turborepo**, **NestJS** (Backend), **Next.js** (Web), and **Expo/React Native** (Mobile).

---

## 🌟 Core Features

### 1. AI Fiqh Q&A (Dialect & Madhab Aware)
*   **Contextual Guidance**: Users can ask complex Fiqh questions.
*   **Localized Logic**: The AI (Groq Llama-3) understands and responds in specific dialects (Tunisian, Egyptian, Gulf, Moroccan).
*   **School of Thought**: Responses are tailored to the user's Madhab (Maliki, Hanafi, Shafi'i, Hanbali).

### 2. Personalized Quran Journey
*   **Goal Tracking**: Set reading or memorization goals (Daily/Weekly).
*   **AI Reflections**: Get AI-generated spiritual reflections and "Tafsir-lite" based on the verses you read today.
*   **Progress Dashboard**: Visual streaks and progress bars for your Quran journey.

### 3. AR Qibla & Mosque Finder
*   **AR View**: Use Augmented Reality to see the direction of the Kaaba marked in the sky through your camera.
*   **Mosque Discovery**: Find nearby mosques on a map with travel times and Jumu'ah schedules.

### 4. Zakat & Sadaqah Manager
*   **Smart Calculator**: Supports Gold, Silver, Cash, Stocks, and Business assets.
*   **Hawl Tracker**: Automatically tracks your lunar year cycle and alerts you when Zakat is due.
*   **Sadaqah Log**: Keep a private record of voluntary charity and see your lifetime impact.

### 5. Spiritual Community Circles
*   **Social Worship**: Create circles for family or friends.
*   **Shared Leaderboards**: Compete in good deeds (Dhikr counts, Quran pages, Prayer consistency).
*   **Group Khatm**: Collaborate with your circle to complete the entire Quran together.

### 6. AI Dream Journal
*   **Islamic Interpretation**: Analyze your dreams using AI trained on classical works like Ibn Sirin, strictly within Quran and Sunnah context.
*   **Secure Journal**: A private space to record and categorize your dreams by mood and theme.

### 7. AI Outfit Guidance
*   **Weather-Aware**: Suggests outfits based on real-time weather in your location (e.g., Tunis).
*   **Modesty First**: Recommends practical, modest combinations (colors, fabrics, layers) that align with Islamic values.

### 8. Prayer, Wudu & Athkar
*   **Adhan Notifications**: High-precision prayer times with beautiful Adhan alerts.
*   **Wudu Guide**: Step-by-step visual guidance for ablution.
*   **Morning/Evening Athkar**: Interactive counters with daily reminders.

---

## 🛠 Project Structure

*   `apps/backend`: NestJS API (PostgreSQL + pgvector, Redis, BullMQ).
*   `apps/frontend`: Expo/React Native mobile application.
*   `apps/web`: Next.js 14 Landing page and FAQ Chatbot.
*   `packages/shared`: Unified TypeScript types and constants.

---

## 🚀 How to Launch the Mobile App (Expo)

### 1. Prerequisites
*   Install **Bun**: `curl -fsSL https://bun.sh/install | bash`
*   Install **Expo Go** on your physical device (iOS/Android) or have an emulator ready.

### 2. Environment Variables
Navigate to `apps/frontend` and create a `.env` file:
```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:3000/api/v1
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
*Note: Use your local machine's IP address instead of "localhost" if testing on a physical device.*

### 3. Installation
From the root of the project:
```bash
bun install
```

### 4. Start Development Server
You can launch the app from the root using Turbo:
```bash
bun run dev --filter=@tariq/frontend
```

Or navigate directly to the frontend app:
```bash
cd apps/frontend
bun start
```

### 5. Running on Device
*   **Terminal**: A QR code will appear in your terminal.
*   **Scan**: Open the **Expo Go** app (Android) or your **Camera app** (iOS) and scan the QR code.
*   **Enjoy**: The app will bundle and load on your device.

---

## 💳 Payments (Stripe)
The app uses Stripe for Premium subscriptions.
1. Ensure your `STRIPE_SECRET_KEY` is set in the **Backend** `.env`.
2. Set the `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the **Mobile** `.env`.
3. Test using Stripe's test card numbers (e.g., 4242...4242).

---

## 🐳 Running with Docker
To launch the entire ecosystem (Database, Redis, Backend, Web, Frontend) at once:
```bash
docker compose up --build
```
The mobile web version will be available at `http://localhost:8080`.
