<script>
    import tema from "./store"
    import { browser } from "$app/environment";

    export let classesBotao="", iconClasses=""

    if (browser) {
        if ($tema === "light") {
            tema.set("light");
            document.documentElement.classList.remove("dark");
        } else {
            tema.set("dark");
            document.documentElement.classList.add("dark");
        }
    }
    function alternaLuz() {
        if ($tema === "light") {
            document.documentElement.classList.add("dark");
            tema.set("dark");
        } else {
            document.documentElement.classList.remove("dark");
            tema.set("light");
        }
    }
</script>

<button on:click={alternaLuz} class="{classesBotao}">
    <svg viewBox="0 0 20 20" class="{iconClasses}">
        <path
            d="M7 13.33a7 7 0 1 1 6 0V16H7v-2.67zM7 17h6v1.5c0 .83-.67 1.5-1.5 1.5h-3A1.5 1.5 0 0 1 7 18.5V17zm2-5.1V14h2v-2.1a5 5 0 1 0-2 0z" />
    </svg>
</button>