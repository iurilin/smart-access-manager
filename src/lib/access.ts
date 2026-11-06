export type SystemId =
  | "email"
  | "vendas"
  | "financeiro"
  | "rh"
  | "marketing"
  | "helpdesk"
  | "codigo"
  | "cloud"
  | "admin";

export type RoleId = "dev" | "ti" | "comercial" | "marketing" | "financeiro" | "rh" | "suporte";

export const SYSTEMS: { id: SystemId; label: string }[] = [
  { id: "email", label: "E-mail corporativo" },
  { id: "vendas", label: "Plataforma de Vendas" },
  { id: "marketing", label: "Marketing" },
  { id: "financeiro", label: "ERP Financeiro" },
  { id: "rh", label: "Portal RH" },
  { id: "helpdesk", label: "Helpdesk" },
  { id: "codigo", label: "Repositório de Código" },
  { id: "cloud", label: "Servidores & Cloud" },
  { id: "admin", label: "Painel Admin" },
];

const ALL: SystemId[] = SYSTEMS.map((s) => s.id);

export const ROLES: { id: RoleId; label: string; access: SystemId[] }[] = [
  { id: "dev", label: "Dev", access: ALL },
  { id: "ti", label: "TI", access: ALL },
  { id: "comercial", label: "Comercial", access: ["email", "vendas"] },
  { id: "marketing", label: "Marketing", access: ["email", "marketing"] },
  { id: "financeiro", label: "Financeiro", access: ["email", "financeiro"] },
  { id: "rh", label: "RH", access: ["email", "rh"] },
  { id: "suporte", label: "Suporte", access: ["email", "helpdesk"] },
];

export function accessForRole(role: RoleId): SystemId[] {
  return ROLES.find((r) => r.id === role)?.access ?? [];
}

/** "Iúri Lima" / "iuri.lima" / "IURI_LIMA" -> "iuri.lima" */
export function normalizeUsername(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s_\-]+/g, ".")
    .replace(/[^a-z.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.|\.$/g, "");
}

export function isValidUsername(username: string): boolean {
  return /^[a-z]{2,}\.[a-z]{2,}$/.test(username);
}

export function buildEmail(username: string, domain: string): string {
  return `${username}@${domain.trim().toLowerCase()}`;
}
