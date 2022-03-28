import { Suspense } from 'react'

const cache: any = {};
function fetchData(url: string) {
    if (!cache[url]) {
        throw Promise.all(
            [fetch(url).then(r => r.json()).then(json => cache[url] = json),
            new Promise(resolve => setTimeout(resolve, Math.round(Math.random() * 1555)))
            ])
    }
    return cache[url];
}

function Coin({ id, name, symbol }: any) {
    const { quotes: { USD: { price } } } = fetchData(`https://api.coinpaprika.com/v1/tickers/${id}`);
    console.log(price);
    return <span>
        {name}/{symbol} : ${price}
    </span>
}


function List() {
    const coins = fetchData("https://api.coinpaprika.com/v1/coins");
    return <div>
        <h4>List is done</h4>
        <ul>{coins.slice(0, 10).map((coin: any, index: number) =>
            <li key={index}>
                <Suspense key={coin.id} fallback={`Coin ${coin.name} is loading`}>
                    <Coin key={coin.id} {...coin} />
                </Suspense>
            </li>
        )
        }</ul>
    </div>
}
// 이런식으로 서버 컴포넌트를 쓰게 되면
// 우리는 api 핸들러를 작성하지 않아도 된다.
// 이 안에다  await client?.user() 이런 것과 같이
// 작성을 하면 된다.
// useSWR을 써서 api를 호출하고 결과를 받아오는 작업을
// 할 필요가 없는 것이다.

// 미래에는 리액트 컴포넌트에서 SQL 쿼리를 실행할 수도 있다.



export default function Coins() {
    return <div>
        <h1>Welcome to RSC</h1>
        <Suspense fallback="Rendering in the server...">
            <List />
        </Suspense>
    </div>
}