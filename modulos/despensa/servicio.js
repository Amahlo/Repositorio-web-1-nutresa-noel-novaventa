const DESPENSA_SERVICIO_CONFIG = {
  modo: "api",
  mockSourceGlobal: "despensaMockData",
  rutasApi:{
    equivalencias: "https://6adb70213b7e90b8208fefa0.mockapi.io/equivalencias"
  }
}

const despensaServicio = {
  async buscarEquivalencia(termino) {
    if (!termino) return null;

    const terminoNormalizado = termino.trim().toLowerCase();

    try {
      const response = await fetch(DESPENSA_SERVICIO_CONFIG.rutasApi.equivalencias);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const equivalencias = await response.json();

      const match = equivalencias.find(eq => eq.terminoColoquial.toLowerCase().includes(terminoNormalizado));
      return match || null;

    } catch (error) {
      console.error("[Despensa Servicio] Error consultando equialencias", error);
      return null;
    }
  }
};

window.despensaServicio = despensaServicio;