/**
 * Cliques que importam no portfólio (currículo, e-mail, WhatsApp...), contados
 * pelo Umami Cloud. O Vercel Analytics grátis só conta visitas; evento custom
 * e UTM ficam no Umami, que também não usa cookies.
 *
 * Os nomes são fixos e em português, independentes do idioma da página, para
 * os números de /work e /en/work somarem no mesmo evento.
 */
type Umami = { track: (event: string, data?: Record<string, string>) => void };

export type TrackedClick =
  | "curriculo"
  | "lattes"
  | "email-copiado"
  | "whatsapp"
  | "linkedin"
  | "behance";

export function trackClick(event: TrackedClick, local: "rodape" | "menu" | "menu-mobile") {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, { local });
  } catch {
    /* bloqueador de anúncio ou script ainda carregando: segue sem contar */
  }
}
