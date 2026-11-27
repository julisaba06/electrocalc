import database from "../../config/database.js";

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getTerm(id) {
  return database.prepare(`
    SELECT
      terminos.id,
      terminos.categoria_id,
      categorias.nombre AS categoria,
      terminos.nombre,
      terminos.descripcion,
      terminos.imagen,
      terminos.importancia
    FROM terminos
    JOIN categorias ON categorias.id = terminos.categoria_id
    WHERE terminos.id = ?
  `).get(id);
}

function ensureCategoryExists(categoryId) {
  const category = database
    .prepare("SELECT id FROM categorias WHERE id = ?")
    .get(categoryId);

  if (!category) {
    throw createError(404, "La categoría indicada no existe.");
  }
}

function handleDuplicateTerm(error) {
  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    throw createError(409, "Ya existe un término con ese nombre en la categoría.");
  }

  throw error;
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

export function listCategories() {
  return database.prepare(`
    SELECT id, nombre, descripcion
    FROM categorias
    ORDER BY nombre COLLATE NOCASE
  `).all();
}

export function listTerms({ categoryId, search }) {
  if (categoryId !== undefined) {
    ensureCategoryExists(categoryId);
  }

  const conditions = [];
  const parameters = [];

  if (categoryId !== undefined) {
    conditions.push("terminos.categoria_id = ?");
    parameters.push(categoryId);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const terms = database.prepare(`
    SELECT
      terminos.id,
      terminos.categoria_id,
      categorias.nombre AS categoria,
      terminos.nombre,
      terminos.descripcion,
      terminos.imagen,
      terminos.importancia
    FROM terminos
    JOIN categorias ON categorias.id = terminos.categoria_id
    ${whereClause}
    ORDER BY terminos.nombre COLLATE NOCASE
  `).all(...parameters);

  if (search === undefined) {
    return terms;
  }

  const normalizedSearch = normalizeText(search);
  return terms.filter(term => normalizeText(term.nombre).includes(normalizedSearch));
}

export function findTermById(id) {
  return getTerm(id);
}

export function createTerm(term) {
  ensureCategoryExists(term.categoria_id);

  try {
    const result = database.prepare(`
      INSERT INTO terminos (categoria_id, nombre, descripcion, imagen, importancia)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      term.categoria_id,
      term.nombre,
      term.descripcion,
      term.imagen,
      term.importancia
    );

    return getTerm(result.lastInsertRowid);
  } catch (error) {
    handleDuplicateTerm(error);
  }
}

export function updateTerm(id, term) {
  if (!getTerm(id)) {
    throw createError(404, "El término solicitado no existe.");
  }

  ensureCategoryExists(term.categoria_id);

  try {
    database.prepare(`
      UPDATE terminos
      SET categoria_id = ?, nombre = ?, descripcion = ?, imagen = ?, importancia = ?
      WHERE id = ?
    `).run(
      term.categoria_id,
      term.nombre,
      term.descripcion,
      term.imagen,
      term.importancia,
      id
    );

    return getTerm(id);
  } catch (error) {
    handleDuplicateTerm(error);
  }
}

export function deleteTerm(id) {
  if (!getTerm(id)) {
    throw createError(404, "El término solicitado no existe.");
  }

  database.prepare("DELETE FROM terminos WHERE id = ?").run(id);
}