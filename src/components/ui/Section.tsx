import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props { id?: string; eyebrow: string; title: string; lead?: string; action?: { to: string; label: string }; children: ReactNode; className?: string }

export function Section({ id, eyebrow, title, lead, action, children, className = "" }: Props) {
  return (
    <section id={id} className={`border-t hairline py-20 md:py-28 ${className}`}>
      <div className="container-page">
        <motion.header
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="mb-12 grid gap-6 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-8">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="display text-4xl md:text-6xl">{title}</h2>
            {lead && <p className="mt-5 max-w-xl text-mute">{lead}</p>}
          </div>
          {action && (
            <div className="md:col-span-4 md:text-right">
              <Link to={action.to} className="group inline-flex items-center gap-2 text-sm text-ivory-dim hover:text-gold">
                <span className="link-underline">{action.label}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </motion.header>
        {children}
      </div>
    </section>
  );
}

export const Tag = ({ children, tone = "mute" }: { children: ReactNode; tone?: "mute" | "gold" | "warn" }) => (
  <span className={`inline-flex w-fit self-start items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
    tone === "gold" ? "border-gold/50 text-gold" : tone === "warn" ? "border-[#B98A5A]/60 text-[#D9A877]" : "border-ink-line text-mute"
  }`}>{children}</span>
);
