<script>
    // instalação com npm install he (necessário para decodificar caracteres HTML)
    import he from 'he';

    export let titulo=""
    export let descricao=""
    export let tituloSeo=""

    const nomeSite = import.meta.env.VITE_NOME_SITE
    const siteUrl = import.meta.env.VITE_URL_SITE
    const logo = import.meta.env.VITE_LOGO_SITE

    // tratamentos
    const url = siteUrl.replace('/','')
    const descricaoSemHtml = descricao.replace(/<[^>]*>/g, "")
    const tituloSemHtml = titulo.replace(/<[^>]*>/g, "")

    import { page } from "$app/stores";
</script>


{#if titulo}
<title>{titulo.includes(nomeSite) ? he.decode(titulo) : he.decode(titulo) + ' - ' + nomeSite}</title>
{:else if $page.url.pathname === "/obrigado"}
<title>Obrigado! - {nomeSite}</title>
{:else}
<title>Página não encontrada! - {nomeSite}</title>
{/if}
{#if descricao}
<meta
    name="description"
    content={he.decode(descricaoSemHtml)}
/>
{#if tituloSeo}
<meta property="og:title" content={tituloSeo} />
{:else}
<meta property="og:title" content={titulo.includes(nomeSite) ? he.decode(titulo) : he.decode(titulo) + ' - ' + nomeSite} />
{/if}
<meta property="og:type" content="website" />
<meta
    property="og:image"
    content={logo}
/>
<meta property="og:url" content={url + $page.url.pathname} />
<meta name="twitter:card" content="summary_large_image" />
<meta
    property="og:description"
    content={he.decode(descricaoSemHtml)}
/>
<meta property="og:site_name" content={nomeSite} />
{/if}