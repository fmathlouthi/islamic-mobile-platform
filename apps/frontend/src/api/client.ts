import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

function resolveApiBaseUrl(): string {
  const rawValue = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
  const sanitized = rawValue.split('#')[0].trim();

  const hostCandidates = [
    (Constants as any)?.expoConfig?.hostUri,
    (Constants as any)?.expoGoConfig?.debuggerHost,
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  const hostUri = hostCandidates[0] || '';
  const host = hostUri.split(':')[0];

  // On physical devices, localhost points to the phone itself, not the dev machine.
  if (host && /(localhost|127\.0\.0\.1)/.test(sanitized)) {
    return sanitized.replace('localhost', host).replace('127.0.0.1', host);
  }

  return sanitized;
}

const API_BASE_URL = resolveApiBaseUrl();

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['X-Retry'] = 'true';
              return this.client(originalRequest);
            }
          } catch {
            await this.clearTokens();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('accessToken');
    } catch {
      return null;
    }
  }

  private async saveToken(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Handle secure store errors
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } catch {
      // Handle secure store errors
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          return null;
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await this.saveToken('accessToken', accessToken);
        await this.saveToken('refreshToken', newRefreshToken);

        return accessToken;
      } catch {
        return null;
      }
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    await this.saveToken('accessToken', accessToken);
    await this.saveToken('refreshToken', refreshToken);
    return { user, accessToken };
  }

  async appleLogin(idToken: string, firstName?: string, lastName?: string) {
    const response = await this.client.post('/auth/apple', { idToken, firstName, lastName });
    const { accessToken, refreshToken, user } = response.data;
    await this.saveToken('accessToken', accessToken);
    await this.saveToken('refreshToken', refreshToken);
    return { user, accessToken };
  }

  async googleLogin(idToken: string) {
    // Though the requirement mentioned GET endpoints for Google, 
    // a common pattern for mobile is sending an idToken via POST.
    // However, I will stick to the requirement for the backend.
    // If the frontend needs to support the redirect flow, it would handle it via expo-auth-session.
    // But if we want a POST endpoint for Google too:
    const response = await this.client.post('/auth/google', { idToken });
    const { accessToken, refreshToken, user } = response.data;
    await this.saveToken('accessToken', accessToken);
    await this.saveToken('refreshToken', refreshToken);
    return { user, accessToken };
  }

  async register(email: string, password: string, name?: string) {
    const response = await this.client.post('/auth/register', { email, password, name });
    const { accessToken, refreshToken, user } = response.data;
    await this.saveToken('accessToken', accessToken);
    await this.saveToken('refreshToken', refreshToken);
    return { user, accessToken };
  }

  // User endpoints
  async getProfile() {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.put('/users/profile', data);
    return response.data;
  }

  // Prayer endpoints
  async getPrayerTimes(latitude: number, longitude: number, date?: string, method?: string) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    if (date) params.append('date', date);
    if (method) params.append('method', method);

    const response = await this.client.get(`/prayers/times?${params.toString()}`);
    return response.data;
  }

  async getTodayPrayerTimes() {
    const response = await this.client.get('/prayers/times/today');
    return response.data;
  }

  // Prayer Tracking endpoints
  async completePrayer(prayerName: string, date?: string) {
    const response = await this.client.post('/prayer/complete', { prayerName, date });
    return response.data;
  }

  async getPrayerStreak() {
    const response = await this.client.get('/prayer/streak');
    return response.data;
  }

  // Wudu endpoints
  async getWuduGuide() {
    const response = await this.client.get('/wudu/guide');
    return response.data;
  }

  // Athkar endpoints
  async getAthkarCategories() {
    const response = await this.client.get('/athkar/categories');
    return response.data;
  }

  async getAthkarByCategory(category: string) {
    const response = await this.client.get(`/athkar/category/${category}`);
    return response.data;
  }

  async getRandomAthkar(category: string) {
    const response = await this.client.get(`/athkar/random/${category}`);
    return response.data;
  }

  // Fiqh endpoints
  async streamFiqhAsk(query: string, onChunk: (text: string) => void) {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/fiqh/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Fiqh response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      // Fallback if reader is not available (some older RN versions)
      const text = await response.text();
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content;
            if (content) onChunk(content);
          } catch (e) {}
        }
      }
      return;
    }

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const text = json.choices[0]?.delta?.content;
              if (text) {
                onChunk(text);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    }
  }

  // Location endpoints
  async getQibla(latitude: number, longitude: number) {
    const response = await this.client.get('/location/qibla', {
      params: { latitude, longitude },
    });
    return response.data;
  }

  async getNearbyMosques(latitude: number, longitude: number, radius?: number) {
    const response = await this.client.get('/location/mosques', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Calendar endpoints
  async getCalendarEvents(year?: number) {
    const params = year ? { year: year.toString() } : {};
    const response = await this.client.get('/calendar/events', { params });
    return response.data;
  }

  async getNextEvent() {
    const response = await this.client.get('/calendar/next-event');
    return response.data;
  }

  // Subscription endpoints
  async getSubscription() {
    const response = await this.client.get('/subscription');
    return response.data;
  }

  // Style endpoints
  async getOutfitSuggestion(latitude?: number, longitude?: number) {
    const params: any = {};
    if (latitude) params.latitude = latitude;
    if (longitude) params.longitude = longitude;
    const response = await this.client.get('/style/outfit-suggestion', { params });
    return response.data;
  }

  async createCheckoutSession(plan: string) {
    const response = await this.client.post('/subscription/create-checkout-session', { plan });
    return response.data;
  }

  async createNativeSubscription(plan: string) {
    const response = await this.client.post('/subscription/create-subscription', { plan });
    return response.data;
  }

  // Notifications endpoints
  async registerFcmToken(fcmToken: string) {
    const response = await this.client.post('/notifications/token', { fcmToken });
    return response.data;
  }

  async updateNotificationSettings(settings: any) {
    const response = await this.client.patch('/notifications/settings', settings);
    return response.data;
  }

  // Quran endpoints
  async getQuranGoals() {
    const response = await this.client.get('/quran/goals');
    return response.data;
  }

  async createQuranGoal(data: any) {
    const response = await this.client.post('/quran/goals', data);
    return response.data;
  }

  async logQuranProgress(data: any) {
    const response = await this.client.post('/quran/progress', data);
    return response.data;
  }

  async getQuranProgress() {
    const response = await this.client.get('/quran/progress');
    return response.data;
  }

  async getQuranStreak() {
    const response = await this.client.get('/quran/streak');
    return response.data;
  }

  async getQuranReflections() {
    const response = await this.client.get('/quran/reflections');
    return response.data;
  }

  // Zakat & Sadaqah endpoints
  async getZakatSummary() {
    const response = await this.client.get('/zakat/summary');
    return response.data;
  }

  async addZakatAsset(data: any) {
    const response = await this.client.post('/zakat/assets', data);
    return response.data;
  }

  async logSadaqah(data: any) {
    const response = await this.client.post('/zakat/sadaqah', data);
    return response.data;
  }

  // Circles endpoints
  async getMyCircles() {
    const response = await this.client.get('/circles');
    return response.data;
  }

  async createCircle(data: any) {
    const response = await this.client.post('/circles', data);
    return response.data;
  }

  async joinCircle(inviteCode: string) {
    const response = await this.client.post('/circles/join', { inviteCode });
    return response.data;
  }

  async getCircleDetails(circleId: string) {
    const response = await this.client.get(`/circles/${circleId}`);
    return response.data;
  }

  async getCircleLeaderboard(circleId: string, period: string = 'weekly') {
    const response = await this.client.get(`/circles/${circleId}/leaderboard`, { params: { period } });
    return response.data;
  }

  async sendCirclePing(circleId: string, targetUserId: string) {
    const response = await this.client.post(`/circles/${circleId}/members/${targetUserId}/ping`);
    return response.data;
  }

  // Khatm endpoints
  async getCircleKhatms(circleId: string) {
    const response = await this.client.get(`/quran/circles/${circleId}/khatm`);
    return response.data;
  }

  async createCircleKhatm(circleId: string, data: any) {
    const response = await this.client.post(`/quran/circles/${circleId}/khatm`, data);
    return response.data;
  }

  async claimKhatmPart(khatmId: string, juzNumber: number) {
    const response = await this.client.post(`/quran/khatm/${khatmId}/claim`, { juzNumber });
    return response.data;
  }

  async completeKhatmPart(khatmId: string, juzNumber: number) {
    const response = await this.client.post(`/quran/khatm/${khatmId}/complete`, { juzNumber });
    return response.data;
  }

  // Athkar Completion
  async logAthkarCompletion(data: any) {
    const response = await this.client.post('/athkar/complete', data);
    return response.data;
  }

  // Dream Journal endpoints
  async getDreams() {
    const response = await this.client.get('/dreams');
    return response.data;
  }

  async createDream(data: any) {
    const response = await this.client.post('/dreams', data);
    return response.data;
  }

  async getDreamDetails(id: string) {
    const response = await this.client.get(`/dreams/${id}`);
    return response.data;
  }

  async interpretDream(id: string) {
    const response = await this.client.post(`/dreams/${id}/interpret`);
    return response.data;
  }

  async deleteDream(id: string) {
    const response = await this.client.delete(`/dreams/${id}`);
    return response.data;
  }

  async streamZakatAsk(query: string, onChunk: (text: string) => void) {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/zakat/ask-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Zakat AI response');
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const json = JSON.parse(data);
              if (json.text) {
                onChunk(json.text);
              }
            } catch (e) {}
          }
        }
      }
    }
  }
}

export const apiClient = new ApiClient();
