
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
  mV: { quantity: "voltage", factor: 0.001 },
  V: { quantity: "voltage", factor: 1 },
  kV: { quantity: "voltage", factor: 1000 },
  mA: { quantity: "current", factor: 0.001 },
  A: { quantity: "current", factor: 1 },
  kA: { quantity: "current", factor: 1000 },
  mOhm: { quantity: "resistance", factor: 0.001 },
  Ohm: { quantity: "resistance", factor: 1 },
  kOhm: { quantity: "resistance", factor: 1000 },
  MOhm: { quantity: "resistance", factor: 1000000 },
  mW: { quantity: "power", factor: 0.001 },
  W: { quantity: "power", factor: 1 },
  kW: { quantity: "power", factor: 1000 },
  MW: { quantity: "power", factor: 1000000 }
};

export function convertUnit({ unit, value }) {
  const sourceUnit = units[unit];

  if (!sourceUnit) {
    throw new Error("La unidad indicada no está soportada.");
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("El valor debe ser un número válido.");
  }

  const baseValue = value * sourceUnit.factor;
  const conversions = Object.entries(units)
    .filter(([, targetUnit]) => targetUnit.quantity === sourceUnit.quantity)
    .map(([targetUnit, definition]) => ({
      unit: targetUnit,
      value: baseValue / definition.factor
    }));

  return {
    quantity: sourceUnit.quantity,
    input: { value, unit },
    conversions
  };
}
