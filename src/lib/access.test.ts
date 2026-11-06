import { describe, expect, it } from "vitest";
import {
  SYSTEMS,
  accessForRole,
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
      expect(emailsForRole("joao.santos", "loma.com.br", role)[0].email).toBe(
        "joao.santos@loma.com.br",
      );
    }
  });

  it("Financeiro usa o nome junto, sem ponto", () => {
    expect(emailsForRole("joao.santos", "loma.com.br", "financeiro")[1].email).toBe(
      "joaosantos@financeiro.com.br",
    );
  });

  it("Dev recebe um e-mail para cada acesso", () => {
    expect(emailsForRole("joao.santos", "loma.com.br", "dev")).toHaveLength(SYSTEMS.length);
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
