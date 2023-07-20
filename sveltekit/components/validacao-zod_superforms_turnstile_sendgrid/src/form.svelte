
<script>
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms/client";
    import { Turnstile } from "svelte-turnstile";

    // $page.data.form pega o método retornado pelo page.server.js
    const { form, errors, enhance, message } = superForm($page.data.form, {
        taintedMessage:
            "Tem certeza que deseja sair? Você ainda não enviou o formulário de informações. :(",
    });
</script>

<form action="" use:enhance method="POST">
    <label class="flex flex-col gap-1 w-full">
        <input
            type="text"
            name="nome"
            class="{$errors.motivo != undefined ? "nlf-input-invalid" : ""}"
            required
            bind:value={$form.nome}
        />
        {#if $errors.nome}
            <!-- Componente ErroValidacao com argumento erro={$error.campo} -->
        {/if}
    </label>
    <label class="flex flex-col gap-1 w-full">
        <input
            type="tel"
            name="telefone"
            class="{$errors.motivo != undefined ? "nlf-input-invalid" : ""}"
            required
            bind:value={$form.telefone}
        />
        {#if $errors.telefone}
            <!-- Componente ErroValidacao com argumento erro={$error.campo} -->
        {/if}
    </label>
    <button type="submit" class="nlf-botao nlf-botao-submit mt-3 self-center"
        >Enviar</button
    >
    {#if $message}
        <!-- Componente ErroTurnstile com argumento message={$message} -->
    {/if}
    <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY} />
</form>