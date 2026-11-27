PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL COLLATE NOCASE UNIQUE,
  descripcion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS terminos (
  id INTEGER PRIMARY KEY,
  categoria_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen TEXT,
  importancia TEXT CHECK (
    importancia IS NULL OR importancia IN ('informativa', 'precaucion', 'advertencia')
  ),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  UNIQUE (categoria_id, nombre COLLATE NOCASE)
);

CREATE TABLE IF NOT EXISTS juegos (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  dificultad TEXT NOT NULL CHECK (dificultad IN ('facil', 'media', 'dificil'))
);

CREATE TABLE IF NOT EXISTS preguntas (
  id INTEGER PRIMARY KEY,
  juego_id INTEGER NOT NULL,
  pregunta TEXT NOT NULL,
  explicacion TEXT NOT NULL,
  FOREIGN KEY (juego_id) REFERENCES juegos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS opciones (
  id INTEGER PRIMARY KEY,
  pregunta_id INTEGER NOT NULL,
  texto TEXT NOT NULL,
  es_correcta INTEGER NOT NULL CHECK (es_correcta IN (0, 1)),
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  UNIQUE (id, pregunta_id)
);

CREATE TABLE IF NOT EXISTS partidas (
  id INTEGER PRIMARY KEY,
  juego_id INTEGER NOT NULL,
  puntaje INTEGER NOT NULL DEFAULT 0 CHECK (puntaje >= 0),
  fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (juego_id) REFERENCES juegos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS respuestas (
  id INTEGER PRIMARY KEY,
  partida_id INTEGER NOT NULL,
  pregunta_id INTEGER NOT NULL,
  opcion_id INTEGER NOT NULL,
  es_correcta INTEGER NOT NULL CHECK (es_correcta IN (0, 1)),
  FOREIGN KEY (partida_id) REFERENCES partidas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (opcion_id, pregunta_id) REFERENCES opciones(id, pregunta_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  UNIQUE (partida_id, pregunta_id)
);

CREATE INDEX IF NOT EXISTS idx_terminos_categoria_id ON terminos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_juego_id ON preguntas(juego_id);
CREATE INDEX IF NOT EXISTS idx_opciones_pregunta_id ON opciones(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_partidas_juego_id ON partidas(juego_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_partida_id ON respuestas(partida_id);