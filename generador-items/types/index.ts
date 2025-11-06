export interface GeneratorForm {
  normaCodigo: string;
  versionNorma: string;
  normaNombre: string;
  conocimientoEsencial: string;
  actividadClave: string;
  criterioDesempeno: string;
  categoria: string;
  contexto: string;
  reactivo: string;
  generar: string;
  formato: string;
  limite: string;
}

export interface Item {
  id: string;
  title: string;
  contexto?: string;
  reactivo?: string;
  opciones?: string;
  respuestaCorrecta?: string;
  sustentacion?: string;
  ajusteMetodologico?: string;
  createdDate: string;
  isCollapsed: boolean;
  isEditing: boolean;
  isSaved: boolean;
  formato: string;
  codigoItem: string;
}

export interface ChatResponse {
  response: string;
}
