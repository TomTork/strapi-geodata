import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { F as ForwardRef } from "./index-BRG6ORBJ.mjs";
import { Box, Typography, TextInput, Button, JSONInput } from "@strapi/design-system";
import "leaflet/dist/leaflet.css";
const version = "0.1.02";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});
const mapProps = {
  zoom: 7,
  center: [41.9, 12.5],
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution: "OSM attribution",
  tileAccessToken: ""
};
const Input = (props) => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(props.value);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const searchRef = useRef(null);
  const onMapClick = useCallback(
    (e) => {
      setLocation(e.latlng);
    },
    [map]
  );
  useEffect(() => {
    if (!map) return;
    map.on("contextmenu", onMapClick);
    return () => {
      map.off("contextmenu", onMapClick);
    };
  }, [map, onMapClick]);
  useEffect(() => {
    props.onChange({
      target: {
        name: props.name,
        value: location,
        type: props.attribute.type
      }
    });
  }, [location]);
  async function searchLocation(e) {
    let search = searchRef.current?.value;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      let lat = parseFloat(data[0].lat);
      let lng = parseFloat(data[0].lon);
      setLocation({ lat, lng });
      map.panTo({ lat, lng });
    }
  }
  async function setLatLng() {
    let lat = latRef.current?.value;
    let lng = lngRef.current?.value;
    if (lat && lng) {
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      setLocation({ lat, lng });
      map.panTo({ lat, lng });
    }
  }
  const marginBottom = "2rem";
  const display = "block";
  return /* @__PURE__ */ jsxs(Box, { children: [
    /* @__PURE__ */ jsxs(Typography, { variant: "delta", style: { marginBottom, display }, children: [
      /* @__PURE__ */ jsx(ForwardRef, { style: { width: "3rem", height: "3rem" } }),
      " ",
      props.label,
      " v ",
      version
    ] }),
    /* @__PURE__ */ jsx(Typography, { variant: "omega", style: { marginBottom, display }, children: "To set the location, enter the coordinates and click on 'Set Location', or search for an address and press 'Search', or navigate on the map and right-click" }),
    /* @__PURE__ */ jsxs(Box, { style: { display: "grid", gridTemplateColumns: "2fr 2fr 1fr", marginBottom }, children: [
      /* @__PURE__ */ jsx(TextInput, { ref: latRef, name: "lat", placeholder: "Latitude" }),
      /* @__PURE__ */ jsx(TextInput, { ref: lngRef, name: "lng", placeholder: "Longitude" }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: setLatLng, size: "L", children: "Set Location" })
    ] }),
    /* @__PURE__ */ jsxs(Box, { style: { display: "grid", gridTemplateColumns: "4fr 1fr", marginBottom }, children: [
      /* @__PURE__ */ jsx(TextInput, { ref: searchRef, name: "search", placeholder: "Address to search" }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: searchLocation, size: "L", children: "Search" })
    ] }),
    /* @__PURE__ */ jsx(Box, { style: { display: "flex", height: "300px", width: "100%", marginBottom }, children: /* @__PURE__ */ jsx(Box, { style: { width: "100% " }, children: /* @__PURE__ */ jsxs(
      MapContainer,
      {
        zoom: mapProps.zoom,
        center: props.value?.lat && props.value?.lng ? [props.value?.lat, props.value?.lng] : mapProps.center,
        ref: setMap,
        style: { height: "300px", zIndex: 299 },
        children: [
          /* @__PURE__ */ jsx(
            TileLayer,
            {
              attribution: mapProps.tileAttribution,
              url: mapProps.tileUrl,
              accessToken: mapProps.tileAccessToken
            }
          ),
          location && /* @__PURE__ */ jsx(Marker, { position: [location?.lat, location?.lng], icon: customIcon })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxs(Box, { style: { marginBottom }, children: [
      /* @__PURE__ */ jsxs(Typography, { variant: "delta", style: { marginBottom, display }, children: [
        "Current ",
        props.label,
        " value:"
      ] }),
      /* @__PURE__ */ jsx(
        JSONInput,
        {
          disabled: true,
          name: props.name,
          value: JSON.stringify(props.value, null, 2),
          onChange: (e) => setLocation(e),
          style: { height: "9rem" }
        }
      )
    ] })
  ] });
};
export {
  Input as default
};
