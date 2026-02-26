// Google Maps Helper - Validates API key and provides fallbacks

export interface MapsConfig {
  apiKey: string;
  isValid: boolean;
  apisEnabled: string[];
}

/**
 * Validates Google Maps API key by making a test request
 */
export async function validateMapsApiKey(apiKey: string): Promise<MapsConfig> {
  const config: MapsConfig = {
    apiKey,
    isValid: false,
    apisEnabled: [],
  };

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return config;
  }

  try {
    // Test Maps JavaScript API
    const mapsTestUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

    const response = await fetch(mapsTestUrl, { method: 'HEAD' });

    if (response.ok) {
      config.isValid = true;
      config.apisEnabled = ['MapsJavaScriptAPI'];
    }
  } catch (error) {
    console.warn('Maps API validation failed:', error);
  }

  return config;
}

/**
 * Checks if the Maps SDK is loaded and available
 */
export function isMapsSdkLoaded(): boolean {
  return typeof window !== 'undefined' && window.google?.maps !== undefined;
}

/**
 * Gets a user-friendly error message based on common issues
 */
export function getMapsErrorMessage(error: any): string {
  const errorMessages: Record<string, string> = {
    'RefererNotAllowed':
      'Google Maps API key is not authorized for this domain. Please add your domain to the API key restrictions in Google Cloud Console.',
    'InvalidCredentials':
      'The Google Maps API key is invalid. Please check your VITE_GOOGLE_MAPS_API_KEY environment variable.',
    'QuotaExceeded':
      'Google Maps API quota has been exceeded. Please upgrade your quota or try again later.',
    'ApiNotActivated':
      'The Google Maps JavaScript API is not enabled. Please enable it in Google Cloud Console.',
    'NetworkError':
      'Network error while loading Google Maps. Please check your internet connection.',
  };

  if (error?.error === 'NetworkProxy/JS/data_check') {
    return 'Google Maps is trying to connect but may have API key restrictions. Some features may be limited.';
  }

  if (error?.message) {
    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.message.includes(key)) {
        return message;
      }
    }
  }

  return 'Unable to load Google Maps. Please check your API key configuration.';
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Calculate a fallback map URL (for opening in external app)
 */
export function getExternalMapsUrl(lat: number, lng: number, label?: string): string {
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
  });

  if (label) {
    params.set('q', label);
  }

  return `https://www.google.com/maps/search/?api=1&${params.toString()}`;
}
