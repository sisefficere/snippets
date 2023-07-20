<script>
    export let message = ""
</script>

<p class="text-center p-5 bg-white rounded-md border-quarta border-2 text-black">
    <span class="text-quarta font-bold">{message}</span><br
    />{message === "Realize a verificação abaixo." ? "" : "Volte mais tarde ou atualize a página."}
</p>