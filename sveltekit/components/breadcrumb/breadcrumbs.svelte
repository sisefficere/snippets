<script>
    // baseado em https://df.id.au/technical/svelte/breadcrumbs/
    import { page } from '$app/stores';

    export let classes="";
    export { classes as class }
    // Remove zero-length tokens.
    $: tokens = $page.url.pathname.split('/').filter((t) => t !== '');

    // Create { label, href } pairs for each token.
    let tokenPath = '';
    $: crumbs = tokens.map((t) => {
        tokenPath = '/' + t;
        return {
            label: t,
            href: tokenPath
        };
    });

    // Add a way to get home too.
    $: crumbs.unshift({ label: 'início', href: '/' });
</script>

{#if $page.url.pathname != "/"}
<div class="flex gap-1 w-full font-eurostile items-center p-3 {classes}">
    <p>Você está em: </p>
	<ul class="flex gap-1 items-center">
        {#each crumbs as c, i}
            {#if i == crumbs.length - 1}
                <li>{c.label.replace(/-/g,' ')}</li>
            {:else}
                <li><a href={c.href} class="eff-link eff-link_preto">{c.label.replace(/-/g,' ')}</a> {"/"}</li>
            {/if}
        {/each}
	</ul>
</div>
{/if}