import type React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { PlasmicComponentLoader } from "@plasmicapp/loader-react";

/* ─── MapBubble (speech-bubble label) ─── */

export interface MapBubbleProps {
  background?: string;
  color?: string;
  borderRadius?: number;
  arrowSize?: number;
  children?: React.ReactNode;
  className?: string;
}

export const MapBubble: React.FC<MapBubbleProps> = ({
  background = "#333",
  color = "#fff",
  borderRadius = 4,
  arrowSize = 6,
  children,
  className,
}) => {
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          background,
          color,
          padding: "4px 8px",
          borderRadius,
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${background}`,
        }}
      />
    </div>
  );
};

/* ─── MapPin (child component) ─── */

export interface MapPinProps {
  lat: number;
  lng: number;
  zIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const MapPin: React.FC<MapPinProps> = ({
  lat,
  lng,
  zIndex,
  className,
  children,
}) => {
  const defaultZIndex = 90 - lat;
  return (
    <AdvancedMarker
      position={{ lat, lng }}
      zIndex={zIndex ?? defaultZIndex}
      className={className}
    >
      {children}
    </AdvancedMarker>
  );
};

/* ─── GoogleMap (parent component) ─── */

export interface GoogleMapProps {
  apiKey: string;
  mapId?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  children?: React.ReactNode;
  showControls?: boolean;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  mapId,
  centerLat = 51.9225,
  centerLng = 4.47917,
  zoom = 12,
  children,
  showControls = true,
  className,
}) => {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className={className}
        defaultCenter={{ lat: centerLat, lng: centerLng }}
        defaultZoom={zoom}
        mapId={mapId}
        disableDefaultUI={!showControls}
        zoomControl={showControls}
        streetViewControl={showControls}
        mapTypeControl={false}
        fullscreenControl={showControls}
      >
        {children}
      </Map>
    </APIProvider>
  );
};

/* ─── Plasmic Registration ─── */

export function registerGoogleMap(loader: PlasmicComponentLoader) {
  loader.registerComponent(MapBubble, {
    name: "MapBubble",
    displayName: "Map Bubble",
    description: "A speech-bubble label with an arrow pointer",
    props: {
      background: {
        type: "color",
        displayName: "Background",
        defaultValue: "#333",
      },
      color: {
        type: "color",
        displayName: "Text Color",
        defaultValue: "#fff",
      },
      borderRadius: {
        type: "number",
        displayName: "Border Radius",
        defaultValue: 4,
      },
      arrowSize: {
        type: "number",
        displayName: "Arrow Size",
        defaultValue: 6,
      },
      children: {
        type: "slot",
        displayName: "Content",
        defaultValue: [
          {
            type: "text",
            value: "Label",
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });

  loader.registerComponent(MapPin, {
    name: "MapPin",
    displayName: "Map Pin",
    description: "A marker pin to place inside a Google Map",
    parentComponentName: "GoogleMap",
    defaultStyles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    props: {
      lat: {
        type: "number",
        displayName: "Latitude",
        defaultValue: 51.9225,
      },
      lng: {
        type: "number",
        displayName: "Longitude",
        defaultValue: 4.47917,
      },
      zIndex: {
        type: "number",
        displayName: "Z-Index",
        description: "Stacking order of the pin",
      },
      children: {
        type: "slot",
        displayName: "Content",
        defaultValue: [
          {
            type: "text",
            value: "Location",
            styles: {
              background: "white",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              marginBottom: "4px",
            },
          },
          {
            type: "img",
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Cpath fill='rgb(230,99,99)' d='M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z'/%3E%3C/svg%3E",
            styles: {
              width: "45px",
              display: "block",
            },
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });

  loader.registerComponent(GoogleMap, {
    name: "GoogleMap",
    displayName: "Google Map",
    description: "Google Maps component with custom styling",
    props: {
      apiKey: {
        type: "string",
        displayName: "API Key",
        description: "Google Maps API key",
        defaultValue: "",
      },
      mapId: {
        type: "string",
        displayName: "Map ID",
        description: "Google Maps Map ID (required for custom markers)",
        defaultValue: "",
      },
      centerLat: {
        type: "number",
        displayName: "Center Latitude",
        description: "Latitude of the map center",
        defaultValue: 51.9225,
      },
      centerLng: {
        type: "number",
        displayName: "Center Longitude",
        description: "Longitude of the map center",
        defaultValue: 4.47917,
      },
      zoom: {
        type: "number",
        displayName: "Zoom Level",
        description: "Map zoom level (1-20)",
        defaultValue: 12,
      },
      showControls: {
        type: "boolean",
        displayName: "Show Controls",
        description: "Show map controls (zoom, street view, fullscreen)",
        defaultValue: true,
      },
      children: {
        type: "slot",
        displayName: "Pins",
        description: "Map Pin markers to display on the map",
        allowedComponents: ["MapPin"],
        defaultValue: [
          {
            type: "component",
            name: "MapPin",
            props: {
              lat: 51.9225,
              lng: 4.47917,
            },
            styles: {
              alignItems: "center",
            },
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });
}
