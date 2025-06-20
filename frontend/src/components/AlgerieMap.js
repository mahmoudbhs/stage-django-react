import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import algeriaGeo from "../pages/assets/custom.geo.json";

const AlgerieMap = ({ onWilayaClick, wilayaColors = {} }) => (
  <ComposableMap
    projection="geoMercator"
    projectionConfig={{
      scale: 1300,
      center: [3, 28]
    }}
    width={500}
    height={500}
    style={{ width: "100%", height: "auto" }}
  >
    <Geographies geography={algeriaGeo}>
      {({ geographies }) =>
        geographies.map((geo, i) => {
          // Pour la colorisation dynamique par wilaya
          const wilayaName =
            geo.properties.NAME_1 ||
            geo.properties.name ||
            geo.properties.NOM ||
            `Wilaya-${i}`;
          const fill =
            wilayaColors[wilayaName] ||
            "#E0E7FF"; // Par défaut bleu clair

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() =>
                onWilayaClick && onWilayaClick(wilayaName, geo)
              }
              style={{
                default: { fill, outline: "none", cursor: "pointer" },
                hover: { fill: "#E20010", outline: "none" },
                pressed: { fill: "#B91C1C", outline: "none" }
              }}
            />
          );
        })
      }
    </Geographies>
  </ComposableMap>
);

export default AlgerieMap;
