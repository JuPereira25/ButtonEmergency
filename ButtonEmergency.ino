/*
  Botão de Emergência — firmware Arduino 
  --------------------------------------------------------------------------
  Lê o botão no pino D2 (GND + pull-up interno). Ao ser pressionado, envia
  pela Serial uma linha em JSON com os dados cadastrados abaixo:

    {"event":"EMERGENCIA","name":"Lucas Souza","address":"R. Urucum, 176-196 - Coroado"}

  Pra trocar nome/endereço, edite as duas linhas em NOME_PESSOA e
  ENDERECO logo abaixo.

*/

const int BUTTON_PIN = 2;
const unsigned long DEBOUNCE_MS = 40;

// ---- Dados enviados junto com o evento de emergência ----
const char* NOME_PESSOA = "Lucas Souza";
const char* ENDERECO = "Avenida Buriti, Manaus/Amazonas";

int lastRawState = HIGH;
int stableState = HIGH;
unsigned long lastChangeTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  handleButton();
}

void handleButton() {
  int rawState = digitalRead(BUTTON_PIN);

  // Se o estado bruto mudou, reinicia a contagem de debounce
  if (rawState != lastRawState) {
    lastChangeTime = millis();
  }

  // Só aceita o novo estado como "estável" depois do tempo de debounce
  if ((millis() - lastChangeTime) > DEBOUNCE_MS) {
    if (rawState != stableState) {
      stableState = rawState;

      // HIGH -> LOW significa que o botão foi pressionado agora
      if (stableState == LOW) {
        sendEmergency();
      }
    }
  }

  lastRawState = rawState;
}

void sendEmergency() {
  Serial.print("{\"event\":\"EMERGENCIA\",\"name\":\"");
  Serial.print(NOME_PESSOA);
  Serial.print("\",\"address\":\"");
  Serial.print(ENDERECO);
  Serial.println("\"}");
}