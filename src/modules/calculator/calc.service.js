
// LEY DE OHM

export function calculateOhm({ voltage, current, resistance }) {
  const values = { voltage, current, resistance };

  const provided = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null);

  if (provided.length !== 2) {
    throw new Error("Debes proporcionar exactamente dos valores.");
  }

  for (const [key, value] of provided) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`${key} debe ser un número válido.`);
    }

    if (key === "resistance" ? value <= 0 : value < 0) {
      throw new Error(`${key} tiene un valor inválido.`);
    }
  }

  if (voltage === undefined) {
    voltage = current * resistance;
  } else if (current === undefined) {
    current = voltage / resistance;
  } else {
    resistance = voltage / current;
  }

  return {
    voltage,
    current,
    resistance
  };
}

// POTENCIA ELÉCTRICA

export function calculatePower({ voltage, current }) {
  if (
    typeof voltage !== "number" ||
    typeof current !== "number" ||
    !Number.isFinite(voltage) ||
    !Number.isFinite(current) ||
    voltage < 0 ||
    current < 0
  ) {
    throw new Error("Voltaje y corriente deben ser números válidos.");
  }

  return {
    voltage,
    current,
    power: voltage * current
  };
}

// CONVERSIONES

const units = {
  voltage: {
    mV: 0.001,
    V: 1,
    kV: 1000
  },
  current: {
    mA: 0.001,
    A: 1,
    kA: 1000
  },
  resistance: {
    mOhm: 0.001,
    Ohm: 1,
    kOhm: 1000,
    MOhm: 1000000
  },
  power: {
    mW: 0.001,
    W: 1,
    kW: 1000,
    MW: 1000000
  }
};

export function convertUnit({ category, value, from, to }) {
  const categoryUnits = units[category];

  if (!categoryUnits || !categoryUnits[from] || !categoryUnits[to]) {
    throw new Error("Unidades o categoría no soportadas.");
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("El valor debe ser un número válido.");
  }

  const baseValue = value * categoryUnits[from];
  const result = baseValue / categoryUnits[to];

  return {
    category,
    original: { value, unit: from },
    converted: { value: result, unit: to }
  };
}
