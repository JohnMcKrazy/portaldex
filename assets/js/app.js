const $d = document;
import { pokeApi, pokeTypesData, emptyType, storageContent, feetsInMeter, inchesInMeters, lbsInKg, dbName, es, en, metric, imperial } from "./utils.js";
import { raw } from "./raw.js";
const selector = (tag, container = $d) => container.querySelector(`${tag}`);
const selectorAll = (tag, container = $d) => container.querySelectorAll(`${tag}`);

//!  PAGE ITEMS //
const BODY = selector("body");
let storagePokedex = {};

let currentLang = es;
let audioActive = true;

let currentMeasurmentSystem = metric;
let itsFirstPokeSearch = true;

let currentPokeFlavors = {};
let currentPokemon = 1;
let currentSelection = currentPokemon;

//! AUDIO FUNCTION //
const pokeAudio = selector("[poke-sound]");
pokeAudio.volume = 0.35;

const playAudio = (link) => {
    pokeAudio.src = link;
    console.log("the audio is on:" + audioActive);
    pokeAudio.play();
    if (audioActive) {
        pokeAudio.muted = false;
        pokeAudio.play();
        console.log("Audio Playing...");
    } else {
        pokeAudio.muted = true;
        console.log("Audio Muted");
    }
};
//! UTILS FUNCTIONS //

const toThetop = () => window.scrollTo({ top: 0, behavior: `smooth` });
const freezPage = () => {
    BODY.style.position = "fixed";
    BODY.style.top = `-${window.scrollY}px`;
};

const sanitizeInput = (inputValue) => {
    const div = document.createElement("div");
    div.textContent = inputValue.trim();
    return div.innerHTML;
};
const convertDecimals = (convNum) => {
    return Math.round(convNum * 1e12) / 1e12;
};
const deleteChildElements = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};
const properCase = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
};
const fetchFunc = async (url) => {
    try {
        const fetching = await fetch(url);
        if (!fetching) throw error;
        return fetching.json();
    } catch (error) {
        console.log(error);
    }
};
const sortDataDecent = (list, tag) => {
    list.sort((a, b) => {
        if (a[tag] > b[tag]) {
            return 1;
        }

        if (a[tag] < b[tag]) {
            return -1;
        }
    });
};
const sortDataAcent = (list, tag) => {
    list.sort((a, b) => {
        if (a[tag] > b[tag]) {
            return 1;
        }

        if (a[tag] < b[tag]) {
            return -1;
        }
    });
};

