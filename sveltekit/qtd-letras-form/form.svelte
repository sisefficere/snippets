<script>
    $: letras = campo.length;
</script>

<form action="">
    <textarea
        name="relato"
        id=""
        cols="30"
        rows="10"
        class="nlf-input-textarea w-full {$errors.relato != undefined
            ? 'nlf-input-invalid'
            : ''}"
        placeholder="Digite o seu relato"
        maxlength="1000"
        bind:value={$form.relato}
        required
    />
    <span class="font-bold text-auxiliar-primeira dark:text-branco"
        ><span class="{letras === 1000 ? 'text-quarta' : 'text-black dark:text-branco'}"
            >{letras}</span
        >/1000</span
    >
</form>
