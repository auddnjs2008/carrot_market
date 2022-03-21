import Document, { Head, Html, Main, NextScript } from 'next/document';


class CustomDocument extends Document {

    render(): JSX.Element {
        console.log("Document is running");
        return <Html>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    }
}

export default CustomDocument;

//document 컴포넌트는 서버에서 한 번만 실행된다.
// app 컴포넌트는 페이지를 불러올때마다 실행된다.
// document 컴포넌트가 하는일은 NextJs 앱의 HTML 뼈대를 짜주는 역할을 한다.

// NEXT JS의 폰트 최적화는 구글 폰트에서 제공하는 폰트를 기반으로 한다.
// 이 최적화는 개발 모드에서는 안일어나고 
// 빌드할 때 일어난다. 
// 이 컴포넌트는 한번만 렌더링 된다. 