//! ITEMS RECOVERY CLASSES CONSTRUCTORS //
const create = "create";
const set = "set";
const getPokeData = async (ref) => {
    const formatText = (text) => text.replace("\f", "\n").replace("\u00ad\n", "").replace("\u00ad", "").replace(" -\n", " - ").replace("-\n", "-").replace("\n", " ");
    console.log("Creando nueva busqueda");
    let data;
    console.log(typeof ref);
    const thisLink = pokeApi(`pokemon/${ref}`);
    console.log(thisLink);
    data = await fetchFunc(thisLink);
    console.log(data);
    const speciesData = await fetchFunc(data.species.url);
    console.log(speciesData);
    let habitatNameEn;
    let habitatNameEs;
    const speciesDataEnNameSearch = speciesData.names.find((item) => item.language.name === en);
    let speciesDataEsNameSearch = speciesData.names.find((item) => item.language.name === es);
    if (!speciesDataEsNameSearch) speciesDataEsNameSearch = speciesDataEnNameSearch;

    let flavorEs = speciesData.flavor_text_entries.find((item) => item.language.name === es);
    if (!flavorEs) flavorEs = speciesData.flavor_text_entries.find((item) => item.language.name === en);
    //! ABILITIES DATA
    const abilitiesData = [];
    for (let abilityStep = 0; abilityStep < data.abilities.length; abilityStep++) {
        console.log(data.abilities[abilityStep]);
        const thisAbility = await fetchFunc(data.abilities[abilityStep].ability.url);
        console.log(thisAbility);
        const abilityEnName = thisAbility.names.find((item) => item.language.name === en);
        let abilityEsName = thisAbility.names.find((item) => item.language.name === es);
        if (!abilityEsName) abilityEsName = abilityEnName;
        const abilityEnFlavor = thisAbility.flavor_text_entries.find((item) => item.language.name === en);
        let abilityEsFlavor = thisAbility.flavor_text_entries.find((item) => item.language.name === es);
        if (!abilityEsFlavor) abilityEsFlavor = abilityEnFlavor;
        const abilityItem = {
            id: thisAbility.id,
            name: thisAbility.name.toLowerCase(),
            names: { es: abilityEsName.name.toLowerCase(), en: abilityEnName.name.toLowerCase() },
            flavor: {
                es: formatText(abilityEsFlavor.flavor_text),
                en: formatText(abilityEnFlavor.flavor_text),
            },
        };
        abilitiesData.push(abilityItem);
        if (!storagePokedex.recovery.abilities.find((item) => item.name === thisAbility.name)) storagePokedex.recovery.abilities.push(abilityItem);
    }
    //! MOVES DATA
    for (let movesStep = 0; movesStep < data.moves.length; movesStep++) {
        if (!storagePokedex.recovery.moves.find((item) => item.name === data.moves[movesStep].move.name)) {
            let thisMove = await fetchFunc(data.moves[movesStep].move.url);
            console.log(thisMove);
            let moveStorage = storagePokedex.recovery.moves[thisMove.name];

            if (!moveStorage) {
                const moveEnName = thisMove.names.find((moveNameItem) => moveNameItem.language.name === en);
                let moveEsName = thisMove.names.find((moveNameItem) => moveNameItem.language.name === es);
                if (!moveEsName) moveEsName = moveEnName;
                storagePokedex.recovery.moves[thisMove.name] = {
                    id: thisMove.id,
                    name: thisMove.name.toLowerCase(),
                    es: moveEsName.name.toLowerCase(),
                    en: moveEnName.name.toLowerCase(),
                };
            }
        }
    }
    //! ITEM DATA
    /* for (let itemsStep = 0; itemsStep < data.held_items.length; itemsStep++) {
        console.log(data.held_items[itemsStep]);
        const itemHeldData = await fetchFunc(data.held_items[itemsStep].item.url);
        console.log(itemHeldData);
        if (!storagePokedex.recovery.items[itemHeldData.name]) {
            console.log(itemHeldData);
            console.log("item held " + data.held_items[itemsStep].item.name);
            console.log(itemHeldData.sprites);
            storagePokedex.recovery.items.push({
                id: itemHeldData.id,
                name: itemHeldData.name,
                sprite: itemHeldData.sprites,
            });
        }
    } */
    //! VARIETIES DATA
    const varietiesList = [];
    for (let varietieStep = 0; varietieStep < speciesData.varieties.length; varietieStep++) {
        console.log(speciesData.varieties[varietieStep]);
        const varietyData = await fetchFunc(speciesData.varieties[varietieStep].pokemon.url);

        console.log(varietyData);
        varietiesList.push({
            name: varietyData.name,
            id: varietyData.id,
        });
    }

    if (!speciesData.habitat) {
        habitatNameEn = "unknown";
        habitatNameEs = "desconocido";
    } else {
        const habitatData = await fetchFunc(speciesData.habitat.url);

        habitatNameEn = habitatData.names.find((item) => item.language.name === en).name;
        habitatNameEs = habitatData.names.find((item) => item.language.name === es).name;
        if (!habitatNameEs) habitatNameEs = habitatNameEn;
    }
    const evoData = [];
    console.log(speciesData.evolution_chain);
    const evoChainData = await fetchFunc(speciesData.evolution_chain.url);
    const pushData = async (pokeData) => {
        const thisEvoPoke = await fetchFunc(pokeData.species.url);

        console.log(pokeData);
        console.log(thisEvoPoke);

        evoData.push({
            name: thisEvoPoke.name,
            id: thisEvoPoke.id,
            evo_details: pokeData.evolution_details,
        });
        const thisEvoData = pokeData.evolves_to;
        if (thisEvoData.length > 0) {
            for (let step = 0; step < thisEvoData.length; step++) {
                await pushData(thisEvoData[step]);
            }
        }
    };
    await pushData(evoChainData.chain);

    storagePokedex.recovery.pokemon.push({
        id: data.id,
        name: data.name.toLowerCase(),
        sprites: {
            artwork_default: data.sprites.other["official-artwork"]["front_default"],
            artwork_shiny: data.sprites.other["official-artwork"]["front_shiny"],
            game_default: data.sprites.front_default,
            game_shiny: data.sprites.front_shiny,
        },
        types: data.types.map((typeItem) => typeItem.type.name),
        cries: data.cries.latest,
        weight: data.weight,
        height: data.height,
        base_experience: data.base_experience,
        flavor: {
            es: formatText(flavorEs.flavor_text),
            en: formatText(speciesData.flavor_text_entries.find((flavorText) => flavorText.language.name === en).flavor_text),
        },
        stats: data.stats.map((statItem) => ({
            name: statItem.stat.name,
            base_stat: statItem.base_stat,
            effort: statItem.effort,
        })),
        abilities: abilitiesData,
        moves: data.moves.map((item) => item.move.name),
        base_happiness: speciesData.base_happiness,
        color: speciesData.color.name,
        habitat: { en: habitatNameEn, es: habitatNameEs },
        is_baby: speciesData.is_baby,
        is_legendary: speciesData.is_legendary,
        is_mythical: speciesData.is_mythical,
        has_male: storagePokedex.recovery.genders.find((item) => item.name === "male").species.includes(speciesData.name),
        has_female: storagePokedex.recovery.genders.find((item) => item.name === "female").species.includes(speciesData.name),
        is_genderless: storagePokedex.recovery.genders.find((item) => item.name === "genderless").species.includes(speciesData.name),
        hes_gender_differences: speciesData.hes_gender_differences,
        varieties: {
            default: speciesData.varieties.find((item) => item.is_default === true).pokemon.name.toLowerCase(),
            list: varietiesList,
        },
        evolution_chain: evoData,
    });
    savePokedex();
};

