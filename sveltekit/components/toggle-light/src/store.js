import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const valorPadrao = 'light';
const valorInicial = browser ? window.localStorage.getItem('theme') ?? valorPadrao : valorPadrao;
const tema = writable(valorInicial);

tema.subscribe((valor) => {
    if (browser) {
        window.localStorage.setItem('theme', valor);
    }
});

export default tema;