# Central de Emergência

Sistema com três partes: o código embarcado no Arduino (botão físico de emergência), o backend que lê a serial e o frontend que mostra o paciente e o mapa.

## O que precisa

- .NET 10
- Node.js
- Arduino na porta **COM3** (115200)
- Botão físico ligado no **pino D2** (GND + pull-up interno)

Se a porta for outra, muda no arquivo `Backend/SerialPort/SerialPort.cs`.

## Código embarcado

O firmware está em `ButtonEmergency.ino`.

Abre no Arduino IDE, escolhe a placa, a COM3 e clica em **Upload**.

Pra trocar o nome e o endereço da pessoa, edita no próprio `.ino`:

```cpp
const char* NOME_PESSOA = "Lucas Souza";
const char* ENDERECO = "Avenida Buriti, Manaus/Amazonas";
```

Quando o botão físico é pressionado, o Arduino manda uma linha JSON pela serial.

## Como rodar

Abre dois terminais.

**1. Backend**

```bash
cd Backend
dotnet run
```

Sobe em `http://localhost:5268`.

**2. Frontend**

```bash
cd Frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

Se a 5173 estiver ocupada, o Vite usa 5174. Aí adiciona essa origem no CORS do `Backend/Program.cs`.

## Como usar

1. Grava o `ButtonEmergency.ino` no Arduino e deixa o botão físico no pino D2.
2. Liga o Arduino na COM3.
3. Sobe o backend e o frontend.
4. Aperta o **botão de emergência**.
5. Na tela aparece **Emergência Acionada**, o nome do paciente e o evento na linha do tempo.
6. O mapa vai para o endereço (o backend busca a latitude/longitude no Nominatim).
7. Clica em **Enviar Ambulância**. O botão muda para **Em trânsito**.

## Formato da mensagem

O Arduino manda assim:

```json
{"event":"EMERGENCIA","name":"Lucas Souza","address":"Avenida Buriti, Manaus/Amazonas"}
```

Se não vier latitude/longitude, o backend monta o GPS pelo endereço.

## Pastas

**Código embarcado**
- `ButtonEmergency.ino` — botão físico de emergência no Arduino (pino D2)

**Backend**
- `SerialPort` — conexão com o Arduino
- `SerialBackgroundService.cs` — lê a serial e manda pro front
- `AddressGeocoder` — transforma endereço em GPS
- `Hub` — websocket (SignalR)

**Frontend**
- `ButtonEmergency` — status, paciente e botão da ambulância
- `Logs` — linha do tempo
- `Maps` — mapa
- `hooks/useEmergencyHub.ts` — conexão com o websocket
