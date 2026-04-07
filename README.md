# 🕵️ IMPOSTOR

> Imprezowa gra słowna dla 3+ graczy — kto jest Impostorem?

Przeglądarkowa gra towarzyska bez instalacji, bez serwera. Wystarczy otworzyć `index.html`.

---

## Jak grać

1. Wpisz imiona graczy i ustaw liczbę Impostorów
2. Każdy gracz sprawdza swoją kartę **prywatnie** (odwróć ekran od reszty)
3. Wszyscy podają po jednym skojarzeniu z hasłem
4. Głosowanie — każdy wskazuje tylu podejrzanych, ilu jest Impostorów
5. Wyniki: topka = gracze z największą liczbą głosów

### Role

| Rola | Co wie | Wygrywa gdy |
|------|--------|-------------|
| 🟢 **Gracz** | kategorię i hasło | wszyscy Impostorzy w topce |
| 🔴 **Impostor** | tylko kategorię | nie zostanie wskazany |
| 🃏 **Jester** | kategorię i hasło | zostanie wskazany jako Impostor |

---

## Tryby specjalne

**🃏 Tryb Jester** — jeden gracz losowo zostaje Jesterem. Zna hasło, ale jego celem jest zostać wskazanym przez innych jako Impostor.

**⚡ Tryb Chaosu** — 20% szansy na aktywację każdej rundy. Gdy aktywny, wszyscy gracze stają się Impostorami i nikt nie zna hasła — ujawniany dopiero w wynikach!

---

## Uruchomienie

Otwórz `index.html` w przeglądarce. Nic więcej nie potrzeba.

```
git clone https://github.com/twoj-nick/impostor.git
cd impostor
# otwórz index.html w przeglądarce
```

---

## Kategorie

Domyślne kategorie: Jedzenie i picie, Filmy, Zwierzęta, Sport, Zawody, Muzyka, Miejsca, Pojazdy, Supermoce, Kraje, Przedmioty.

Aby dodać własne słowa lub kategorie, edytuj obiekt `DATABASE` w pliku `js/data.js`.

---

## Stos technologiczny

Vanilla HTML/CSS/JS — zero zależności, zero bundlera.

---

*by Ignacy Sadowski*
