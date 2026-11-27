import {
  createTerm,
  deleteTerm,
  findTermById,
  listCategories,
  listTerms,
  updateTerm
} from "./glossary.service.js";

const validImportance = new Set(["informativa", "precaucion", "advertencia"]);

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseId(value, fieldName) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw createError(400, `${fieldName} debe ser un identificador entero positivo.`);
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw createError(400, `${fieldName} está fuera del rango permitido.`);
  }

  return id;
}

function validateTerm(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw createError(400, "El body debe ser un objeto JSON.");
  }

  if (!Number.isSafeInteger(body.categoria_id) || body.categoria_id < 1) {
    throw createError(400, "categoria_id debe ser un entero positivo.");
  }

  if (typeof body.nombre !== "string" || body.nombre.trim() === "") {
    throw createError(400, "nombre es obligatorio y debe ser texto.");
  }

  if (typeof body.descripcion !== "string" || body.descripcion.trim() === "") {
    throw createError(400, "descripcion es obligatoria y debe ser texto.");
  }

  const imagen = body.imagen ?? null;
  if (imagen !== null && typeof imagen !== "string") {
    throw createError(400, "imagen debe ser texto o null.");
  }

  const importancia = body.importancia ?? null;
  if (importancia !== null && !validImportance.has(importancia)) {
    throw createError(
      400,
      "importancia debe ser informativa, precaucion, advertencia o null."
    );
  }

  return {
    categoria_id: body.categoria_id,
    nombre: body.nombre.trim(),
    descripcion: body.descripcion.trim(),
    imagen: imagen?.trim() || null,
    importancia
  };
}

function respond(res, statusCode, message, operation) {
  try {
    const data = operation();
    const response = { success: true, mensaje: message };

    if (data !== undefined) {
      response.data = data;
    }

    res.status(statusCode).json(response);
  } catch (error) {
    const errorStatus = error.statusCode || 500;
    res.status(errorStatus).json({
      success: false,
      mensaje: errorStatus === 500 ? "Error interno del servidor." : error.message
    });
  }
}

export function getCategoriesController(req, res) {
  respond(res, 200, "Categorías encontradas.", listCategories);
}

export function getTermsController(req, res) {
  respond(res, 200, "Términos encontrados.", () => {
    let categoryId;
    let search;

    if (req.query.categoria !== undefined) {
      categoryId = parseId(req.query.categoria, "categoria");
    }

    if (req.query.buscar !== undefined) {
      if (typeof req.query.buscar !== "string" || req.query.buscar.trim() === "") {
        throw createError(400, "buscar debe contener texto.");
      }
      search = req.query.buscar.trim();
    }

    return listTerms({ categoryId, search });
  });
}

export function getTermController(req, res) {
  respond(res, 200, "Término encontrado.", () => {
    const term = findTermById(parseId(req.params.id, "id"));
    if (!term) {
      throw createError(404, "El término solicitado no existe.");
    }
    return term;
  });
}

export function createTermController(req, res) {
  respond(res, 201, "Término creado.", () => createTerm(validateTerm(req.body)));
}

export function updateTermController(req, res) {
  respond(res, 200, "Término actualizado.", () => {
    const id = parseId(req.params.id, "id");
    return updateTerm(id, validateTerm(req.body));
  });
}

export function deleteTermController(req, res) {
  respond(res, 200, "Término eliminado.", () => {
    const id = parseId(req.params.id, "id");
    deleteTerm(id);
    return { id };
  });
}