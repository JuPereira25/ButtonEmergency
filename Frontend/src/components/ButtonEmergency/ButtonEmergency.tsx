import styles from "./ButtonEmergency.module.css"

type Props = {
  active: boolean
  patientName: string
  inTransit: boolean
  onSend: () => void
}

function ButtonEmergency({ active, patientName, inTransit, onSend }: Props) {
  return (
    <div className={`${styles.box} divider`}>
      <h1 className={`${styles.title} alert ${active ? "red" : ""}`}>
        {active ? "Emergência Acionada" : "Aguardando"}
      </h1>

      <p className={`${styles.patient} muted`}>
        Paciente: {patientName || "—"}
      </p>

      {active && (
        <button
          type="button"
          className={inTransit ? styles.transit : styles.button}
          onClick={onSend}
          disabled={inTransit}
        >
          {inTransit ? "Em trânsito" : "Enviar Ambulância"}
        </button>
      )}
    </div>
  )
}

export default ButtonEmergency
