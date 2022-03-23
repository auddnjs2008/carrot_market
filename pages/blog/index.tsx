import Layout from "@components/layout";
import matter from "gray-matter";
import { readdirSync, readFileSync } from 'fs';
import { NextPage } from 'next';
import Link from 'next/link';


interface Post {
    title: string;
    date: string;
    category: string;
    slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
    return (
        <Layout title="Blog" seoTitle="Blog">
            <h1 className="font-semibold text-lg">Latest Post</h1>
            <ul>
                {posts.map((post, index) =>
                    <Link key={index} href={`/blog/${post.slug}`}>
                        <a>
                            <div key={index} className="mb-5">
                                <span className="text-lg text-red-500">{post.title}</span>
                                <div><span>{post.date} / {post.category}</span></div>
                            </div>
                        </a>
                    </Link>
                )}
            </ul>
        </Layout>
    )
}

export async function getStaticProps() {
    const blogPosts = readdirSync("./posts").map(file => {
        const content = readFileSync(`./posts/${file}`, "utf-8");
        const [slug, _] = file.split(".");
        return { ...matter(content).data, slug };
    });
    console.log(blogPosts);

    return {
        props: { posts: blogPosts }
    }
}

export default Blog;