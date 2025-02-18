// import random
// import json

// teams = [
//     "Švilpikai", "Tundra", "Universalai", "Bobausiniai tartigradai", "Laukiniai",
//     "Būdinu rūšis iki karalysčių", "Dream team", "Hienos", "Kapibaros", "Triogloditai",
//     "Beržai keružiai", "Kolibrinis sfinksas", "Kirkutis", "Hayabusa", "Mikro makro"
// ]

// categories = [
//     "Vėžegyviai ir dėlės.", "Žuvys", "Kitos rūšys", "Varliagyviai ir ropliai", "Laumžirgiai",
//     "Žinduoliai", "Voragyviai", "Moliuskai", "Kerpės", "Grybai", "Samanos", "Drugiai",
//     "Vabalai", "Kiti vabzdžiai", "Paukščiai", "Induočiai augalai"
// ]

// def random_value():
//     return random.choice([None] + list(range(301)))

// result = [
//     {
//         "TeamName": team,
//         "data": {category: random_value() for category in categories}
//     }
//     for team in teams
// ]

// json_result = json.dumps(result, ensure_ascii=False, indent=2)
// json_result