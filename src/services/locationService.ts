// Location Tracking Service for Walk With Me feature
// Handles geolocation, distance calculations, ETA, and movement detection

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState extends Coordinates {
  timestamp: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
}

export interface DestinationInfo extends Coordinates {
  address: string;
  name?: string;
}

export interface MovementStatus {
  isMoving: boolean;
  speed: number; // m/s
  lastMovementTime: number;
  distanceFromLastUpdate: number; // meters
}

export interface WalkWithMeState {
  currentLocation: LocationState | null;
  destination: DestinationInfo | null;
  homeLocation: Coordinates | null;
  route: Coordinates[];
  isTracking: boolean;
  mode: 'OUTSIDE' | 'AT_HOME';
  safetyStatus: 'SAFE' | 'UNSAFE';
  unsafeDuration: number; // seconds
  movementStatus: MovementStatus;
  eta: number | null; // seconds
  deviationDetected: boolean;
  lastDeviationCheck: number;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Calculate ETA based on walking speed
export function calculateETA(
  currentLocation: Coordinates,
  destination: Coordinates,
  walkingSpeedMps: number = 1.4 // Average walking speed: 1.4 m/s (~3.1 mph)
): number {
  const distance = calculateDistance(currentLocation, destination);
  return Math.ceil(distance / walkingSpeedMps); // ETA in seconds
}

// Check if user is within geofence radius of home
export function isWithinGeofence(
  currentLocation: Coordinates,
  homeLocation: Coordinates,
  radiusMeters: number = 20
): boolean {
  const distance = calculateDistance(currentLocation, homeLocation);
  return distance <= radiusMeters;
}

// Calculate bearing between two points
export function calculateBearing(
  start: Coordinates,
  end: Coordinates
): number {
  const φ1 = (start.latitude * Math.PI) / 180;
  const φ2 = (end.latitude * Math.PI) / 180;
  const Δλ = ((end.longitude - start.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360; // Bearing in degrees
}

// Check if user is deviating from expected route
export function checkRouteDeviation(
  currentLocation: Coordinates,
  destination: Coordinates,
  expectedBearing: number,
  toleranceDegrees: number = 45
): boolean {
  const actualBearing = calculateBearing(currentLocation, destination);
  const bearingDiff = Math.abs(actualBearing - expectedBearing);

  // Handle wrap-around at 360/0 degrees
  const minDiff = Math.min(bearingDiff, 360 - bearingDiff);

  return minDiff > toleranceDegrees;
}

// Get user's current location
export function getCurrentLocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000,
  }
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Watch user's location changes
export function watchLocation(
  callback: (position: GeolocationPosition) => void,
  errorCallback?: (error: GeolocationPositionError) => void,
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000,
  }
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser');
  }

  return navigator.geolocation.watchPosition(callback, errorCallback, options);
}

// Stop watching location
export function clearLocationWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

// Analyze movement pattern
export function analyzeMovement(
  previousLocation: LocationState,
  currentLocation: LocationState
): MovementStatus {
  const distance = calculateDistance(previousLocation, currentLocation);
  const timeDiff = (currentLocation.timestamp - previousLocation.timestamp) / 1000; // seconds

  // Calculate speed (m/s)
  const speed = timeDiff > 0 ? distance / timeDiff : 0;

  // Determine if moving (threshold: 0.5 m/s)
  const isMoving = speed > 0.5;

  return {
    isMoving,
    speed,
    lastMovementTime: isMoving ? currentLocation.timestamp : previousLocation.lastMovementTime,
    distanceFromLastUpdate: distance,
  };
}

// Check if user has been immobile for too long
export function isImmobileTooLong(
  movementStatus: MovementStatus,
  thresholdSeconds: number = 60
): boolean {
  if (movementStatus.isMoving) return false;

  const timeSinceLastMovement = (Date.now() - movementStatus.lastMovementTime) / 1000;
  return timeSinceLastMovement > thresholdSeconds;
}

// Reverse geocode (get address from coordinates)
// Note: This would require Google Maps Geocoding API
export async function reverseGeocode(
  coordinates: Coordinates,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results?.length > 0) {
      return data.results[0].formatted_address;
    }

    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  }
}

// Get directions from Google Maps Directions API
export async function getDirections(
  origin: Coordinates,
  destination: Coordinates,
  apiKey: string,
  mode: google.maps.TravelMode = 'WALKING'
): Promise<{
  distance: number; // meters
  duration: number; // seconds
  steps: google.maps.DirectionsStep[];
  polyline: string;
}> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Directions request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.routes?.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.value,
        duration: leg.duration.value,
        steps: leg.steps,
        polyline: route.overview_polyline.points,
      };
    }

    throw new Error('No directions found');
  } catch (error) {
    console.error('Get directions error:', error);
    throw error;
  }
}

// Walk With Me state manager
class WalkWithMeManager {
  private state: WalkWithMeState = {
    currentLocation: null,
    destination: null,
    homeLocation: null,
    route: [],
    isTracking: false,
    mode: 'OUTSIDE',
    safetyStatus: 'SAFE',
    unsafeDuration: 0,
    movementStatus: {
      isMoving: false,
      speed: 0,
      lastMovementTime: Date.now(),
      distanceFromLastUpdate: 0,
    },
    eta: null,
    deviationDetected: false,
    lastDeviationCheck: Date.now(),
  };

