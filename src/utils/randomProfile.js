import names from "../content/names.json";

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Whole number from 60 to 100
const randomAge = () => 60 + Math.floor(Math.random() * 41);

// Makes a random Singapore-style person; the gender always matches the name
export function randomPerson() {
    const gender = pick(["M", "F"]);
    const group = pick(["chinese", "malay", "indian"]);
    const firstName = pick(gender === "M" ? names[group].male : names[group].female);

    let fullName = "";
    if (group === "chinese") {
        fullName = `${pick(names.chinese.surnames)} ${firstName}`;
    } else if (group === "malay") {
        fullName = `${firstName} ${gender === "M" ? "bin" : "binti"} ${pick(names.malay.male)}`;
    } else {
        fullName = `${firstName} ${gender === "M" ? "s/o" : "d/o"} ${pick(names.indian.male)}`;
    }

    return { name: fullName, first_name: firstName, gender: gender, age: randomAge() };
}
