import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ZakatSummary, AddZakatAssetRequest, LogSadaqahRequest } from '@tariq/shared';

export const useZakat = () => {
  const [summary, setSummary] = useState<ZakatSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getZakatSummary();
      if (response.success) {
        setSummary(response.data);
      } else {
        setError(response.error || 'Failed to fetch summary');
      }
    } catch (err) {
      setError('An error occurred while fetching summary');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (data: AddZakatAssetRequest) => {
    try {
      const response = await apiClient.addZakatAsset(data);
      if (response.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Failed to add asset' };
    }
  };

  const logSadaqah = async (data: LogSadaqahRequest) => {
    try {
      const response = await apiClient.logSadaqah(data);
      if (response.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Failed to log sadaqah' };
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    fetchSummary,
    addAsset,
    logSadaqah,
  };
};
