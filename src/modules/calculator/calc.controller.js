
import {
  calculateOhm,
  calculatePower,
  convertUnit
} from "./calc.service.js";

export function ohmController(req, res, next) {
  try {
    const result = calculateOhm(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export function powerController(req, res, next) {
  try {
    const result = calculatePower(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export function conversionController(req, res, next) {
  try {
    const result = convertUnit(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}
