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
const TERMINALS = [
  { name: "Catraca 2 - Entrada", url: "http://192.168.20.102" },
  { name: "Catraca 1 - Entrada", url: "http://192.168.20.103" },
  { name: "Portão", url: "http://192.168.20.129" },
  { name: "Boa Ventura", url: "http://lomaboaventuraomada.ddns.net" },
  { name: "Facial Osasco", url: "http://lomaosascoomada.ddns.net:8080" },
];

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
        <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-pop">
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
  const [sel, setSel] = useState<string[]>(TERMINALS.map((t) => t.name));
  const all = sel.length === TERMINALS.length;
  return (
    <>
      <Title kicker="controle de acesso" title="Cadastro de facial" />
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-pop">
          <CardHead icon={UserPlus} title="Identificação do Usuário" sub="Dados de cadastro e identificador numérico interno da facial" />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="text-sm font-semibold">Código na Facial (ID)</label>
              <input className={cn(input, "mt-2 font-mono")} defaultValue="6027" />
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary"><Sparkles className="size-3" />Sugestão automática (próximo disponível)</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Matrícula / Registro</label>
              <input className={cn(input, "mt-2")} placeholder="Ex: 2024001 ou CPF" />
              <p className="mt-1.5 text-xs text-muted-foreground">Número de matrícula no RH ou código</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Nome Completo</label>
              <input className={cn(input, "mt-2")} placeholder="Ex: Carlos Eduardo Silva" />
              <p className="mt-1.5 text-xs text-muted-foreground">Nome exibido na tela da facial</p>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-semibold">Foto para Reconhecimento Facial <span className="font-normal text-muted-foreground">(opcional)</span></p>
            <div className="mt-3 flex gap-4">
              <button className="flex flex-1 items-center justify-center gap-4 rounded-xl border-2 border-dashed border-input py-8 transition-colors hover:border-primary hover:bg-accent/40">
                <div className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary"><CloudUpload className="size-6" /></div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Clique para selecionar foto</p>
                  <p className="text-xs text-muted-foreground">Recomendado: JPEG até 500 KB, rosto centralizado e boa iluminação</p>
                </div>
              </button>
              <div className="grid w-24 place-items-center rounded-xl bg-ink text-ink-foreground/60">
                <div className="flex flex-col items-center gap-1 text-xs"><Camera className="size-5" />Sem foto</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-ink p-6 text-ink-foreground">
          <div className="flex items-start justify-between gap-4">
            <CardHead icon={Layers} title="Terminais de Destino" sub="Selecione para quais faciais as credenciais e acessos serão sincronizados" dark />
            <button onClick={() => setSel(all ? [] : TERMINALS.map((t) => t.name))} className="shrink-0 text-sm font-semibold hover:text-primary">
              {all ? "Desmarcar todos" : "Marcar todos"}
            </button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TERMINALS.map((t) => {
              const on = sel.includes(t.name);
              return (
                <button key={t.name} onClick={() => setSel((p) => (on ? p.filter((x) => x !== t.name) : [...p, t.name]))}
                  className={cn("flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    on ? "border-primary bg-primary/15" : "border-ink-foreground/15 hover:border-ink-foreground/40")}>
                  <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded", on ? "bg-primary text-primary-foreground" : "border border-ink-foreground/40")}>
                    {on && <Check className="size-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block truncate font-mono text-xs text-ink-foreground/60">{t.url}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{sel.length} terminais selecionados</p>
          <Button size="lg"><Send />Cadastrar e Enviar</Button>
        </div>
      </div>
    </>
  );
}
