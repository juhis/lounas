import render from "dom-serializer";
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

const restaurants: Restaurants = {
  Penny: {
    name: "Penny",
    url: "https://www.restaurantpenny.fi/new-page",
    icon: "🇺🇸",
    language: "en",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
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
  "South Park": {
    name: "South Park",
    //this is a mess
    //url: "https://southparkrestaurant.fi/lounas",
    url: "https://www.lounaat.info/lounas/southpark/helsinki",
    icon: "🏞️",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      let food = [];
      const elems = CSSselect.selectAll("h3,.dish", dom);
      elems.forEach((elem, i) => {
        if (render(elem).toLowerCase().includes(day)) {
          for (let j = i + 1; j < elems.length; j++) {
            if (CSSselect.is(elems[j], "p")) {
              food.push({ icon: "🤤", text: render(elems[j].children) });
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
  Annapurna: {
    name: "Annapurna",
    url: "https://restadeal.fi/menu/6/1/lunch",
    icon: "🇳🇵",
    language: "fi",
    parseType: "HTML",
    parse: function (dom: any, day: string) {
      let food = [];
      const subset = CSSselect.selectAll("#section-1 .row", dom);
      const elems = CSSselect.selectAll("h4,p", subset[0]);
      elems.forEach((elem, i) => {
        if (render(elem).toLowerCase().includes(day)) {
          for (let j = i + 2; j < elems.length; j++) {
            if (CSSselect.is(elems[j], "p")) {
              food.push({ icon: "🤤", text: render(elems[j].children).trim() });
            }
          }
        }
      });
      if (food.length === 0) {
        food = [{ icon: "😭", text: "ei löytynyt mitään" }];
      }
      return food;
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
