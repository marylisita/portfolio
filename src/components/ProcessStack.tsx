"use client";
import { useEffect, useRef } from "react";
import { useT } from "@/i18n/LanguageContext";

export default function ProcessStack() {
  const { t } = useT();
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = document.querySelectorAll(".process-card");
    cards.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="process">
      <div className="wrap">
        <div className="process__grid">
          <div>
            <h2 className="process__headline">{t("process_headline").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}</h2>
            <p className="process__sub">
              {t("process_sub")}
            </p>
          </div>
          <div className="process__cards" ref={processRef}>
            {[
              {
                num: "01",
                title: t("process_01_title"),
                desc: t("process_01_desc"),
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
                iconBg: "#D4F0FF",
                bg: "#FDEAE5"
              },
              {
                num: "02",
                title: t("process_02_title"),
                desc: t("process_02_desc"),
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
                iconBg: "#E6F9D2",
                bg: "#E6F5EC"
              },
              {
                num: "03",
                title: t("process_03_title"),
                desc: t("process_03_desc"),
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
                iconBg: "#FFE1B5",
                bg: "#FBE6F3"
              },
              {
                num: "04",
                title: t("process_04_title"),
                desc: t("process_04_desc"),
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9"></polygon></svg>,
                iconBg: "#FFDDEE",
                bg: "#EAF6FA"
              }
            ].map((card, idx) => (
              <div key={idx} className="process-card" data-index={idx} style={{ backgroundColor: card.bg }}>
                <span className="process-card__num">{card.num}</span>
                <div style={{ backgroundColor: card.iconBg, width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {card.icon}
                </div>
                <h3 className="process-card__title">{card.title}</h3>
                <p className="process-card__desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
