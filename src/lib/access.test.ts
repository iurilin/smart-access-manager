import { describe, expect, it } from "vitest";
import {
  SYSTEMS,
  accessForRole,
  credentialsForRole,
  emailsForRole,
  isValidUsername,
  normalizeUsername,
} from "./access";

const ALL = SYSTEMS.map((s) => s.id);

describe("acessos por cargo", () => {
  it("Dev tem todos os acessos", () => {
    expect(accessForRole("dev").sort()).toEqual([...ALL].sort());
  });

  it("TI tem todos os acessos", () => {
    expect(accessForRole("ti").sort()).toEqual([...ALL].sort());
  });

  it("Comercial tem somente a plataforma de vendas (além do e-mail)", () => {
    expect(accessForRole("comercial").sort()).toEqual(["email", "vendas"]);
  });
});

describe("e-mails por cargo", () => {
  it("Comercial recebe o e-mail principal e o de vendas", () => {
    expect(emailsForRole("joao.santos", "loma.com.br", "comercial").map((e) => e.email)).toEqual([
      "joao.santos@loma.com.br",
      "joao.santos@vendas.com.br",
    ]);
  });

  it("o primeiro e-mail é sempre o principal, igual para todo cargo", () => {
    for (const role of ["dev", "ti", "comercial", "financeiro"] as const) {
      expect(emailsForRole("joao.santos", "loma.com.br", role)[0]?.email).toBe(
        "joao.santos@loma.com.br",
      );
    }
  });

  it("Financeiro mantém o ponto entre nome e sobrenome", () => {
    expect(emailsForRole("joao.santos", "loma.com.br", "financeiro")[1]?.email).toBe(
      "joao.santos@financeiro.com.br",
    );
  });

  it("Dev recebe um e-mail para cada acesso", () => {
    expect(emailsForRole("joao.santos", "loma.com.br", "dev")).toHaveLength(SYSTEMS.length);
  });
});

describe("senhas", () => {
  it("todos os e-mails recebem a senha inicial Mudar@2026", () => {
    for (const role of ["dev", "comercial"] as const) {
      for (const c of credentialsForRole("joao.santos", "loma.com.br", role)) {
        expect(c.password).toBe("Mudar@2026");
      }
    }
  });

  it("todos os e-mails exigem troca de senha no primeiro acesso", () => {
    const creds = credentialsForRole("joao.santos", "loma.com.br", "dev");
    expect(creds.every((c) => c.mustChangePassword === true)).toBe(true);
  });
});

describe("nome de usuário", () => {
  it("converte nome e sobrenome para o formato nome.sobrenome", () => {
    expect(normalizeUsername("Iúri Lima")).toBe("iuri.lima");
    expect(normalizeUsername("iuri.lima")).toBe("iuri.lima");
  });

  it("exige nome e último nome", () => {
    expect(isValidUsername("iuri.lima")).toBe(true);
    expect(isValidUsername("iuri")).toBe(false);
  });
});
