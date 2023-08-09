<script>
    import ResultadoPesquisa from "$lib/components/resultadoPesquisa.svelte";
    import PholdItemInformativo from "$lib/components/placeholders/pholdItemInformativo.svelte";

    export let classes = "",
        classesLabel = "",
        classesInput = "",
        classesResultados = "";

    // Implementação de GraphQL com paginação por cursor e bloco await na marcação
    let getPosts = null,
        termos = "",
        categoria = "";
    // variáveis para pesquisa de POSTS
    let postVariables = `
            "first": 3,
            "after": null,
            "last": null,
            "before": null
        `;

    const pesquisa = async (termos, categoria, variables) => {
        const query = `
            query Pesquisa($after: String = "", $before: String = "", $first: Int = 10, $last: Int = 10, $search: String = "", $categoria: String = "") {
                posts(
                    where: {search: $search, categoryName: $categoria}
                    after: $after
                    before: $before
                    first: $first
                    last: $last
                ) {
                    nodes {
                        excerpt(format: RENDERED)
                        title(format: RENDERED)
                        slug
                    }
                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                        startCursor
                        endCursor
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
                variables: `{
                    "search": "${termos}",
                    "categoria": "${categoria}",
                    ${variables}
                }`,
            }),
        });

        const data = await res.json();

        return data;
    };

    // Paginação de posts
    function homePagePost() {
        postVariables = `
            "first": 3,
            "after": null,
            "last": null,
            "before": null
        `;

        document.getElementById("pesquisa").focus();
    }
    function previousPagePost(startCursor) {
        postVariables = `
            "first": null,
            "after": null,
            "last": 3,
            "before": "${startCursor}"
        `;
        document.getElementById("pesquisa").focus();
    }
    function nextPagePost(endCursor) {
        postVariables = `
            "first": 3,
            "after": "${endCursor}",
            "last": null,
            "before": null
        `;
        document.getElementById("pesquisa").focus();
    }
    function focaPesquisa() {
        document.getElementById("pesquisa").focus();
    }
    function limpaTermos() {
        termos = ""
    }
    function limpaCategoria() {
        categoria = ""
    }
    function avisoFiltro() {
        if(categoria != ""){
            alert("Limpe o filtro de categoria antes de realizar uma busca por termos!")
        }
    }

    $: {
        if (categoria != "") {
            termos = "";
        } else if (termos != "") {
            categoria = "";
        }
    }
    $: getPosts = pesquisa(termos, categoria, postVariables);
</script>

<form
    class="relative w-full nlf-container nlf-container-filho flex items-center gap-10 mt-5 {classes}"
>
    <h3 class="nlf-titulo3 text-principal-primeira dark:text-branco">
        Pesquise<br>Artigos
    </h3>
    
    <fieldset class="flex flex-wrap gap-5">
        <label class="">
            <span class="text-principal-primeira dark:text-branco flex justify-between {classesLabel}">
                Por termos
                <span>
                    {#if termos != ""}
                        <button
                            on:click={limpaTermos}
                            class="text-sm rounded-md text-vermelho w-max"
                            >limpar</button
                        >
                    {/if}
                </span>
            </span>
            <input
                id="pesquisa"
                type="text"
                placeholder="Digite qualquer termo"
                name="pesquisa"
                class="peer w-full rounded-md border-2 border-principal-primeira text-preto py-2 focus:rounded-b-none focus:ring-0 max-w-[30rem] {classesInput}"
                bind:value={termos} on:keypress={avisoFiltro}
            />
            <div
                class="absolute z-[1000] w-full left-0 flex h-0 flex-col items-center gap-5 overflow-auto rounded-b-2 border-principal-primeira px-5 bg-branco dark:bg-dark transition-all duration-500 peer-focus:h-max peer-focus:border-b-2 peer-focus:py-10 {classesResultados}"
            >
                <div class="flex flex-col gap-5 p-10 border-principal-segunda rounded-xl border-2 items-center justify-center max-w-[40rem] w-full">
                    {#if termos === "" && categoria === ""}
                        <p>Digite algo para pesquisar no blog</p>
                    {:else}
                        {#await getPosts}
                            <div class="flex flex-col gap-2">
                                <PholdItemInformativo />
                                <PholdItemInformativo />
                                <PholdItemInformativo />
                            </div>
                        {:then res}
                            {#if res.data.posts.nodes.length > 0}
                                <div
                                    class="flex flex-col gap-2"
                                >
                                    {#each res.data.posts.nodes as post}
                                        <ResultadoPesquisa
                                            titulo={post.title}
                                            descricao={post.excerpt}
                                            url={"/blog/" + post.slug}
                                        />
                                    {/each}
                                </div>

                                <div
                                    class="nlf-container nlf-container-filho flex justify-between"
                                >
                                    {#if !res.data.posts.pageInfo.hasPreviousPage}
                                        <button
                                            class="cursor-auto font-bold rounded-xl text-center w-max px-5 py-3 bg-principal-primeira/20 text-branco shadow-[-0.3rem_0.3rem_0_#FFE404]"
                                            >{"<<"}</button
                                        >
                                    {/if}
                                    {#if res.data.posts.pageInfo.hasPreviousPage}
                                        <button
                                            on:click={previousPagePost(
                                                res.data.posts.pageInfo
                                                    .startCursor
                                            )}
                                            class="cursor-pointer font-bold rounded-xl text-center w-max nlf-grow px-5 py-3 bg-principal-primeira text-branco shadow-[-0.3rem_0.3rem_0_#FFE404]"
                                            >{"<<"}</button
                                        >
                                        <button
                                            on:click={homePagePost}
                                            class="cursor-pointer font-bold rounded-xl text-center w-max nlf-grow px-5 py-3 bg-principal-primeira text-branco shadow-[-0.3rem_0.3rem_0_#FFE404]"
                                        >
                                            Início
                                        </button>
                                    {/if}
                                    {#if !res.data.posts.pageInfo.hasNextPage}
                                        <button
                                            class="cursor-auto font-bold rounded-xl text-center w-max px-5 py-3 bg-principal-primeira/20 text-branco shadow-[-0.3rem_0.3rem_0_#FFE404]"
                                            >{">>"}
                                        </button>
                                    {/if}
                                    {#if res.data.posts.pageInfo.hasNextPage}
                                        <button
                                            on:click={nextPagePost(
                                                res.data.posts.pageInfo
                                                    .endCursor
                                            )}
                                            class="cursor-pointer font-bold rounded-xl text-center w-max nlf-grow px-5 py-3 bg-principal-primeira text-branco shadow-[-0.3rem_0.3rem_0_#FFE404]"
                                            >{">>"}</button
                                        >
                                    {/if}
                                </div>
                            {:else}
                                <p>
                                    <span
                                        class="font-bold text-vermelho text-center"
                                        >Não encontramos resultados para a sua
                                        busca.</span
                                    ><br />Utilize outros termos ou busque por
                                    categoria.
                                </p>
                            {/if}
                        {/await}
                    {/if}
                </div>
            </div>
        </label>
        <label class="flex flex-col gap-1">
            <span class="text-principal-primeira dark:text-branco flex justify-between">
                Por categoria
                <span>
                    {#if categoria != ""}
                        <button
                            on:click={limpaCategoria}
                            class="text-sm rounded-md text-vermelho w-max"
                            >limpar</button
                        >
                    {/if}
                </span>
                </span
            >
            <select
                class="flex gap-5 rounded-md border-principal-primeira border-2 text-preto"
                bind:value={categoria}
                on:change={focaPesquisa}
            >
                <option value="" disabled>Selecione</option>
                <option>New Tech</option>
                <option>Ações Sociais</option>
                <option>Colaboradores</option>
                <option>Empresa</option>
                <option>Equipe</option>
                <option>Eventos</option>
                <option>Reconhecimento Profissional</option>
                <option>Treinamentos</option>
                <option>Vagas</option>
            </select>
        </label>
    </fieldset>
</form>
