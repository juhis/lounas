import render from "dom-serializer";
import { innerText } from "domutils";
import * as CSSselect from "css-select";
import { Restaurants } from "../../types/types";

const parseRestaDeal = (dom: any, day: string) => {
  let food = [];
  const subset = CSSselect.selectAll("#section-1 .row", dom);
  const elems = CSSselect.selectAll("h4,p", subset[0]);
  elems.forEach((elem, i) => {
    if (render(elem).toLowerCase().includes(day)) {
      for (let j = i + 2; j < elems.length; j++) {
        if (CSSselect.is(elems[j], "p")) {
          const text = render(elems[j].children).trim();
          food.push({ icon: "🤤", text: text });
        }
        if (CSSselect.is(elems[j], "h4")) {
          break;
        }
      }
    }
  });
  if (food.length === 0) {
    food = [{ icon: "😭", text: "ei löytynyt mitään" }];
  }
  return food;
};

const parseLounaatInfo = (dom: any, day: string, className: string) => {
  let food = [];
  const elems = CSSselect.selectAll(`h3,.${className}`, dom);
  elems.forEach((elem, i) => {
    if (innerText(elem).toLowerCase().includes(day)) {
      for (let j = i + 1; j < elems.length; j++) {
        if (CSSselect.is(elems[j], "p")) {
          const text = innerText(elems[j].children).trim();
          if (
            text !== "…Lounaan kanssa" &&
            text !== "Pick it" &&
            text !== "Choose it" &&
            text !== "Love it"
          ) {
            food.push({ icon: "🤤", text: text });
          }
        }
        if (CSSselect.is(elems[j], "h3")) {
          break;
        }
      }
    }
  });
  if (food.length === 0) {
    food = [{ icon: "😭", text: "ei löytynyt mitään" }];
  }
  return food;
};

const restaurants: Restaurants = {
  FoodCo: {
    name: "Food & Co",
    url: "https://www.compass-group.fi/menuapi/day-menus?costCenter=3130&date={isotime}&language=fi",
    icon: "🍽️",
    language: "fi",
    parseType: "JSON",
    parse: function (json: any, day: string) {
      const food = json.menuPackages[0].meals.map((meal: any) => ({ icon: "🤤", text: meal.name }));
      console.log(food);
      return food;
    },
  },
  Pihka: {
    name: "Pihka",
    //url: "https://www.pihka.fi/pihka-meclu/",
    url: "https://www.lounaat.info/lounas/pihka-meclu/helsinki",
    icon: "🌲",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseLounaatInfo(dom, day, "dish");
    },
  },
  Pantry: {
    name: "Pantry",
    url: "https://www.lounaat.info/lounas/the-pantry/helsinki",
    icon: "🚪",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseLounaatInfo(dom, day, "info");
    },
  },
  Kiltakellari: {
    name: "Kiltakellari",
    url: "https://www.lounaat.info/lounas/sodexo-kiltakellari/helsinki",
    icon: "🏰",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseLounaatInfo(dom, day, "dish");
    },
  },
  Halo: {
    name: "Halo",
    url: "https://www.lounaat.info/lounas/halo-food-events/helsinki",
    icon: "😇",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseLounaatInfo(dom, day, "dish");
    },
  },
  Southpark: {
    name: "Southpark",
    url: "https://southparkrestaurant.fi/lounas",
    icon: "🏞️",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      let food = [];
      const elems = CSSselect.selectAll("[role=listitem]", dom);
      elems.forEach((elem, i) => {
        const text = innerText(elem);
        if (text.toLowerCase().includes(day) || text.includes("VIIKON ")) {
          const arr = text
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          arr.forEach((s, i) => {
            if (s.includes("PÄIVÄN ") || s.includes("VIIKON ")) {
              let endFound = false;
              for (let j = i + 1; j < arr.length; j++) {
                const s2 = arr[j];
                if (s2.includes("PÄIVÄN ") || s2.includes("VIIKON ")) {
                  food.push({
                    icon: "🤤",
                    text: arr
                      .slice(i, j)
                      .map((t) => t.replace(/^VIIKON [A-Z]+/, "").replace(/^PÄIVÄN [A-Z]+/, ""))
                      .join(" ")
                      .trim(),
                  });
                  endFound = true;
                }
              }
              if (!endFound) {
                food.push({
                  icon: "🤤",
                  text: arr
                    .slice(i)
                    .map((t) => t.replace(/^VIIKON [A-Z]+/, "").replace(/^PÄIVÄN [A-Z]+/, ""))
                    .join(" ")
                    .trim(),
                });
              }
            }
          });
        }
      });
      if (food.length === 0) {
        food = [{ icon: "😭", text: "ei löytynyt mitään" }];
      }
      return food;
    },
  },
  Pompier: {
    name: "Pompier",
    url: "https://pompier.fi/albertinkatu/albertinkatu-menu",
    icon: "🧑‍🚒",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      let food = [{ icon: "😭", text: "ei löytynyt mitään" }];
      const elems = CSSselect.selectAll("p,a", dom);
      elems.forEach((elem, i) => {
        if (render(elem).toLowerCase().includes(day)) {
          for (let j = i + 1; j < elems.length; j++) {
            if (CSSselect.is(elems[j], "p")) {
              food = render(elems[j].children)
                .trim()
                .split("<br>")
                .map((food) => ({ icon: "🤤", text: food.trim() }));
              break;
            }
          }
        }
      });
      return food;
    },
  },
  Fulbari: {
    name: "Fulbari",
    url: "https://restadeal.fi/menu/43/1/lunch",
    icon: "🇳🇵",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseRestaDeal(dom, day);
    },
  },
  Annapurna: {
    name: "Annapurna",
    url: "https://restadeal.fi/menu/6/1/lunch",
    icon: "🏔️",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseRestaDeal(dom, day);
    },
  },
  Salve: {
    name: "Salve",
    url: "https://www.lounaat.info/lounas/salve/helsinki",
    icon: "⛵",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return parseLounaatInfo(dom, day, "dish");
    },
  },
};

export default restaurants;
