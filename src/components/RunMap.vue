<template>
  <div>
    <div id="map"></div>
  </div>
</template>
<style>
#marker {
  background-image: url("https://images.emojiterra.com/google/android-10/512px/1f3c3-2642.png");
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
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
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API;
      if (this.run.is_strava_import) {
        let route = polyline.toGeoJSON(this.run.summary_polyline);
        this.routeCoordinates = route.coordinates;
        let centerLng = this.midpoint(
          this.routeCoordinates.map((pair) => pair[0])
        );
        let centerLat = this.midpoint(
          this.routeCoordinates.map((pair) => pair[1])
        );
        const map = new mapboxgl.Map({
          container: "map", // container ID
          style: "mapbox://styles/mapbox/navigation-day-v1", // style URL
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
              "line-color": "#4C5CFA",
              "line-width": 8,
            },
          });
        });
      } else {
        const map = new mapboxgl.Map({
          container: "map", // container ID
          style: "mapbox://styles/mapbox/navigation-day-v1", // style URL
          center: [this.run.start_longitude, this.run.start_latitude], // starting position
          zoom: 13, // starting zoom
          interactive: false,
        });
        const el = document.createElement("div");
        el.id = "marker";
        new mapboxgl.Marker(el)
          .setLngLat([this.run.start_longitude, this.run.start_latitude])
          .addTo(map);
      }
    },
    midpoint: function (array) {
      let max = array[0];
      let min = array[0];
      array.forEach((number) => {
        if (number > max) {
          max = number;
        }
        if (number < min) {
          min = number;
        }
      });
      return (max + min) / 2;
    },
  },
};
</script>
