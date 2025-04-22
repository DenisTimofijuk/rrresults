const messages = [
    "Bandykite dar kartą vėliau.",
    "Prarastas ryšys su serveriu. Kai kurie duomenys gali būti nepasiekiami.",
    "Nepavyko gauti naujausių duomenų. Patikrinkite savo ryšį ir bandykite dar kartą.",
    "Įvyko netikėta klaida. Mes jau ja rūpinamės!",
    "Internetiniai vėjai šiandien šiek tiek pašėlę. Kai kurių duomenų gali trūkti.",
    "Gamta kantri, bet internetas kartais ne. Pabandykite atnaujinti puslapį arba prisijungti vėliau.",
    "Mūsų serveris šiuo metu ilsisi, bet netrukus grįš į darbą!",
    "Atrodo, kad pradingome rūke... Bandykite dar kartą vėliau!",
    "Ryšys su gamta tvirtas, bet internetas šį kartą silpnesnis. Bandykite dar kartą.",
    "Duomenys nepasiekė mūsų lizdo. Patikrinkite savo ryšį ir pabandykite vėl!",
    "Mūsų elektroniniai miškai šiuo metu patiria audrą. Grįžkite šiek tiek vėliau!",
    "Kartais net ir technologijos reikalauja akimirkos poilsio. Bandykite dar kartą vėliau!",
    "Žiogas perkirpo interneto laidą... Mėginame jį pataisyti!",
    "Mūsų duomenų upė šiuo metu išdžiūvo. Bandome ją vėl pripildyti!",
    "Atrodo, kad interneto paukščiai pasiklydo. Bandykite dar kartą vėliau.",
    "Ryšys su serveriu nutrūko kaip nukritęs rudeninis lapas. Bandome jį pakelti!",
    "Mūsų virtualus avilys patyrė gedimą. Bitutės jau taiso situaciją!",
    "Žvaigždės danguje ryškios, bet mūsų serveris šiuo metu blyškus. Pabandykite vėliau!",
    "Gamtos garsai pasiekiami, bet interneto bangos šiuo metu silpnos. Bandykite dar kartą!",
    "Mūsų tinklas užmigo po žvaigždėtu dangumi... Bandome jį pažadinti!"
];

export function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return `Oi! Kažkas nepavyko. ${messages[randomIndex]}`;
}