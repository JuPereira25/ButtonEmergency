import { useEffect, useRef, useState } from "react"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import type { LogItem } from "@/components"

// hook que liga o front no backend pelo SignalR (websocket)
export function useEmergencyHub() {
  const [active, setActive] = useState(false) // se a emergência já foi acionada
  const [patientName, setPatientName] = useState("")
  const [inTransit, setInTransit] = useState(false) // depois que aperta enviar ambulância
  const [logs, setLogs] = useState<LogItem[]>([])
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const connection = useRef<HubConnection | null>(null)

  useEffect(() => {
    // conecta no hub do backend
    const hub = new HubConnectionBuilder()
      .withUrl("/emergencyHub")
      .withAutomaticReconnect()
      .build()

    // chega a mensagem da serial (nome, endereço, gps)
    hub.on("ReceiveEvent", (data: any) => {
      setActive(true)
      if (data.name) setPatientName(data.name)

      setLogs((old) => [
        ...old,
        {
          id: String(Date.now()),
          label: "Emergência Acionada",
          time: new Date().toLocaleTimeString("pt-BR"),
          address: data.address,
          lat: data.latitude,
          lng: data.longitude,
        },
      ])

      if (data.latitude && data.longitude) {
        setPosition({ lat: data.latitude, lng: data.longitude })
      }
    })

    // quando alguém clica em enviar ambulância
    hub.on("Resolved", () => setInTransit(true))
    hub.start()
    connection.current = hub

    // fecha a conexão se sair da página
    return () => {
      hub.stop()
    }
  }, [])

  function sendAmbulance() {
    if (inTransit) return
    setInTransit(true)
    connection.current?.invoke("MarkResolved")
  }

  return { active, patientName, inTransit, logs, position, sendAmbulance }
}
