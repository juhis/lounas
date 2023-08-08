import type { NextApiRequest, NextApiResponse } from "next";
import * as htmlparser2 from "htmlparser2";
import restaurants from "./restaurants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const days = {
    en: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    fi: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
  };
  const restaurant = restaurants[req.query.restaurant as string];
  const day = req.query.day ? parseInt(req.query.day as string) : new Date().getDay();
  if (restaurant === undefined) {
    res.json({ restaurant: { name: req.query.restaurant }, lounas: ["not implemented"] });
    return;
  }
  if (day == 0 || day == 6) {
    res.json({ restaurant: restaurant, lounas: [{ icon: "⏳", text: "viikonloppu" }] });
    return;
  }
  await fetch(restaurant.url.replace("{isotime}", req.query.isotime as string))
    .then((response) => {
      if (restaurant.parseType === "HTML") {
        return response.text();
      } else if (restaurant.parseType === "JSON") {
        return response.json();
      } else {
        throw new Error(`parseType ${restaurant.parseType} not implemented`);
      }
    })
    .then((content) => {
      let model = content;
      if (restaurant.parseType === "HTML") {
        model = htmlparser2.parseDocument(content);
      }
      const lounas = restaurant.parse(model, days[restaurant.language][day]);
      res.json({ restaurant: restaurant, lounas: lounas });
    })
    .catch((error) => {
      console.error(error);
      res.json({ restaurant: restaurant, lounas: [{ icon: "👀", text: "error" }] });
    });
}
