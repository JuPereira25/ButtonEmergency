import { ButtonEmergency, Logs, Maps } from "@/components"
import { useEmergencyHub } from "@/hooks/useEmergencyHub"
import styles from "./Home.module.css"

function Home() {
  const { active, patientName, inTransit, logs, position, sendAmbulance } =
    useEmergencyHub()

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <ButtonEmergency
          active={active}
          patientName={patientName}
          inTransit={inTransit}
          onSend={sendAmbulance}
        />
        <Logs items={logs} />
      </aside>

      <main className={styles.mapArea}>
        <Maps position={position} />
      </main>
    </div>
  )
}

export default Home
