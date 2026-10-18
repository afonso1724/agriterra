export function buildSmsRecommendation({ region, tempC, humidity, precipMm }) {
  const parts = [`Agriterra (${region}):`];

  if (precipMm > 8) {
    parts.push(
      `Chuva forte prevista (${precipMm.toFixed(1)} mm). Cubra sementeiras jovens e verifique valas de drenagem.`
    );
  } else if (humidity < 40 && tempC > 30) {
    parts.push(
      `Humidade baixa (${humidity}%) e calor extremo (${tempC.toFixed(1)}°C) nos próximos dias. Regue a plantação no período da manhã e evite a rega ao meio-dia.`
    );
  } else if (tempC < 12) {
    parts.push(
      `Temperatura baixa (${tempC.toFixed(1)}°C) prevista à noite. Proteja plantas jovens de possível geada.`
    );
  } else if (humidity > 85) {
    parts.push(
      `Humidade muito alta (${humidity}%). Fique atento a fungos — considere tratamento preventivo.`
    );
  } else {
    parts.push(
      `Condições estáveis (${tempC.toFixed(1)}°C, ${humidity}% humidade). Semana favorável para lavra e sementeira.`
    );
  }

  parts.push("Duvidas? Responda a este SMS.");
  return parts.join(" ");
}
