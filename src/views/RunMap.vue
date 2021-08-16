<template>
  <div>
    <div id="map"></div>
  </div>
</template>
<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";

export default {
  props: ["run"],
  mounted: function () {
    this.doMapBox();
  },
  data: function () {
    return {
      routeCoordinates: [],
    };
  },
  methods: {
    doMapBox: function () {
      console.log("goooo");
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API;
      if (this.run.is_strava_import) {
        let route = polyline.toGeoJSON(this.run.summary_polyline);
        this.routeCoordinates = route.coordinates;
        let centerLng = this.median(
          this.routeCoordinates.map((pair) => pair[0])
        );
        let centerLat = this.median(
          this.routeCoordinates.map((pair) => pair[1])
        );
        const map = new mapboxgl.Map({
          container: "map", // container ID
          style: "mapbox://styles/mapbox/navigation-night-v1", // style URL
          center: [centerLng, centerLat], // starting position
          zoom: 13, // starting zoom
          interactive: false,
        });
        map.on("load", () => {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: route.type,
                coordinates: route.coordinates,
              },
            },
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 8,
            },
          });
        });
      } else {
        new mapboxgl.Map({
          container: "map", // container ID
          style: "mapbox://styles/mapbox/navigation-night-v1", // style URL
          center: [this.run.start_longitude, this.run.start_latitude], // starting position
          zoom: 13, // starting zoom
          interactive: false,
        });
      }
    },
    median: function (coordinates) {
      const mid = Math.floor(coordinates.length / 2),
        nums = [...coordinates].sort((a, b) => a - b);
      return coordinates.length % 2 !== 0
        ? nums[mid]
        : (nums[mid - 1] + nums[mid]) / 2;
    },
  },
};
</script>
