"""Testes do filtro de nicho (legal ops / legal tech). Rode: python test_jobfilter.py"""
import jobfilter
import bot

# (título, deve_entrar?)
CASES = [
    # ENTRA — legal ops / legal tech / legal engineering
    ("Legal Operations Manager", True),
    ("Manager of Legal Engineering", True),
    ("Legal Tech Product Manager", True),
    ("Legal Innovation Partner", True),
    ("Legal Consultant – Technology", True),
    ("Analista de Operações Jurídicas", True),
    ("Especialista em Automação Jurídica", True),
    ("Legal Data Analyst", True),
    # NÃO ENTRA — jurídico tradicional (sem componente técnico)
    ("Senior Legal Counsel", False),
    ("Paralegal (Remote)", False),
    ("Corporate Lawyer", False),
    ("Advogado Trabalhista", False),
    # NÃO ENTRA — técnico sem ser jurídico / ruído
    ("Backend Engineer", False),
    ("Legacy Systems Administrator", False),
    ("Graphic Designer", False),
    ("Data Analyst", False),
]


def run():
    fails = []
    for title, expected in CASES:
        got = jobfilter.is_niche({"title": title})
        mark = "✓" if got == expected else "✗"
        if got != expected:
            fails.append((title, expected, got))
        print(f"  {mark} {title!r:48} esperado={expected} obtido={got}")
    # smoke test do formatador
    msg = bot.build_message([{
        "title": "Legal Operations Manager", "company": "Globex",
        "location": "Remote", "url": "https://x/1", "source": "Jobicy", "salary": "",
    }])
    assert "Legal Operations Manager" in msg and "Jobicy" in msg, "formatação quebrou"
    print("\n  ✓ build_message ok")
    if fails:
        print(f"\n❌ {len(fails)} falha(s)")
        raise SystemExit(1)
    print("\n✅ todos os casos passaram")


if __name__ == "__main__":
    run()
