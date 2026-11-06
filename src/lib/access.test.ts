import { describe, expect, it } from "vitest";
import { SYSTEMS, accessForRole, isValidUsername, normalizeUsername } from "./access";

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
