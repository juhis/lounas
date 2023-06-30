import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";

const restaurants = [
  ["Penny", "Southpark", "Pompier", "Kiltakellari", "Salve", "Fulbari", "Annapurna"],
];

async function getData(restaurant: string, dayOffset: number) {
  const res = await fetch(
    "/api/fetch/?" +
      new URLSearchParams({
        restaurant: restaurant,
        day: (new Date().getDay() + dayOffset).toString(),
      })
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${restaurant}`);
  }
  return res.json();
}

export default function Home() {
  const [dayOffset, setDayOffset] = useState(0);
  const [data, setData] = useState(restaurants.map((group) => group.map((r) => null)));
  const [loading, setLoading] = useState(restaurants.map((group) => group.map((r) => false)));

  useEffect(() => {
    restaurants.forEach((group, i) => {
      group.forEach((restaurant, j) => {
        setLoading((prev) => {
          const next = [...prev];
          next[i][j] = true;
          return next;
        });
        getData(restaurant, dayOffset).then((result) => {
          setData((prev) => {
            const next = [...prev];
            next[i][j] = result;
            return next;
          });
          setLoading((prev) => {
            const next = [...prev];
            next[i][j] = false;
            return next;
          });
        });
      });
    });
  }, [dayOffset]);

  const grid = useMemo(
    () =>
      data.map((group, i) => {
        return group.map((r, j) => {
          return (
            <div key={restaurants[i][j]} style={{ gridColumn: i + 1, gridRow: j + 1 }}>
              <h4>
                {r ? (
                  <>
                    <span className="icon">{r.restaurant.icon}</span>
                    <a className="plainlink" href={r.restaurant.visitUrl || r.restaurant.url}>
                      {r.restaurant.name}
                    </a>
                  </>
                ) : (
                  <>
                    <span className="icon">🥦</span>
                    <span>{restaurants[i][j]}</span>
                  </>
                )}
              </h4>
              <ul className="foodlist">
                {r && !loading[i][j] ? (
                  r.lounas.map((food) => (
                    <li
                      className="fooditem"
                      key={r.restaurant.name + food.text}
                      dangerouslySetInnerHTML={{ __html: `${food.icon} ${food.text}` }}></li>
                  ))
                ) : (
                  <li>🐢 loading</li>
                )}
              </ul>
            </div>
          );
        });
      }),
    [data]
  );

  return (
    <div className="container">
      <Head>
        <title>Lounas.</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=0.9" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍝</text></svg>"></link>
      </Head>

      <main>
        <Header title="Lounas." />
        <div className="menu">
          {/* <span className="menuitem selected" style={{ gridColumn: 1, gridRow: 1 }}>
            Punavuori
          </span>
          <span className="menuitem" style={{ gridColumn: 2, gridRow: 1 }}>
            Meilahti
          </span> */}
          <span
            className={dayOffset == 0 ? "menuitem selected" : "menuitem"}
            style={{ gridColumn: 1, gridRow: 2 }}
            onClick={() => {
              setDayOffset(0);
            }}>
            tänään
          </span>
          <span
            className={dayOffset == 1 ? "menuitem selected" : "menuitem"}
            style={{ gridColumn: 2, gridRow: 2 }}
            onClick={() => {
              setDayOffset(1);
            }}>
            huomenna
          </span>
        </div>
        <div className="grid">{grid}</div>
      </main>

      <Footer />
    </div>
  );
}
