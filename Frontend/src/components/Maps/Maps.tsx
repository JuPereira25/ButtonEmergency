import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import styles from "./Maps.module.css"

type Props = {
  position: { lat: number; lng: number } | null
}

function Maps({ position }: Props) {
  const mapDiv = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.CircleMarker | null>(null)

  useEffect(() => {
    if (!mapDiv.current) return

    map.current = L.map(mapDiv.current, { zoomControl: false }).setView(
      [-3.119, -60.0217],
      14,
    )

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map.current)

    setTimeout(() => map.current?.invalidateSize(), 100)

    return () => {
      map.current?.remove()
      map.current = null
      marker.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current || !position) return

    const point: L.LatLngExpression = [position.lat, position.lng]
    map.current.setView(point, 16)

    if (!marker.current) {
      marker.current = L.circleMarker(point, {
        radius: 10,
        color: "#fff",
        weight: 2,
        fillColor: "#e11d48",
        fillOpacity: 1,
        className: "panic-blink",
      }).addTo(map.current)
    } else {
      marker.current.setLatLng(point)
    }
  }, [position])

  return <div ref={mapDiv} className={styles.map} />
}

export default Maps
