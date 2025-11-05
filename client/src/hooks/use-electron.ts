import { useEffect, useState } from 'react';
import { isElectron, getElectronAPI, type WadahAPI } from '@/lib/electron';

/**
 * Hook to detect if running in Electron and get the API
 */
export function useElectron() {
  const [isElectronApp, setIsElectronApp] = useState(false);
  const [api, setApi] = useState<WadahAPI | null>(null);

  useEffect(() => {
    setIsElectronApp(isElectron());
    setApi(getElectronAPI());
  }, []);

  return {
    isElectron: isElectronApp,
    api
  };
}


