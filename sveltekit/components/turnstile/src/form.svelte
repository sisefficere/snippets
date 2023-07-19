<script>
    import { Turnstile } from 'svelte-turnstile';
</script>

<form action="">
    <!-- campos -->
    <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}/>
</form>