  private watchId: number | null = null;
  private stateUpdateCallback?: (state: WalkWithMeState) => void;
  private unsafeDurationInterval?: NodeJS.Timeout;
  private aiResponseInterval?: NodeJS.Timeout;

  // Initialize the manager
  initialize(
    homeLocation: Coordinates,
    onStateUpdate?: (state: WalkWithMeState) => void
  ) {
    this.state.homeLocation = homeLocation;
    this.stateUpdateCallback = onStateUpdate;
  }

  // Start tracking location
  async startTracking(destination?: DestinationInfo) {
    if (this.state.isTracking) return;

    this.state.isTracking = true;
    this.state.destination = destination || null;

    // Get initial location
    try {
      const position = await getCurrentLocation();
      this.updateLocation(position);

      // Check if at home
      if (this.state.homeLocation && this.state.currentLocation) {
        this.updateMode();
      }

      // Calculate ETA if destination is set
      if (this.state.destination) {
        this.state.eta = calculateETA(
          this.state.currentLocation,
          this.state.destination
        );
      }

      // Start watching location
      this.watchId = watchLocation(
        (position) => this.updateLocation(position),
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );

      // Start unsafe duration timer
      this.unsafeDurationInterval = setInterval(() => {
        if (this.state.safetyStatus === 'UNSAFE') {
          this.state.unsafeDuration += 1;
        }
        this.notifyStateUpdate();
      }, 1000);

      // Notify initial state
      this.notifyStateUpdate();
    } catch (error) {
      console.error('Failed to start tracking:', error);
      throw error;
    }
  }

  // Stop tracking location
  stopTracking() {
    if (this.watchId !== null) {
      clearLocationWatch(this.watchId);
      this.watchId = null;
    }

    if (this.unsafeDurationInterval) {
      clearInterval(this.unsafeDurationInterval);
    }

    if (this.aiResponseInterval) {
      clearInterval(this.aiResponseInterval);
    }

    this.state.isTracking = false;
    this.state.safetyStatus = 'SAFE';
    this.state.unsafeDuration = 0;

    this.notifyStateUpdate();
  }

  // Set destination
  setDestination(destination: DestinationInfo) {
    this.state.destination = destination;

    if (this.state.currentLocation) {
      this.state.eta = calculateETA(
        this.state.currentLocation,
        destination
      );
    }

    this.notifyStateUpdate();
  }

  // Update location
  private updateLocation(position: GeolocationPosition) {
    const newLocation: LocationState = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: Date.now(),
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
    };

    // Analyze movement if we have a previous location
    if (this.state.currentLocation) {
      this.state.movementStatus = analyzeMovement(
        this.state.currentLocation,
        newLocation
      );
    }

    this.state.currentLocation = newLocation;

    // Update mode based on location (geofencing)
    this.updateMode();

    // Update ETA
    if (this.state.destination) {
      this.state.eta = calculateETA(newLocation, this.state.destination);
    }

    // Check for deviation (every 30 seconds)
    const now = Date.now();
    if (this.state.destination && now - this.state.lastDeviationCheck > 30000) {
      this.checkDeviation();
      this.state.lastDeviationCheck = now;
    }

    // Check for safety concerns
    this.checkSafetyStatus();

    this.notifyStateUpdate();
  }

  // Update mode based on geofencing
  private updateMode() {
    if (!this.state.homeLocation || !this.state.currentLocation) return;

    const atHome = isWithinGeofence(
      this.state.currentLocation,
      this.state.homeLocation
    );

    this.state.mode = atHome ? 'AT_HOME' : 'OUTSIDE';
  }

  // Check for route deviation
  private checkDeviation() {
    if (!this.state.currentLocation || !this.state.destination) return;

    // Simple deviation check: if distance is increasing
    if (this.state.route.length > 1) {
      const prevDistance = calculateDistance(
        this.state.route[this.state.route.length - 2],
        this.state.destination
      );
      const currentDistance = calculateDistance(
        this.state.currentLocation,
        this.state.destination
      );

      // If distance increased significantly (>50m), mark as deviation
      if (currentDistance > prevDistance + 50) {
        this.state.deviationDetected = true;
        this.state.safetyStatus = 'UNSAFE';
      }
    }

    // Add to route history (max 10 points)
    this.state.route.push({
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
    });

    if (this.state.route.length > 10) {
      this.state.route.shift();
    }
  }

  // Check safety status
  private checkSafetyStatus() {
    const { movementStatus } = this.state;

    // Check if user has been immobile too long (while outside)
    if (
      this.state.mode === 'OUTSIDE' &&
      isImmobileTooLong(movementStatus, 120) // 2 minutes
    ) {
      this.state.safetyStatus = 'UNSAFE';
    }

    // Check for deviation
    if (this.state.deviationDetected) {
      this.state.safetyStatus = 'UNSAFE';
    }
  }

  // Manual safety status update
  setSafetyStatus(status: 'SAFE' | 'UNSAFE') {
    this.state.safetyStatus = status;

    if (status === 'SAFE') {
      this.state.unsafeDuration = 0;
      this.state.deviationDetected = false;
    }

    this.notifyStateUpdate();
  }

  // Get current state
  getState(): WalkWithMeState {
    return { ...this.state };
  }

  // Notify state update
  private notifyStateUpdate() {
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(this.getState());
    }
  }
}

// Export singleton instance
export const walkWithMeManager = new WalkWithMeManager();