//!! //
//! localStorage.removeItem("pokedex_storage");
const pillDataTemplate = selector("[pill-template]").content;

//! SPEECH FUNCTION //
const synth = window.speechSynthesis;

const speechFunction = (textToSpeech) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeech);
    synth.speak(utterance);
};
const details = selector(`[details]`);
const setDetails = async (tag, ref) => {
    const flag = "details";
    console.log(tag, ref);
    console.log(storagePokedex.recovery[tag]);
    const thisData = storagePokedex.recovery[tag].find((item) => ref === item.name);
    console.log(thisData);
    //!  //
    const detailsTitle = selector(`[${flag}-title]`);
    const detailsText = selector(`[${flag}-text]`, selector(`[${flag}-window="${tag}"]`));

    const window = selector(`[${flag}-window="${tag}"]`);
    selectorAll(`[${flag}-window]`).forEach((window) => {
        window.setAttribute("details-window-active", false);
        window.setAttribute("hidden", true);
    });

    detailsTitle.setAttribute(en, thisData.names.en);
    detailsTitle.setAttribute(es, thisData.names.es);
    detailsTitle.textContent = thisData.names[currentLang];
    switch (tag) {
        case "types":
            const detailsType = selector("[details-type]");
            const detailStrongAttackTypes = selector("[details-strong-attack-types]");
            const detailStrongDefenceTypes = selector("[details-strong-defence-types]");
            const detailWeakAttackTypes = selector("[details-weak-attack-types]");
            const detailWeakDefenceTypes = selector("[details-weak-defence-types]");
            const detailInmuneAttackTypes = selector("[details-immune-attack-types]");
            const detailInmuneDefenceTypes = selector("[details-immune-defence-types]");
            deleteChildElements(detailsType);
            deleteChildElements(detailStrongAttackTypes);
            deleteChildElements(detailStrongDefenceTypes);
            deleteChildElements(detailWeakAttackTypes);
            deleteChildElements(detailWeakDefenceTypes);
            deleteChildElements(detailInmuneAttackTypes);
            deleteChildElements(detailInmuneDefenceTypes);
            createTypePill(
                pokeTypesData.find((item) => item.name === thisData.name),
                detailsType
            );
            const setTypePills = (list, container) => {
                if (thisData[list].length >= 1) {
                    for (let step = 0; step < thisData[list].length; step++) {
                        createTypePill(
                            pokeTypesData.find((item) => item.name === thisData[list][step]),
                            container
                        );
                    }
                } else {
                    createTypePill(emptyType, container);
                }
            };
            setTypePills("strong_attack", detailStrongAttackTypes);
            setTypePills("weak_attack", detailWeakAttackTypes);
            setTypePills("immune_attack", detailInmuneAttackTypes);
            setTypePills("strong_defence", detailStrongDefenceTypes);
            setTypePills("weak_defence", detailWeakDefenceTypes);
            setTypePills("immune_defence", detailInmuneDefenceTypes);
            break;
        case "moves":
        case "abilities":
            detailsText.setAttribute(es, thisData.flavor[es]);
            detailsText.setAttribute(en, thisData.flavor[en]);
            detailsText.textContent = thisData.flavor[currentLang];

            break;
    }

    freezPage();
    details.showModal();
    details.setAttribute(`${flag}-active`, true);
    window.setAttribute("details-window-active", true);
    window.setAttribute("hidden", false);

    //!  //
};
const createTypePill = (data, container) => {
    console.log(data);
    const newPillClone = pillDataTemplate.cloneNode(true);
    const newPill = selector("[pill-template]", newPillClone);
    const btnPill = selector("[pill-btn]", newPillClone);
    const labelPill = selector("[label]", newPillClone);
    const iconPill = selector("[icon]", newPillClone);
    labelPill.setAttribute("es", data.names[es]);
    labelPill.setAttribute("en", data.names[en]);
    labelPill.textContent = data.names[currentLang];
    btnPill.classList.add("type_pill");
    btnPill.setAttribute("color-scheme", data.name);
    iconPill.insertAdjacentHTML("afterbegin", data.svg);
    if (data.name !== "none") btnPill.addEventListener("click", () => setDetails("types", data.name));
    container.appendChild(newPill);
};
const createPill = (data, container, type) => {
    console.log(data);
    const newPillClone = pillDataTemplate.cloneNode(true);
    const newPill = selector("[pill-template]", newPillClone);
    const btnPill = selector("[pill-btn]", newPill);

    const labelPill = selector("[label]", newPill);
    selector("[icon]", newPill).remove();

    labelPill.setAttribute("es", data.names.es);
    labelPill.setAttribute("en", data.names.en);
    labelPill.textContent = labelPill.getAttribute(currentLang);
    btnPill.addEventListener("click", () => setDetails(type, data.name));
    container.appendChild(newPill);
};
const activePokeIconStat = (typeIcon) => {
    const thisIcons = selectorAll(`[poke-icon='${typeIcon}']`);
    thisIcons.forEach((icon) => {
        icon.setAttribute("hidden", false);
        icon.setAttribute("active", true);
    });
};
let imgType = "default";
const createBasicCard = async (item, container) => {
    const newClone = cardBtnTemplate.cloneNode(true);
    const newItem = selector("[card-item]", newClone);
    const card = selector("[card-btn]", newItem);
    const cardImg = selector("[card-img]", newItem);
    const cardId = selector("[card-id]", newItem);
    const cardText = selector("[card-text]", newItem);
    const cardTypes = selector("[card-types]", newItem);
    cardText.textContent = item.name;
    cardId.textContent = item.id;
    cardImg.src = item.sprites.artwork_default;
    const cardIdData = item.id;

    item.types.forEach((itemType) => {
        createTypePill(
            pokeTypesData.find((item) => item.name === itemType),
            cardTypes
        );
    });
    card.addEventListener("click", async () => {
        await setPokeData(item);
        closeModal("modal");
    });
    if (item.id === currentSelection) card.disabled = "disable";
    container.appendChild(newItem);
    return [card, cardIdData];
};
//! STORAGE FUNCTIONS FUNCTION //
const savePokedex = () => localStorage.setItem(dbName, JSON.stringify(storagePokedex));
//!SET DEFAULT THEME BTNS //
const cardBtnTemplate = selector("[card-template]").content;
const createThemeBtns = () => {
    pokeTypesData.forEach((theme) => {
        const newClone = cardBtnTemplate.cloneNode(true);
        const newItem = selector("[card-item]", newClone);
        const card = selector("[card-btn]", newItem);
        const cardContent = selector("[card-content]", newItem);
        const cardSelector = selector("[card-selector]", newItem);
        const cardImg = selector("[card-img]", newItem);
        const cardId = selector("[id-placeholder]", newItem);
        const cardText = selector("[card-text]", newItem);
        const cardTypes = selector("[card-types]", newItem);

        cardSelector.remove();
        cardId.remove();
        cardTypes.remove();
        cardText.setAttribute("es", theme.names[es]);
        cardText.setAttribute("en", theme.names[en]);
        cardText.textContent = theme.names[currentLang];
        cardImg.src = `./assets/images/pokemon/${theme.name}.png`;
        cardContent.setAttribute("color-scheme", theme.name);
        card.addEventListener("click", () => BODY.setAttribute("color-scheme", theme.name));
        selector("[default-themes]").appendChild(newItem);
    });
};
//! SET BASIC DATA IN PAGE //
const setMeasurementData = (measurmentType) => {
    measurementBtn.setAttribute("current-system", measurmentType);
    measurementLabels.forEach((label) => {
        label.textContent = measurementData[measurmentType][currentLang];
        label.setAttribute(es, measurementData[measurmentType][es]);
        label.setAttribute(en, measurementData[measurmentType][en]);
    });
    selectorAll("[poke-measurement]").forEach((measurement) => (measurement.textContent = measurement.getAttribute(`value-${measurmentType}`)));
};
const checkStorageAnswer = () => {
    storagePokedex = JSON.parse(localStorage.getItem(dbName));
    if (!storagePokedex) {
        storagePokedex = storageContent;
        console.log("local storage item is created");
        if (window.navigator.language === "es" || (window.navigator.language[0] === "e" && window.navigator.language[1] === "s" && window.navigator.language[2] === "-")) {
            console.log("'es' lang new");
            storagePokedex.lang = es;
        } else {
            console.log("No 'es' lang new");
            storagePokedex.lang = en;
        }
        currentLang = storagePokedex.lang;
        localStorage.setItem(dbName, JSON.stringify(storagePokedex));
    } else {
        console.log("Ya existe extorage");
        currentLang = storagePokedex.lang;
        currentMeasurmentSystem = storagePokedex.measurment_system;
        const soundState = storagePokedex.sound;
        audioActive = soundState;
        selectorAll("[icon='sound']").forEach((icon) => icon.setAttribute("hidden", icon.getAttribute("hidden", true)));
        selectorAll("[icon-true]").forEach((icon) => icon.setAttribute("hidden", soundState));
        selectorAll("[icon-false]").forEach((icon) => icon.setAttribute("hidden", !soundState));
        setMeasurementData(currentMeasurmentSystem);
    }
    selectorAll("[change]").forEach((item) => (item.textContent = item.getAttribute(currentLang)));
    console.log(storagePokedex);
};
//! FETCH GENERAL DATA //

