
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
            required
            bind:value={$form.nome}
        />
        {#if $errors.nome}
            <span class="text-sm text-vermelho">{$errors.nome}</span>
        {/if}
    </label>
    <label class="flex flex-col gap-1 w-full">
        <input
            type="tel"
            name="telefone"
            required
            bind:value={$form.telefone}
        />
        {#if $errors.telefone}
            <span class="text-sm text-vermelho">{$errors.telefone}</span>
        {/if}
    </label>
    <button type="submit" class="nlf-botao nlf-botao-submit mt-3 self-center"
        >Enviar</button
    >
    {#if $message}
        <p class="text-center p-5 dark:bg-branco rounded-md border-vermelho border-2">
            <span class="text-vermelho font-bold">{$message}</span><br
            />{$message === "Realize a verificação abaixo." ? "" : "Tente novamente mais tarde ou atualize a página."}
        </p>
    {/if}
    <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY} />
</form>