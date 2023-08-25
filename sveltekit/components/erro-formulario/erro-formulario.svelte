<script>
    export let message = "", sucesso=false, mensagemSucesso=""
</script>

<p class="text-center p-5 bg-[white] rounded-md {sucesso ? 'border-[#0CBE42]' : 'border-[red]'} border-2 text-black">
    <span class="{sucesso ? 'text-[#0CBE42]' : 'text-[red]'} font-bold">{message}</span><br
    />
    {@html sucesso ? `${mensagemSucesso}` : message === "Realize a verificação abaixo." ? "" : "Volte mais tarde ou atualize a página."}
</p>