const pokeImg = selector("[poke-img]");
const pokeIcons = selectorAll("[poke-icon]");
const pokeNames = selectorAll("[poke-name]");
const pokeId = selector("[poke-id]");
const pokePillsContainer = selector("[poke-types]");
const pokeDescriptionHabitat = selector("[poke-habitat]");
const pokeDescriptionWeight = selector("[poke-weight]");
const pokeDescriptionHeight = selector("[poke-height]");

const evoCardsContainer = selector("[evo-cards]");
const varietieCardsContainer = selector("[varietie-cards]");
const abilitiesContainer = selector("[poke-abilities]");
const evoDetails = selector("[evo-details]");
const evoDetailsContainer = selector("[evo-details-container]");
const generalPokeCards = selector("[general-cards-container]");
let currentEvoChain = "";
const timeOfDay = selector("[time_of_day]");
const minHappiness = selector("[min_happiness]");

const flavor = selector("[poke-flavor]");

const setPokeData = async (item) => {
    deleteChildElements(evoCardsContainer);
    deleteChildElements(varietieCardsContainer);
    deleteChildElements(evoDetailsContainer);
    deleteChildElements(pokePillsContainer);
    deleteChildElements(abilitiesContainer);
    if (itsFirstPokeSearch) {
        pokeImg.classList.remove("animation_spin");
        itsFirstPokeSearch = false;
    }
    const currentPokemonData = item;
    const defaultData = storagePokedex.recovery.pokemon.find((item) => item.name === currentPokemonData.varieties.default);
    currentPokemon = defaultData.id;
    currentSelection = currentPokemonData.id;
    pokeIcons.forEach((icon) => {
        icon.setAttribute("active", false);
        icon.setAttribute("hidden", true);
    });

    //! MEADURMENTS DATA//
    let metricPokeHeight = convertDecimals(currentPokemonData.height * 0.1);
    let metricPokeWeight = convertDecimals(currentPokemonData.weight * 0.1);

    let imperialHeightFeet = metricPokeHeight * feetsInMeter;
    let decimals = `.${imperialHeightFeet.toString().split(".")[1]}`;
    let imperialHeightInches = Math.round((decimals / feetsInMeter) * inchesInMeters).toString();
    let imperilPokeWeight = (metricPokeWeight * lbsInKg).toFixed(1);

    for (let step = 0; step < currentPokemonData.evolution_chain.length; step++) {
        if (!storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.evolution_chain[step].id)) {
            await getPokeData(currentPokemonData.evolution_chain[step].id, create, evoCardsContainer);
        }
        let thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.evolution_chain[step].id);
        while (!thisPokeData) {
            thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.evolution_chain[step].id);
        }
        await createBasicCard(thisPokeData, evoCardsContainer);
    }

    for (let step = 0; step < currentPokemonData.varieties.list.length; step++) {
        if (!storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.varieties.list[step].id)) {
            await getPokeData(currentPokemonData.varieties.list[step].id);
        }
        let thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.varieties.list[step].id);
        while (!thisPokeData) {
            thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemonData.varieties.list[step].id);
        }
        await createBasicCard(thisPokeData, varietieCardsContainer);
    }

    toThetop();
    const pokeDescriptionSpeech = `${currentPokemonData.name}, ${currentPokemonData.flavor[currentLang]}, ${currentLang === es ? "cuenta con un peso promedio de" : "has an average weight of"} ${
        currentMeasurmentSystem === metric ? metricPokeWeight + (currentLang === es ? " kilogramos " : " kilograms ") : imperilPokeWeight + (currentLang === es ? " libras" : "pounds")
    } ${currentLang === es ? "y una altura promedio de " : " an average height of "}${
        currentMeasurmentSystem === metric ? metricPokeHeight + (currentLang === es ? " metros de altura" : " height") : parseInt(imperialHeightFeet) + (currentLang === es ? " pies, con " : " foots, with ") + imperialHeightInches + (currentLang === es ? " pulgadas" : " inches")
    }`;
    //!SET PAGE DATA ASYNC
    pokeImg.src = currentPokemonData.sprites[`artwork_${imgType}`];
    pokeImg.setAttribute("defaul", currentPokemonData.sprites[`artwork_default`]);
    pokeImg.setAttribute("shiny", currentPokemonData.sprites[`artwork_shiny`]);
    pokeImg.setAttribute("alt", currentPokemonData.name);
    pokeNames.forEach((name) => (name.textContent = currentPokemonData.name));
    pokeId.textContent = currentPokemonData.id;
    /* if (audioActive) playAudio(currentPokemonData.cries); */
    //! PILLS DATAS DELETE
    for (let step = 0; step < currentPokemonData.types.length; step++) {
        createTypePill(
            pokeTypesData.find((item) => item.name === currentPokemonData.types[step]),
            pokePillsContainer
        );
    }

    //! BG DATA SEARCH
    selectorAll(`[bg-type]`).forEach((bg) => bg.setAttribute("hidden", true));
    selector(`[bg-type='${currentPokemonData.types[0]}']`).setAttribute("hidden", false);
    //! DESCRIPTION FLAVORS DATA//
    flavor.setAttribute("es", currentPokemonData.flavor.es);
    flavor.setAttribute("en", currentPokemonData.flavor.en);
    flavor.textContent = currentPokemonData.flavor[currentLang];

    //! HABITAT DATA//

    pokeDescriptionHabitat.setAttribute(es, currentPokemonData.habitat.es);
    pokeDescriptionHabitat.setAttribute(en, currentPokemonData.habitat.en);
    pokeDescriptionHabitat.textContent = pokeDescriptionHabitat.getAttribute(currentLang);

    pokeDescriptionHeight.setAttribute("value-metric", `${metricPokeHeight}m`);
    pokeDescriptionHeight.setAttribute("value-imperial", imperialHeightInches.length === 1 ? `${parseInt(imperialHeightFeet)}'0${imperialHeightInches}"` : `${parseInt(imperialHeightFeet)}'${imperialHeightInches}"`);

    pokeDescriptionWeight.setAttribute("value-metric", `${metricPokeWeight}Kg`);
    pokeDescriptionWeight.setAttribute("value-imperial", `${imperilPokeWeight}Lbs`);

    pokeDescriptionHeight.textContent = pokeDescriptionHeight.getAttribute(`value-${currentMeasurmentSystem}`);
    pokeDescriptionWeight.textContent = pokeDescriptionWeight.getAttribute(`value-${currentMeasurmentSystem}`);
    const gendersData = storagePokedex.recovery.genders;
    //! SPECIAL DATA//
    if (currentPokemonData.is_baby) activePokeIconStat("baby");
    if (currentPokemonData.is_legendary) activePokeIconStat("legendary");
    if (currentPokemonData.is_mythical) activePokeIconStat("mythical");
    if (!currentPokemonData.is_baby && !currentPokemonData.is_legendary && !currentPokemonData.is_mythical) activePokeIconStat("none");
    if (gendersData.find((item) => item.name === "male").species.includes(defaultData.name)) activePokeIconStat("female");
    if (gendersData.find((item) => item.name === "female").species.includes(defaultData.name)) activePokeIconStat("male");
    if (gendersData.find((item) => item.name === "genderless").species.includes(defaultData.name)) activePokeIconStat("genderless");

    for (let step = 0; step < currentPokemonData.abilities.length; step++) {
        console.log(currentPokemonData.abilities[step]);
        createPill(
            storagePokedex.recovery.abilities.find((item) => item.name === currentPokemonData.abilities[step].name),
            abilitiesContainer,
            "abilities"
        );
    }

    currentPokemonData.stats.forEach((stat) => {
        const thisItem = selector(`[poke-stat-item='${stat.name}']`);
        const extraPlaceholder = selector("[extra-value-placeholder]", thisItem);
        const extraValue = selector("[extra-value]", thisItem);
        const extraBar = selector("[stat-extra-bar]", thisItem);
        const itemPorcent = (extra = null) => `${((extra !== null ? stat.base_stat + extra : stat.base_stat) * 100) / 250}%`;
        if (stat.effort !== 0) {
            extraPlaceholder.setAttribute("show", true);
            extraValue.textContent = stat.effort;
            extraBar.style.width = itemPorcent(stat.effort);
        } else {
            extraPlaceholder.setAttribute("show", false);
            extraBar.style.width = itemPorcent();
        }
        selector("[stat-value]", thisItem).textContent = stat.base_stat;
        selector("[stat-bar]", thisItem).style.width = itemPorcent();
    });
    searchInput.value = "";

    setTimeout(() => {
        /* speechFunction(pokeDescriptionSpeech); */
    }, 2000);
};
const getGenderData = async () => {
    const data = await fetchFunc(pokeApi("gender"));

    for (let step = 0; step < data.results.length; step++) {
        if (!storagePokedex.recovery.genders.find((item) => item.name === data.results[step].name)) {
            const genderData = await fetchFunc(data.results[step].url);

            storagePokedex.recovery.genders.push({
                id: genderData.id,
                name: genderData.name,
                species: genderData.pokemon_species_details.map((specieItem) => specieItem.pokemon_species.name),
            });
            savePokedex();
        } else {
            /* console.log(`La data de genero ${data.results[step].name} ya se encuentra`); */
        }
    }
    console.log(storagePokedex.recovery);
};
const getTypesData = () => {
    const getData = async (link) => {
        const data = await fetchFunc(link);
        console.log(data);
        for (let step = 0; step < data.results.length; step++) {
            if (!storagePokedex.recovery.types.find((item) => item.name === data.results[step].name)) {
                let thisType = await fetchFunc(data.results[step].url);
                const typeNameEn = thisType.names.find((typeNameItem) => typeNameItem.language.name === en);
                let typeNameEs = thisType.names.find((typeNameItem) => typeNameItem.language.name === es);
                if (!typeNameEs) typeNameEs = typeNameEn;
                if (thisType.pokemon.length >= 1)
                    storagePokedex.recovery.types.push({
                        id: thisType.id,
                        name: thisType.name,
                        names: {
                            es: typeNameEs.name.toLowerCase(),
                            en: typeNameEn.name.toLowerCase(),
                        },
                        strong_attack: thisType.damage_relations.double_damage_to.map((damageItem) => damageItem.name),
                        weak_attack: thisType.damage_relations.half_damage_to.map((damageItem) => damageItem.name),
                        immune_attack: thisType.damage_relations.no_damage_to.map((damageItem) => damageItem.name),

                        strong_defence: thisType.damage_relations.half_damage_from.map((damageItem) => damageItem.name),
                        weak_defence: thisType.damage_relations.double_damage_from.map((damageItem) => damageItem.name),
                        immune_defence: thisType.damage_relations.no_damage_from.map((damageItem) => damageItem.name),

                        pokemon: thisType.pokemon.map((item) => item.pokemon.name),
                        moves: thisType.moves.map((item) => item.name),
                    });

                savePokedex();
            } else {
                /* console.log(`La data de tipo ${data.results[step].name} ya se encuentra`); */
            }
        }

        if (data.next !== null) {
            getData(data.next);
        }
    };

    getData(pokeApi("type"));
    console.log(storagePokedex.recovery);
};

