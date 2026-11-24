import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera, CloudUpload, Copy, KeyRound, Layers, Mail, ScanFace, Send, Sparkles, Trash2, UserPlus, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loma · Cadastro de E-mails e Facial" },
      { name: "description", content: "Painel Loma para cadastrar e-mails corporativos e reconhecimento facial de funcionários." },
      { property: "og:title", content: "Loma · Cadastro de E-mails e Facial" },
      { property: "og:description", content: "Crie e-mails por cargo e cadastre a facial nos terminais em uma só tela." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ROLES = ["Dev", "TI", "Comercial", "Marketing", "Financeiro", "RH", "Suporte"];
const EMAILS = [
  { email: "joao.santos@loma.com.br", label: "principal" },
  { email: "joao.santos@vendas.com.br", label: "Plataforma de Vendas" },
];
const ACCOUNTS = [
  { role: "Comercial", emails: ["joao.santos@loma.com.br", "joao.santos@vendas.com.br"] },
  { role: "Financeiro", emails: ["ana.souza@loma.com.br", "ana.souza@financeiro.com.br"] },
  { role: "Dev", emails: ["carlos.silva@loma.com.br", "carlos.silva@dev.com.br", "carlos.silva@ti.com.br"] },
];
const TERMINALS = ["Matriz catraca 1", "Matriz Catraca 2", "Matriz Portao", "Boa Ventura", "Osasco"];

function Index() {
  const [tab, setTab] = useState<"emails" | "facial">("emails");
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">L</div>
            <div>
              <p className="font-bold leading-none">Loma</p>
              <p className="text-xs text-ink-foreground/60">Proteção Veicular · Admin</p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-lg bg-ink-foreground/10 p-1">
            {([["emails", "E-mails", Mail], ["facial", "Facial", ScanFace]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn("flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  tab === id ? "bg-primary text-primary-foreground" : "text-ink-foreground/70 hover:text-ink-foreground")}>
                <Icon className="size-4" />{label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">
        {tab === "emails" ? <EmailsScreen /> : <FacialScreen />}
      </main>
    </div>
  );
}

function Title({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{kicker}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}

const input = "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function EmailsScreen() {
  const [role, setRole] = useState("Comercial");
  return (
    <>
      <Title kicker="provisionamento" title="Novo e-mail corporativo" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-semibold">Nome e último nome</label>
            <input className={cn(input, "mt-2 font-mono text-base")} placeholder="joao.santos" defaultValue="joao.santos" />
          </div>
          <div>
            <p className="text-sm font-semibold">Cargo</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {ROLES.map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    r === role ? "border-ink bg-ink text-ink-foreground" : "border-input hover:border-primary hover:text-primary")}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-ink p-4 text-ink-foreground">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-foreground/60">e-mails gerados · {EMAILS.length}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {EMAILS.map((e, i) => (
                <li key={e.email} className="flex items-center gap-2 rounded-md bg-ink-foreground/10 px-3 py-2 text-sm">
                  <Mail className="size-4 text-primary" />
                  <span className={cn("flex-1 font-mono", i === 0 && "font-semibold")}>{e.email}</span>
                  <span className="text-xs text-ink-foreground/60">{e.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-dashed border-primary/60 px-3 py-2 text-sm">
              <KeyRound className="size-4 text-primary" />
              <span className="text-ink-foreground/70">Senha inicial:</span>
              <span className="font-mono font-semibold">Mudar@2026</span>
              <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">troca no 1º acesso</span>
            </div>
          </div>
          <Button size="lg">Criar e-mail</Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Contas criadas</h2>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-sm font-semibold text-accent-foreground">{ACCOUNTS.length}</span>
          </div>
          <ul className="flex flex-col gap-3">
            {ACCOUNTS.map((a) => (
              <li key={a.emails[0]} className="rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-ink px-2 py-0.5 text-xs font-semibold text-ink-foreground">{a.role}</span>
                  <span className="flex-1 truncate font-mono text-sm font-semibold">{a.emails[0]}</span>
                  <Button variant="ghost" size="icon" aria-label="Copiar"><Copy /></Button>
                  <Button variant="ghost" size="icon" aria-label="Remover" className="hover:text-destructive"><Trash2 /></Button>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  {a.emails.slice(1).map((e) => (
                    <li key={e} className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 font-mono text-xs">
                      <Mail className="size-3 text-primary" />{e}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function CardHead({ icon: Icon, title, sub, dark }: { icon: typeof Layers; title: string; sub: string; dark?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="size-5" /></div>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className={cn("text-sm", dark ? "text-ink-foreground/60" : "text-muted-foreground")}>{sub}</p>
      </div>
    </div>
  );
}

function FacialScreen() {
  const [sel, setSel] = useState<string[]>([...TERMINALS]);
  const all = sel.length === TERMINALS.length;
  return (
    <>
      <Title kicker="controle de acesso" title="Cadastro de facial" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Coluna da foto */}
        <aside className="flex flex-col gap-4 rounded-2xl bg-ink p-6 text-ink-foreground">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Biometria</p>
            <span className="rounded-full bg-ink-foreground/10 px-2 py-0.5 text-[11px]">opcional</span>
          </div>
          <div className="relative mx-auto grid aspect-[3/4] w-full place-items-center rounded-2xl border-2 border-dashed border-primary/50 bg-ink-foreground/5">
            <span className="absolute left-3 top-3 size-5 rounded-tl-lg border-l-2 border-t-2 border-primary" />
            <span className="absolute right-3 top-3 size-5 rounded-tr-lg border-r-2 border-t-2 border-primary" />
            <span className="absolute bottom-3 left-3 size-5 rounded-bl-lg border-b-2 border-l-2 border-primary" />
            <span className="absolute bottom-3 right-3 size-5 rounded-br-lg border-b-2 border-r-2 border-primary" />
            <div className="flex flex-col items-center gap-2 text-ink-foreground/60">
              <ScanFace className="size-16 text-primary" strokeWidth={1.25} />
              <span className="text-sm">Sem foto</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary"><CloudUpload />Enviar</Button>
            <Button><Camera />Capturar</Button>
          </div>
          <p className="text-xs text-ink-foreground/60">JPEG até 500 KB, rosto centralizado e boa iluminação.</p>
        </aside>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <CardHead icon={UserPlus} title="Identificação do usuário" sub="Dados de cadastro e ID interno da facial" />
            <div className="mt-6 grid gap-5 sm:grid-cols-[140px_1fr]">
              <div>
                <label className="text-sm font-semibold">ID na facial</label>
                <div className="mt-2 rounded-lg bg-accent px-4 py-2 text-center font-mono text-2xl font-bold text-accent-foreground">6027</div>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-accent-foreground"><Sparkles className="size-3" />próximo livre</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold">Nome completo</label>
                  <input className={cn(input, "mt-2")} placeholder="Ex: Carlos Eduardo Silva" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Matrícula / Registro</label>
                  <input className={cn(input, "mt-2")} placeholder="Ex: 2024001 ou CPF" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <CardHead icon={Layers} title="Terminais de destino" sub="Onde a facial será sincronizada" />
              <button onClick={() => setSel(all ? [] : [...TERMINALS])} className="shrink-0 text-sm font-semibold text-accent-foreground hover:underline">
                {all ? "Desmarcar todos" : "Marcar todos"}
              </button>
            </div>
            <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {TERMINALS.map((name) => {
                const on = sel.includes(name);
                return (
                  <li key={name}>
                    <button onClick={() => setSel((p) => (on ? p.filter((x) => x !== name) : [...p, name]))}
                      className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition-colors", on ? "bg-accent/50" : "hover:bg-muted")}>
                      <span className={cn("size-2.5 shrink-0 rounded-full", on ? "bg-primary" : "bg-border")} />
                      <span className="flex-1 text-sm font-semibold">{name}</span>
                      <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-input")}>
                        <span className={cn("absolute top-0.5 size-4 rounded-full bg-card transition-all", on ? "left-[18px]" : "left-0.5")} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-ink-foreground">
            <p className="text-sm"><span className="font-bold text-primary">{sel.length}</span> de {TERMINALS.length} terminais</p>
            <Button size="lg"><Send />Cadastrar e enviar</Button>
          </div>
        </div>
      </div>
    </>
  );
}
