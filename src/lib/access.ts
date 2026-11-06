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

export const DEFAULT_DOMAIN = "loma.com.br";

/**
 * domain: domínio do e-mail daquele acesso (null = usa o domínio principal da empresa).
 * format: "ponto" -> joao.santos  |  "junto" -> joaosantos
 */
export const SYSTEMS: {
  id: SystemId;
  label: string;
  domain: string | null;
  format: "ponto" | "junto";
}[] = [
  { id: "email", label: "E-mail corporativo", domain: null, format: "ponto" },
  { id: "vendas", label: "Plataforma de Vendas", domain: "vendas.com.br", format: "ponto" },
  { id: "marketing", label: "Marketing", domain: "marketing.com.br", format: "ponto" },
  { id: "financeiro", label: "ERP Financeiro", domain: "financeiro.com.br", format: "junto" },
  { id: "rh", label: "Portal RH", domain: "rh.com.br", format: "ponto" },
  { id: "helpdesk", label: "Helpdesk", domain: "suporte.com.br", format: "ponto" },
  { id: "codigo", label: "Repositório de Código", domain: "dev.com.br", format: "ponto" },
  { id: "cloud", label: "Servidores & Cloud", domain: "ti.com.br", format: "ponto" },
  { id: "admin", label: "Painel Admin", domain: "admin.com.br", format: "ponto" },
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

/** Todos os e-mails do funcionário: o principal primeiro, depois um por acesso do cargo. */
export function emailsForRole(
  username: string,
  mainDomain: string,
  role: RoleId,
): { systemId: SystemId; email: string }[] {
  const access = accessForRole(role);
  return SYSTEMS.filter((s) => access.includes(s.id)).map((s) => {
    const user = s.format === "junto" ? username.replace(/\./g, "") : username;
    return { systemId: s.id, email: buildEmail(user, s.domain ?? mainDomain) };
  });
}
