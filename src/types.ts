export type Hierarchy =
  | "Oficial General"
  | "Oficial Superior"
  | "Oficial Intermediário"
  | "Oficial Subalterno"
  | "Praça"
  | "Civil";

export type UnitStatus = "Livre" | "Reservado" | "Ocupado" | "Bloqueado" | "Vendida";

export interface Unit {
  id: string;
  column: string;
  floor: number;
  area: number;
  value: number;
  hasCCCPM: boolean;
  status: UnitStatus;
  interestedCount: number;
  priority: "Crítica" | "Alta" | "Média" | "Baixa" | "Nula";
  condo_fee?: number;
  layout_url?: string;
}

export type PipelineStage =
  | "Cadastro Realizado"
  | "Contato Inicial"
  | "Aguardando Documentação"
  | "Visita Realizada"
  | "Em Análise Financeira"
  | "Apto para Aquisição";

export interface InterestedParty {
  id: string;
  qtd?: number;
  posto_graduacao?: string;
  circulo_hierarquico?: string;
  situacao_do?: string;
  situacao?: string;
  vinculado_a?: string;
  opcao_1?: string;
  opcao_2?: string;
  forma_pagamento?: string;
  forma_inscricao?: string;
  email?: string;
  telefone?: string;
  situacao_lead?: string;
  nome_completo?: string;
  analise_documental?: string;
  capacidade_financeira_ate?: string;
  capacidade_financeira?: string;
  data_visita?: string;
  created_at?: string;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "visit" | "system";
  title: string;
  description: string;
  date: string;
  responsible: string;
}
