import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/sonner";
import posthog from "posthog-js";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

posthog.init("phc_koQTZmGlqvAIdYCuEeXflz4Kn4b9DYdDur002krDsM", {
  api_host: "https://dropby-htn24.netlify.app/ingest",
  ui_host: "https://us.posthog.com",
  person_profiles: "always", // or 'always' to create profiles for anonymous users as well
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
      <Toaster />
    </ConvexProvider>
  </StrictMode>
);
