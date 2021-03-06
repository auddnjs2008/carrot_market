import { readdirSync } from 'fs';
import matter from 'gray-matter';
import { GetStaticProps, NextPage } from 'next';
import { unified } from "unified";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import Layout from '@components/layout';

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
    return (
        <Layout title={data.title} seoTitle={data.title} >
            <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post }} />
        </Layout>
    )
}


export function getStaticPaths() {
    const files = readdirSync("./posts").map(file => {
        const [name, extension] = file.split(".");
        return { params: { slug: name } };
    });
    return {
        paths: files,
        fallback: false
    }
}
// getStaticPaths는 동적 URL이 있는 페이지에서 getStaticProps을
// 쓸 때 필요 
// getStaticProps 딱 한번 페이지가 빌드될때 실행
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
    const { value } = await unified().use(remarkParse).use(remarkHtml).process(content)

    return {
        props: {
            post: value,
            data
        }
    }
}




export default Post;