let nextSearch = null;
const searchCards = async (link) => {
    const currentSearch = [];
    const data = await fetchFunc(link);
    console.log(data.next);
    nextSearch = data.next;
};
const closeModal = (ref) => {
    BODY.style = "";
    const dialog = selector(`[${ref}]`);
    dialog.setAttribute("modal-active", false);
    selectorAll(`[${ref}-window]`).forEach((window) => window.setAttribute("hidden", true));
    setTimeout(() => {
        dialog.close();
    }, 500);
};
//! FORM AND SEARCH BTN ACTIONS //
const searchForm = selector("[search-form]");
const searchInput = selector("[search-input]");
const searchBtn = selector("[poke-search-btn]");
const searchPokemon = async () => {
    console.log(`Buscando nuevo pokemon...`);
    const resp = sanitizeInput(searchInput.value.toLowerCase().trim());

    if (!storagePokedex.recovery.pokemon.find((item) => item.name === resp || item.id === parseInt(resp))) {
        await getPokeData(resp);
    }
    let thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.name === resp || item.id === parseInt(resp));
    while (!thisPokeData) {
        thisPokeData = storagePokedex.recovery.pokemon.find((item) => item.name === resp || item.id === parseInt(resp));
    }
    await setPokeData(thisPokeData);
    closeModal("modal");
};
const completeList = [];

