<script>
    // Implementação de GraphQL com paginação por cursor e bloco await na marcação
    let variables = `{
        "first": 6,
        "after": null,
        "last": null,
        "before": null
    }`,
        getPosts = null;

    const posts = async (variables) => {
        const query = `
                query Ultimos4Posts($after: String = "", $before: String = "", $first: Int = 10, $last: Int = 10) {
                    posts(after: $after, before: $before, first: $first, last: $last) {
                    nodes {
                        date
                        content(format: RENDERED)
                        excerpt(format: RENDERED)
                        featuredImage {
                        node {
                            guid
                        }
                        }
                        terms {
                        nodes {
                            ... on Category {
                            name
                            }
                        }
                        }
                        title(format: RENDERED)
                        slug
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                        hasPreviousPage
                        startCursor
                    }
                    }
                }
            `;

        const res = await fetch(`${import.meta.env.VITE_ENDPOINT_GRAPHQL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const data = await res.json();

        return data;
    };

    function homePage() {
        variables = `{
            "first": 6,
            "after": null,
            "last": null,
            "before": null
        }`;
    }
    function previousPage(startCursor) {
        variables = `{
            "first": null,
            "after": null,
            "last": 6,
            "before": "${startCursor}"
        }`;
    }
    function nextPage(endCursor) {
        variables = `{
            "first": 6,
            "after": "${endCursor}",
            "last": null,
            "before": null
        }`;
    }

    $: getPosts = posts(variables);
</script>

{#await getPosts}
    <p class="nlf-container nlf-container-filho">Carregando publicações ...</p>
{:then res}
    <div
        class="nlf-container nlf-container-filho gap-10 overflow-auto max-lg:px-5 max-md:flex max-md:flex-nowrap items-center max-md:gap-5 pb-5 md:grid md:justify-items-center md:gap-10 md:max-xl:grid-cols-2 lg:max-2xl:px-[5%] xl:grid-cols-3"
    >
        {#each res.data.posts.nodes as post, i}
            <!-- <CardBlogSegundo
                imgDestaque={post.featuredImage.node.hasOwnProperty("guid") ? post.featuredImage.node.guid : ""}
                etiqueta={post.terms.nodes.hasOwnProperty("name") ? post.terms.nodes.name : ""}
                titulo={post.title}
                conteudo={post.excerpt}
                href="/blog/{post.slug}"
            /> -->
        {/each}
    </div>
    <div class="nlf-container nlf-container-filho flex justify-between">
        {#if res.data.posts.pageInfo.hasPreviousPage}
            <button
                on:click={previousPage(res.data.posts.pageInfo.startCursor)}
                class="cursor-pointer">Página anterior</button
            >
            <button on:click={homePage} class="cursor-pointer"> Início </button>
        {/if}
        {#if res.data.posts.pageInfo.hasNextPage}
            <button
                on:click={nextPage(res.data.posts.pageInfo.endCursor)}
                class="cursor-pointer">Próxima página</button
            >
        {/if}
    </div>
{/await}
