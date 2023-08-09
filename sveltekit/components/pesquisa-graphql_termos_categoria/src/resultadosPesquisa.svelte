<script>
    import he from "he";
    export let titulo, url, descricao;

    const tituloSemHtml =
        titulo.replace(/<[^>]*>/g, "").substring(0, 60) + "[...]";
    const descricaoSemHtml =
        descricao.replace(/<[^>]*>/g, "").substring(0, 60) + "[...]";
</script>

<a
    href={url}
    target="_blank"
    rel="noreferrer"
    class="text-sm leading-[1.5] p-2 border rounded-md border-preto/20 dark:border-branco/40 link"
    ><span class="font-bold text-principal-primeira dark:text-branco"
        >{he.decode(titulo.replace(/<[^>]*>/g, "").substring(0, 60)) +
            " [...]"}</span
    >
    - {he.decode(descricao.replace(/<[^>]*>/g, "").substring(0, 60)) +
        "[...]"}</a
>