searchInput.addEventListener("input", async (e) => {
    const search = e.target.value;

    let list;
    deleteChildElements(generalPokeCards);
    list = completeList.filter((pokeName) => pokeName.includes(search));
    /* for (let step = 0; step < list.length; step++) {
        if (!storagePokedex.recovery.pokemon.find((item) => item.name === list[step])) {
            await getPokeData(list[step]);
        }
        let thisItem = storagePokedex.recovery.pokemon.find((item) => item.name === list[step]);
        while (!thisItem) {
            thisItem = storagePokedex.recovery.pokemon.find((item) => item.name === list[step]);
            console.log(thisItem);
        }

        await createBasicCard(thisItem, generalPokeCards);
    } */

    console.log(search);
    console.log(completeList);
    console.log(list);
});
searchBtn.addEventListener("click", searchPokemon);
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchPokemon();
});
const changePokemonByPosition = async (btn) => {
    const ref = btn.getAttribute("position");
    if (itsFirstPokeSearch) {
        switch (ref) {
            case "next":
                currentPokemon = 1;
                break;
            case "previous":
                currentPokemon = 898;

                break;
        }
    } else {
        switch (ref) {
            case "next":
                if (currentPokemon >= 1 && currentPokemon <= 897) {
                    currentPokemon++;
                } else if (currentPokemon === 898) {
                    currentPokemon = 1;
                }
                break;

            case "previous":
                if (currentPokemon >= 2 && currentPokemon <= 898) {
                    currentPokemon--;
                } else if (currentPokemon === 1) {
                    currentPokemon = 898;
                }
                break;
        }
    }

    if (!storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemon)) {
        await getPokeData(currentPokemon);
    }
    let thisItem = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemon);
    while (!thisItem) {
        thisItem = storagePokedex.recovery.pokemon.find((item) => item.id === currentPokemon);
        console.log(thisItem);
    }
    await setPokeData(thisItem);
};
//! SOUND BTN ACTIIONS //
const changeSoundState = () => {
    selectorAll("[icon='sound']").forEach((icon) => {
        icon.setAttribute("hidden", icon.getAttribute("hidden") === "true" ? false : true);
    });
    audioActive = !audioActive;
    storagePokedex.sound = audioActive;
    savePokedex();
};
selectorAll("[action='sound']").forEach((btn) => btn.addEventListener("click", changeSoundState));
selector("[action='poke_sound_btn']").addEventListener("click", () => playAudio(pokeAudio.src));

