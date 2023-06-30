import render from "dom-serializer";
import { innerText } from "domutils";
import * as CSSselect from "css-select";
import { Restaurants } from "../../types/types";

const getWeekNumber = (date: Date) => {
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // @ts-ignore
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const parseRestaDeal = (dom: any, day: string) => {
  let food = [];
  const subset = CSSselect.selectAll("#section-1 .row", dom);
  const elems = CSSselect.selectAll("h4,p", subset[0]);
  elems.forEach((elem, i) => {
    if (render(elem).toLowerCase().includes(day)) {
      for (let j = i + 2; j < elems.length; j++) {
        if (CSSselect.is(elems[j], "p")) {
          food.push({ icon: "🤤", text: render(elems[j].children).trim() });
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

const restaurants: Restaurants = {
  Penny: {
    name: "Penny",
    url: "https://www.restaurantpenny.fi/new-page",
    icon: "🇺🇸",
    language: "en",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      if (day === "monday" || day === "tuesday") {
        return [{ icon: "⛔", text: "kiinni" }];
      }
      let food = { icon: "😭", text: "ei löytynyt mitään" };
      const elems = CSSselect.selectAll("h4", dom);
      elems.forEach((elem, i) => {
        if (render(elem).toLowerCase().includes(day)) {
          if (elem.children.length > 1) {
            food = { icon: "🤤", text: render(elem.children[1]).trim() };
          } else {
            food = { icon: "🤤", text: render(elems[i + 1].children[0]).trim() };
          }
        }
      });
      return [food];
    },
  },
  Kiltakellari: {
    name: "Kiltakellari",
    url: "https://ravintolakiltakellari.fi/lounas",
    icon: "🏰",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      return [{ icon: "⛔", text: "sulki 7.8. saakka" }];
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
    //url: "https://www.raflaamo.fi/_next/data/ATWrNK7H4888TMUv6Zln1/fi/restaurant/helsinki/salve/menu/5274/ruokalista.json",
    url: "https://www.raflaamo.fi/_next/data/ATWrNK7H4888TMUv6Zln1/fi/restaurant/helsinki/salve.json",
    icon: "⛵",
    language: "en",
    parseType: "JSON",
    parse: function (json: any, day: string) {
      const thisWeek = json.pageProps.restaurant.lunchMenuGroups[0].weeklyLunchMenu.filter(
        (menu) => menu.weekNumber === getWeekNumber(new Date())
      );
      if (
        thisWeek.length === 0 ||
        thisWeek[0].dailyMenuAvailabilities[day] == null ||
        thisWeek[0].dailyMenuAvailabilities[day].menu.menuSections.length === 0
      ) {
        return [{ icon: "😭", text: "ei löytynyt mitään" }];
      }
      return thisWeek[0].dailyMenuAvailabilities[day].menu.menuSections[0].portions.map(
        (portion) => ({ icon: "🤤", text: portion.name.fi_FI })
      );
    },
  },
};

export default restaurants;
