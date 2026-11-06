import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AtSign,
  Check,
  Copy,
  GitBranch,
  Headset,
  Mail,
  Megaphone,
  Server,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ROLES,
  SYSTEMS,
  accessForRole,
  buildEmail,
  isValidUsername,
  normalizeUsername,
  type RoleId,
  type SystemId,
} from "@/lib/access";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Provisionador de E-mails Corporativos" },
      {
        name: "description",
        content: "Crie e-mails corporativos em segundos com os acessos certos para cada cargo.",
      },
      { property: "og:title", content: "Provisionador de E-mails Corporativos" },
      {
        property: "og:description",
        content: "Informe nome.sobrenome e o cargo: o e-mail e os acessos são gerados na hora.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ICONS: Record<SystemId, LucideIcon> = {
  email: Mail,
  vendas: ShoppingCart,
  marketing: Megaphone,
  financeiro: Wallet,
  rh: Users,
  helpdesk: Headset,
  codigo: GitBranch,
  cloud: Server,
  admin: ShieldCheck,
};

type Account = {
  id: string;
  username: string;
  email: string;
  role: RoleId;
  createdAt: number;
};

const STORAGE_ACCOUNTS = "provisionador.accounts";
const STORAGE_DOMAIN = "provisionador.domain";

function Index() {
  const [domain, setDomain] = useState("empresa.com.br");
  const [rawName, setRawName] = useState("");
  const [role, setRole] = useState<RoleId>("dev");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_ACCOUNTS);
      const d = localStorage.getItem(STORAGE_DOMAIN);
      if (a) setAccounts(JSON.parse(a));
      if (d) setDomain(d);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_DOMAIN, domain);
  }, [accounts, domain, loaded]);

  const username = normalizeUsername(rawName);
  const valid = isValidUsername(username);
  const email = buildEmail(username || "nome.sobrenome", domain || "empresa.com.br");
  const access = accessForRole(role);
  const duplicate = valid && accounts.some((a) => a.email === email);
  const canCreate = valid && !duplicate && domain.trim().length > 3;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    const account: Account = {
      id: crypto.randomUUID(),
      username,
      email,
      role,
      createdAt: Date.now(),
    };
    setAccounts((prev) => [account, ...prev]);
    setRawName("");
    toast.success(`${email} criado`, {
      description: `${access.length} acesso${access.length > 1 ? "s" : ""} liberado${access.length > 1 ? "s" : ""}`,
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // provisionamento de contas
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Novo e-mail corporativo
          </h1>
        </div>
        <label className="flex items-center gap-2 rounded-md border-2 border-ink bg-card px-3 py-2 font-mono text-sm">
          <AtSign className="size-4 text-muted-foreground" />
          <span className="sr-only">Domínio da empresa</span>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value.replace(/\s/g, "").toLowerCase())}
            className="w-44 bg-transparent outline-none"
            aria-label="Domínio da empresa"
          />
        </label>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-xl border-2 border-ink bg-card p-6 shadow-pop"
        >
          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              Nome e último nome
            </label>
            <input
              id="name"
              autoFocus
              autoComplete="off"
              value={rawName}
              onChange={(e) => setRawName(e.target.value)}
              placeholder="iuri.lima"
              className="mt-2 w-full rounded-md border-2 border-input bg-background px-4 py-3 font-mono text-lg outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
            <p
              className={cn(
                "mt-2 h-4 font-mono text-xs",
                duplicate ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {rawName === ""
                ? "formato: nome.sobrenome"
                : duplicate
                  ? "esse e-mail já existe"
                  : valid
                    ? `usuário: ${username}`
                    : "digite nome e último nome, ex: iuri.lima"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Cargo</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup">
              {ROLES.map((r) => {
                const active = r.id === role;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "rounded-md border-2 px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-ink bg-ink text-ink-foreground"
                        : "border-input bg-background hover:border-ink",
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prévia */}
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              prévia
            </p>
            <p
              className={cn(
                "mt-1 break-all font-mono text-lg font-bold",
                valid ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {email}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SYSTEMS.map((s) => {
                const Icon = ICONS[s.id];
                const on = access.includes(s.id);
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all",
                      on ? "bg-card text-foreground" : "text-muted-foreground/50 line-through",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", on && "text-primary")} />
                    <span className="flex-1">{s.label}</span>
                    {on && <Check className="size-4 text-success" />}
                  </li>
                );
              })}
            </ul>
          </div>

          <Button type="submit" variant="console" size="lg" disabled={!canCreate}>
            Criar e-mail
          </Button>
        </form>

        {/* Lista */}
        <section className="flex flex-col rounded-xl border-2 border-border bg-card/70 p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Contas criadas</h2>
            <span className="font-mono text-sm text-muted-foreground">{accounts.length}</span>
          </div>

          {accounts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-16 text-center">
              <Mail className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhuma conta ainda.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {accounts.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  onDelete={() => setAccounts((prev) => prev.filter((x) => x.id !== a.id))}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function AccountRow({ account, onDelete }: { account: Account; onDelete: () => void }) {
  const roleLabel = ROLES.find((r) => r.id === account.role)?.label ?? account.role;
  const access = useMemo(() => accessForRole(account.role), [account.role]);

  return (
    <li className="group animate-row-in rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2">
        <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
          {roleLabel}
        </span>
        <span className="flex-1 truncate font-mono text-sm font-medium">{account.email}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Copiar e-mail"
          onClick={() => {
            navigator.clipboard.writeText(account.email);
            toast("E-mail copiado");
          }}
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remover conta"
          className="hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {access.map((id) => {
          const Icon = ICONS[id];
          const label = SYSTEMS.find((s) => s.id === id)?.label;
          return (
            <span
              key={id}
              title={label}
              className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              <Icon className="size-3" />
              {label}
            </span>
          );
        })}
      </div>
    </li>
  );
}