//! LANG BTN ACTIIONS //
const changeLang = () => {
    currentLang = currentLang === es ? en : es;
    selectorAll("[change]").forEach((item) => {
        item.textContent = item.getAttribute(currentLang);
    });
    storagePokedex.lang = currentLang;
    savePokedex();
};
selectorAll("[action='lang']").forEach((btn) => btn.addEventListener("click", changeLang));
//! POSITION BTN ACTIONS //

selectorAll("[position]").forEach((btn) => btn.addEventListener("click", () => changePokemonByPosition(btn)));
selector("[action='top_btn']").addEventListener("click", toThetop);

//! MEASUREMENT ACTIONS //
const measurementLabels = selectorAll("[measurement-system]");
const measurementData = { metric: { en: "metric", es: "metrico" }, imperial: { en: "imperial", es: "imperial" } };
const measurementBtn = selector("[action='measurement_btn']");

const changeMeasurementSystem = () => {
    const value = measurementBtn.getAttribute("current-system");
    let newSystem;
    switch (value) {
        case metric:
            newSystem = imperial;
            break;
        case imperial:
            newSystem = metric;

            break;
    }

    setMeasurementData(newSystem);
    currentMeasurmentSystem = newSystem;
    storagePokedex.measurement_system = currentMeasurmentSystem;
    savePokedex();
};
measurementBtn.addEventListener("click", changeMeasurementSystem);
//! DIALOGS ACTIONS //
const dialogWindows = ["modal", "details"];
const modal = selector(`[modal]`);
selectorAll(`[modal-btn]`).forEach((btn) =>
    btn.addEventListener("click", () => {
        const dialogStatus = modal.getAttribute("modal-active");
        selectorAll(`[modal-window-btn]`).forEach((swiperBtn) => swiperBtn.setAttribute("btn-active", false));
        const currentBtn = btn.getAttribute(`modal-btn`);
        selector(`[modal-window-btn='${currentBtn}']`).setAttribute("btn-active", true);
        const dialogWindow = selector(`[modal-window='${currentBtn}']`);
        selector(`[close-btn]`, modal).setAttribute(`modal-btn`, currentBtn);
        if (dialogStatus === "false") {
            freezPage();
            modal.showModal();
            modal.setAttribute("modal-active", true);
            dialogWindow.setAttribute("hidden", false);
            setTimeout(() => dialogWindow.setAttribute("modal-active", true), 100);
        } else {
            BODY.style = "";
            modal.setAttribute("modal-active", false);
            selectorAll(`[modal-window]`).forEach((window) => window.setAttribute("hidden", true));
            setTimeout(() => {
                modal.close();
            }, 500);
        }
    })
);
selector(`[close-details]`).addEventListener("click", () => {
    console.log("cerrando");
    BODY.style = "";
    details.setAttribute("details-active", false);
    setTimeout(() => {
        details.close();
    }, 500);
});
//! SWIPERS ACTIONS //
let contentWindow = "info";
const swipersWindows = ["modal", "content"];
swipersWindows.forEach((swiper) => {
    selectorAll(`[${swiper}-window-btn]`).forEach((btn) =>
        btn.addEventListener("click", () => {
            let nextWindowRef = btn.getAttribute(`${swiper}-window-btn`);
            let nextWindow = selector(`[${swiper}-window='${nextWindowRef}']`);
            let currentWindow = selector(`[${swiper}-window][modal-active='true']`);
            let currentWindowRef = currentWindow.getAttribute(`${swiper}-window`);
            if (currentWindowRef !== nextWindowRef) {
                selectorAll(`[${swiper}-window-btn]`).forEach((swiperBtn) => swiperBtn.setAttribute("btn-active", false));
                selectorAll(`[${swiper}-window]`).forEach((window) => window.setAttribute("modal-active", false));
                btn.setAttribute("btn-active", true);
                if (dialogWindows.includes(swiper)) {
                    selector("[close-btn]", selector(`[${swiper}]`)).setAttribute(`${swiper}-btn`, nextWindowRef);
                } else {
                    contentWindow = nextWindowRef;
                }
                setTimeout(() => {
                    currentWindow.setAttribute("hidden", true);
                    nextWindow.setAttribute("hidden", false);
                    setTimeout(() => nextWindow.setAttribute("modal-active", true), 500);
                }, 500);
            }
        })
    );
});
//! MENU ACTIONS //
selectorAll(`[option-btn]`).forEach((btn) => {
    btn.addEventListener("click", () => {
        const optionRef = btn.getAttribute("option-btn");
        const optionsDroper = selector(`[options-droper='${optionRef}']`);
        const isDroperHidding = optionsDroper.getAttribute(`hidden`);
        const isMenuActive = optionsDroper.getAttribute(`options-active`);
        if (isDroperHidding === "false") {
            optionsDroper.setAttribute("options-active", isMenuActive === "true" ? false : true);

            setTimeout(() => optionsDroper.setAttribute("hidden", isDroperHidding === "true" ? false : true), 500);
        } else {
            optionsDroper.setAttribute("hidden", isDroperHidding === "true" ? false : true);

            setTimeout(() => optionsDroper.setAttribute("options-active", isMenuActive === "true" ? false : true), 500);
        }
    });
});

const setStart = () => {
    checkStorageAnswer();
    createThemeBtns();
    const currentStorage = storagePokedex.recovery;
    if (currentStorage.genders.length === 0) getGenderData();
    if (currentStorage.types.length === 0) getTypesData();
    freezPage();
    console.log(storagePokedex.recovery);
    storagePokedex.recovery.types.forEach((type) => {
        type.pokemon.forEach((pokemon) => {
            if (!completeList.includes(pokemon)) completeList.push(pokemon);
        });
    });
};
setStart();
