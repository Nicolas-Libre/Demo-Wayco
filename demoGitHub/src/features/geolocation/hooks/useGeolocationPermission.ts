import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  isGeolocationAvailable,
  requestCurrentPosition,
  startPositionTracking,
  stopPositionTracking,
} from "../services/geolocation.service";

import {
  readGeoPermissionDecision,
  writeGeoPermissionDecision,
} from "../services/geolocation-permission.storage";

import type {
  GeoPermissionScope,
} from "../types/geolocation.types";

type UseGeolocationPermissionResult = {
  open: boolean;
  acceptPermission: () => void;
  denyPermission: () => void;
  closeSheet: () => void;
};

type UseGeolocationPermissionOptions = {
  scope: GeoPermissionScope;
  onGranted?: () => void;
  onDenied?: () => void;
  onRequestError?: (
    error: GeolocationPositionError,
  ) => void;
};

export function useGeolocationPermission({
  scope,
  onGranted,
  onDenied,
  onRequestError,
}: UseGeolocationPermissionOptions): UseGeolocationPermissionResult {
  const [open, setOpen] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    stopPositionTracking(watchIdRef.current);
    watchIdRef.current = null;
  }, []);

  const startTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      return;
    }

    watchIdRef.current = startPositionTracking();
  }, []);

  useEffect(() => {
    if (!isGeolocationAvailable()) {
      return;
    }

    const previousDecision =
      readGeoPermissionDecision(scope);

    if (previousDecision === "granted") {
      startTracking();
      return stopTracking;
    }

    if (previousDecision === "denied") {
      return stopTracking;
    }

    const timeoutId = window.setTimeout(() => {
      setOpen(true);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      stopTracking();
    };
  }, [scope, startTracking, stopTracking]);

  const acceptPermission = useCallback(() => {
    setOpen(false);

    requestCurrentPosition(
      () => {
        writeGeoPermissionDecision(
          scope,
          "granted",
        );

        startTracking();
        onGranted?.();
      },
      (error) => {
        writeGeoPermissionDecision(
          scope,
          "denied",
        );

        onRequestError?.(error);
      },
    );
  }, [
    scope,
    startTracking,
    onGranted,
    onRequestError,
  ]);

  const denyPermission = useCallback(() => {
    setOpen(false);

    writeGeoPermissionDecision(
      scope,
      "denied",
    );

    onDenied?.();
  }, [scope, onDenied]);

  const closeSheet = useCallback(() => {
    denyPermission();
  }, [denyPermission]);

  return {
    open,
    acceptPermission,
    denyPermission,
    closeSheet,
  };
}
