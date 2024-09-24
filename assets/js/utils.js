export const pokeApi = (link) => `https://pokeapi.co/api/v2/${link}`;

export const storageContent = {
    page_alert_status: open,
    page_lang: "",
    page_themes: [],
    theme_saved: {},
    page_view_count: 0,
    saved_pokemon: [],
};
export const itemToSave = {
    id: "",
    name: "",
    sprites: {
        default: "",
        art: "",
    },
    date: "",
    types: {
        es: "",
        en: "",
    },
};

export const pokeTypesData = [
    {
        name: { es: "obscuro", en: "dark" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Obscuro</title><path class="cls-1" d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z" /></svg>',
    },
    {
        name: { es: "agua", en: "water" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Agua</title><path class="cls-1" d="M12 3.1L7.05 8.05a7 7 0 1 0 9.9 0L12 3.1zm0-2.828l6.364 6.364a9 9 0 1 1-12.728 0L12 .272z" /></svg>',
    },
    {
        name: { es: "fuego", en: "fire" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Fuego</title><path class="cls-1" d="M12 23a7.5 7.5 0 0 0 7.5-7.5c0-.866-.23-1.697-.5-2.47-1.667 1.647-2.933 2.47-3.8 2.47 3.995-7 1.8-10-4.2-14 .5 5-2.796 7.274-4.138 8.537A7.5 7.5 0 0 0 12 23zm.71-17.765c3.241 2.75 3.257 4.887.753 9.274-.761 1.333.202 2.991 1.737 2.991.688 0 1.384-.2 2.119-.595a5.5 5.5 0 1 1-9.087-5.412c.126-.118.765-.685.793-.71.424-.38.773-.717 1.118-1.086 1.23-1.318 2.114-2.78 2.566-4.462z"/></svg>',
    },
    {
        name: { es: "hierba", en: "grass" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Hierba</title><path class="cls-1" d="M6 3c3.49 0 6.383 2.554 6.913 5.895C14.088 7.724 15.71 7 17.5 7H22v2.5c0 3.59-2.91 6.5-6.5 6.5H13v5h-2v-8H9c-3.866 0-7-3.134-7-7V3h4zm14 6h-2.5c-2.485 0-4.5 2.015-4.5 4.5v.5h2.5c2.485 0 4.5-2.015 4.5-4.5V9zM6 5H4v1c0 2.761 2.239 5 5 5h2v-1c0-2.761-2.239-5-5-5z"/></svg>',
    },
    {
        name: { es: "normal", en: "normal" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Normal</title><path class="cls-1" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0z" /></svg>',
    },
    {
        name: { es: "fantasma", en: "ghost" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Fantasma</title><path class="cls-1" d="M12 2a9 9 0 0 1 9 9v7.5a3.5 3.5 0 0 1-6.39 1.976 2.999 2.999 0 0 1-5.223 0 3.5 3.5 0 0 1-6.382-1.783L3 18.499V11a9 9 0 0 1 9-9zm0 2a7 7 0 0 0-6.996 6.76L5 11v7.446l.002.138a1.5 1.5 0 0 0 2.645.88l.088-.116a2 2 0 0 1 3.393.142.999.999 0 0 0 1.74.003 2 2 0 0 1 3.296-.278l.097.13a1.5 1.5 0 0 0 2.733-.701L19 18.5V11a7 7 0 0 0-7-7zm0 8c1.105 0 2 1.12 2 2.5s-.895 2.5-2 2.5-2-1.12-2-2.5.895-2.5 2-2.5zM9.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>',
    },
    {
        name: { es: "psíquico", en: "psychic" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Psyquico</title><path class="cls-1" d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>',
    },
    {
        name: { es: "hada", en: "fairy" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Hada</title><path class="cls-1" d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6zm-6 6a8 8 0 0 0 8 8 8.006 8.006 0 0 0 6.957-4.045c-.316.03-.636.045-.957.045-5.523 0-10-4.477-10-10 0-.321.015-.64.045-.957A8.006 8.006 0 0 0 4 12zm14.164-9.709L19 2.5v1l-.836.209a2 2 0 0 0-1.455 1.455L16.5 6h-1l-.209-.836a2 2 0 0 0-1.455-1.455L13 3.5v-1l.836-.209A2 2 0 0 0 15.29.836L15.5 0h1l.209.836a2 2 0 0 0 1.455 1.455zm5 5L24 7.5v1l-.836.209a2 2 0 0 0-1.455 1.455L21.5 11h-1l-.209-.836a2 2 0 0 0-1.455-1.455L18 8.5v-1l.836-.209a2 2 0 0 0 1.455-1.455L20.5 5h1l.209.836a2 2 0 0 0 1.455 1.455z"/></svg>',
    },
    {
        name: { es: "electrico", en: "electric" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Electrico</title><path class="cls-1" d="M13 9h8L11 24v-9H4l9-15v9zm-2 2V7.22L7.532 13H13v4.394L17.263 11H11z" /></svg>',
    },
    {
        name: { es: "volador", en: "flying" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Volador</title><path class="cls-1" d="M10.5 17H4v-2h6.5a3.5 3.5 0 1 1-3.278 4.73l1.873-.703A1.5 1.5 0 1 0 10.5 17zM5 11h13.5a3.5 3.5 0 1 1-3.278 4.73l1.873-.703A1.5 1.5 0 1 0 18.5 13H5a3 3 0 0 1 0-6h8.5a1.5 1.5 0 1 0-1.405-2.027l-1.873-.702A3.501 3.501 0 0 1 17 5.5 3.5 3.5 0 0 1 13.5 9H5a1 1 0 1 0 0 2z"/></svg>',
    },
    {
        name: { es: "hielo", en: "ice" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Hielo</title><path class="cls-1" d="M13 16.268l1.964-1.134 1 1.732L14 18l1.964 1.134-1 1.732L13 19.732V22h-2v-2.268l-1.964 1.134-1-1.732L10 18l-1.964-1.134 1-1.732L11 16.268V14h2v2.268zM17 18v-2h.5a3.5 3.5 0 1 0-2.5-5.95V10a6 6 0 1 0-8 5.659v2.089a8 8 0 1 1 9.458-10.65A5.5 5.5 0 1 1 17.5 18l-.5.001z"/></svg>',
    },
    {
        name: { es: "veneno", en: "poison" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Veneno</title><path class="cls-1" d="M16 2v2h-1v3.243c0 1.158.251 2.301.736 3.352l4.282 9.276c.347.753.018 1.644-.734 1.99-.197.092-.411.139-.628.139H5.344c-.828 0-1.5-.672-1.5-1.5 0-.217.047-.432.138-.629l4.282-9.276C8.749 9.545 9 8.401 9 7.243V4H8V2h8zm-2.612 8.001h-2.776c-.104.363-.23.721-.374 1.071l-.158.361L6.125 20h11.749l-3.954-8.567c-.214-.464-.392-.943-.532-1.432zM11 7.243c0 .253-.01.506-.029.758h2.058c-.01-.121-.016-.242-.021-.364L13 7.243V4h-2v3.243z"/></svg>',
    },
    {
        name: { es: "peleador", en: "fighting" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Pelea</title><path class="cls-1" d="M16.5 2A5.5 5.5 0 0 1 22 7.5V10c0 .888-.386 1.686-1 2.235V17a3.001 3.001 0 0 1-2 2.829V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1.17A3.001 3.001 0 0 1 3 17V6a4 4 0 0 1 4-4h9.5zm-7 9H5v6a1 1 0 0 0 .883.993L6 18h12a1 1 0 0 0 .993-.883L19 17v-4h-6.036A3.5 3.5 0 0 1 9.5 16H6v-2h3.5a1.5 1.5 0 0 0 1.493-1.356L11 12.5a1.5 1.5 0 0 0-1.356-1.493L9.5 11zm7-7H7a2 2 0 0 0-1.995 1.85L5 6v3h4.5a3.5 3.5 0 0 1 3.163 2H19a1 1 0 0 0 .993-.883L20 10V7.5a3.5 3.5 0 0 0-3.308-3.495L16.5 4z"/></svg>',
    },
    {
        name: { es: "roca", en: "rock" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Piedra</title><path class="cls-1" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>',
    },
    {
        name: { es: "tierra", en: "ground" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Piedra</title><path class="cls-1" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>',
    },
    {
        name: { es: "metal", en: "steel" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Metal</title><path class="cls-1" d="M10 10.111V1l11 6v14H3V7l7 3.111zm2-5.742v8.82l-7-3.111V19h14V8.187L12 4.37z" /></svg>',
    },
    {
        name: { es: "insecto", en: "bug" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tema Insecto</title><path class="cls-1" d="M10.562 4.148a7.03 7.03 0 0 1 2.876 0l1.683-1.684 1.415 1.415-1.05 1.05A7.03 7.03 0 0 1 18.326 8H21v2h-2.07c.046.327.07.66.07 1v1h2v2h-2v1c0 .34-.024.673-.07 1H21v2h-2.674a7 7 0 0 1-12.652 0H3v-2h2.07A7.06 7.06 0 0 1 5 15v-1H3v-2h2v-1c0-.34.024-.673.07-1H3V8h2.674a7.03 7.03 0 0 1 2.84-3.072l-1.05-1.05L8.88 2.465l1.683 1.684zM12 6a5 5 0 0 0-5 5v4a5 5 0 0 0 10 0v-4a5 5 0 0 0-5-5zm-3 8h6v2H9v-2zm0-4h6v2H9v-2z"/></svg>',
    },
    {
        name: { es: "dragon", en: "dragon" },
        svg: '<svg class="icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M12 2C17.5228 2 22 6.47715 22 12V15.7639C22 16.5215 21.572 17.214 20.8944 17.5528L18 19V20C18 21.5977 16.7511 22.9037 15.1763 22.9949L14.9499 23.0004C14.9718 22.8926 14.9868 22.7823 14.9943 22.67L15 22.5V22C15 20.9456 14.1841 20.0818 13.1493 20.0055L13 20H11C9.94564 20 9.08183 20.8159 9.00549 21.8507L9 22V22.5C9 22.6714 9.01725 22.8387 9.0501 23.0004L9 23C7.34315 23 6 21.6569 6 20V19L3.10557 17.5528C2.428 17.214 2 16.5215 2 15.7639V12C2 6.47715 6.47715 2 12 2ZM12 4C7.66509 4 4.13546 7.44784 4.00381 11.7508L4 12V15.7639L8 17.7639V19.355L8.07537 19.2711C8.76418 18.5335 9.72777 18.0584 10.7981 18.005L11 18L13.0735 18.0013L13.2964 18.0109C14.2947 18.0846 15.1868 18.5219 15.8452 19.1884L16 19.355V17.7639L20 15.7639V12C20 7.58172 16.4183 4 12 4ZM8 11C9.10457 11 10 11.8954 10 13C10 14.1046 9.10457 15 8 15C6.89543 15 6 14.1046 6 13C6 11.8954 6.89543 11 8 11ZM16 11C17.1046 11 18 11.8954 18 13C18 14.1046 17.1046 15 16 15C14.8954 15 14 14.1046 14 13C14 11.8954 14.8954 11 16 11Z"></path></svg>',
    },
];
export const pokeStatsData = [
    {
        value: "hp",
        es: "Salud",
        en: "Healt",
    },
    {
        value: "attack",
        en: "Attack",
        es: "Ataque",
    },
    {
        value: "defense",
        en: "Defense",
        es: "Defensa",
    },
    {
        value: "special-attack",
        en: "Special-Attack",
        es: "Ataque-Especial",
    },
    {
        value: "special-defense",
        en: "Special-Defense",
        es: "Defensa-Especial",
    },
    {
        value: "speed",
        es: "Velocidad",
        en: "Speed",
    },
];
export const pokeVersionsData = [
    {
        version: "red",
        en: "red",
        es: "rojo",
    },
    {
        version: "blue",
        en: "blue",
        es: "azul",
    },
    {
        version: "yellow",
        en: "yellow",
        es: "amarillo",
    },
    {
        version: "gold",
        en: "gold",
        es: "oro",
    },
    {
        version: "silver",
        en: "silver",
        es: "plata",
    },
    {
        version: "crystal",
        en: "crystal",
        es: "cristal",
    },
    {
        version: "ruby",
        en: "ruby",
        es: "rubí",
    },
    {
        version: "sapphire",
        en: "sapphire",
        es: "zafiro",
    },
    {
        version: "emerald",
        en: "emerald",
        es: "esmeralda",
    },
    {
        version: "firered",
        en: "firered",
        es: "rojo fuego",
    },
    {
        version: "leafgreen",
        en: "leafgreen",
        es: "verde hoja",
    },
    {
        version: "diamond",
        en: "diamond",
        es: "diamante",
    },
    {
        version: "pearl",
        en: "pearl",
        es: "perla",
    },
    {
        version: "platinum",
        en: "platinum",
        es: "platino",
    },
    {
        version: "heartgold",
        en: "heartgold",
        es: "oro heartgold",
    },
    {
        version: "soulsilver",
        en: "soulsilver",
        es: "plata soulsilver",
    },
    {
        version: "black",
        en: "black",
        es: "negro",
    },
    {
        version: "white",
        en: "white",
        es: "blanco",
    },
    {
        version: "colosseum",
        en: "colosseum",
        es: "colosseum",
    },
    {
        version: "xd",
        en: "xd",
        es: "xd",
    },
];
export const daysOfTheWeek = [
    {
        es: "Domingo",
        en: "Sunday",
    },
    {
        es: "Lunes",
        en: "Monday",
    },
    {
        es: "Martes",
        en: "Tuesday",
    },
    {
        es: "Miercoles",
        en: "Wednesday",
    },
    {
        es: "Jueves",
        en: "Thursday",
    },
    {
        es: "Viernes",
        en: "Friday",
    },
    {
        es: "Sabado",
        en: "Saturday",
    },
];
export const monthsOfTheYear = [
    {
        es: "Enero",
        en: "January",
    },
    {
        es: "Febrero",
        en: "February",
    },
    {
        es: "Marzo",
        en: "March",
    },
    {
        es: "Abril",
        en: "April",
    },
    {
        es: "Mayo",
        en: "May",
    },
    {
        es: "Junio",
        en: "June",
    },
    {
        es: "Julio",
        en: "July",
    },
    {
        es: "Agosto",
        en: "August",
    },
    {
        es: "Septiembre",
        en: "September",
    },
    {
        es: "Octubre",
        en: "October",
    },
    {
        es: "Novienbre",
        en: "November",
    },
    {
        es: "Diciembre",
        en: "December",
    },
];
export const evoChainItem = {
    id: "",
    name: "",
    types: {
        es: "" || [],
        en: "" || [],
    },
    img: "",
};
export const feetsInMeter = 3.281;
export const inchesInMeters = 39.37007874;
export const lbsInKg = 2.20462262185;
export const dbName = "pokedex_storage";
export const storageThemes = "page_themes";
export const storageThemeSaved = "theme_saved";
export const personalizedT = "personalized_theme";
export const es = "es";
export const en = "en";

export const metric = "metric";
export const imperial = "imperial";
