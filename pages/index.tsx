import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";

const restaurants = [["Penny", "South Park", "Kiltakellari", "Salve", "Pompier", "Annapurna"]];

async function getData(restaurant: string) {
  const res = await fetch("/api/fetch/?" + new URLSearchParams({ restaurant: restaurant }));
  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${restaurant}`);
  }
  return res.json();
}

export default function Home() {
  const [data, setData] = useState(restaurants.map((group) => group.map((r) => null)));

  useEffect(() => {
    restaurants.forEach((group, i) => {
      group.forEach((restaurant, j) => {
        getData(restaurant).then((result) => {
          setData((prev) => {
            const next = [...prev];
            next[i][j] = result;
            return next;
          });
        });
      });
    });
  }, []);

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
                    <a className="plainlink" href={r.restaurant.url}>
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
                {r ? (
                  r.lounas.map((food) => (
                    <li
                      className="fooditem"
                      key={food}
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
        <meta name="viewport" content="width=device-width, initial-scale=0.9" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍝</text></svg>"></link>
      </Head>

      <main>
        <Header title="Lounas." />
        <div className="grid">{grid}</div>
      </main>

      <Footer />
    </div>
  );
}
