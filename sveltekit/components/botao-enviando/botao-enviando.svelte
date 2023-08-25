<script>
    // lógica
    export let delayed=false, submitting=false;
    // aparencia
    export let classesBotaoAtivo="", classesBotaoInativo="";
    // spinner
    export let spinnerSrc="", classesSpinner=""
    // botao
    export let nomeBotao=""
    
</script>

{#if !delayed && !submitting}
<button type="submit" class="{classesBotaoAtivo}">{nomeBotao}</button>
{:else if !delayed && submitting}
<button type="submit" class="{classesBotaoAtivo} {classesBotaoInativo}">Enviando</button>
{:else if delayed}
    <p
        class="flex gap-3 items-center"
    >
        <span class="{classesBotaoAtivo} {classesBotaoInativo} justify-center">Enviando</span>
        <img src="{spinnerSrc}" class="{classesSpinner}">
    </p>
{/if}