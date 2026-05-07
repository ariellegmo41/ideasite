import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand" />
            <span className="font-display text-xl font-bold">IDEA<span className="text-brand">.</span></span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Estratégia que movimenta negócios. Marketing, vendas e desenvolvimento comercial.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Empresa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-foreground">Sobre</Link></li>
            <li><Link to="/servicos" className="hover:text-foreground">Serviços</Link></li>
            <li><Link to="/idea-hub" className="hover:text-foreground">IDEA Hub</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Recursos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/diagnostico" className="hover:text-foreground">Diagnóstico</Link></li>
            <li><Link to="/materiais" className="hover:text-foreground">Materiais</Link></li>
            <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contato</h4>
          <p className="text-sm text-muted-foreground">contato@idea.com.br</p>
          <p className="text-sm text-muted-foreground">WhatsApp em breve</p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IDEA. Todos os direitos reservados.
      </div>
    </footer>
  );
}
