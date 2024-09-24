const $d = document;
import { pokeApi, pokeTypesData, itemToSave, storageContent, pokeStatsData, feetsInMeter, inchesInMeters, lbsInKg, dbName, storageThemes, es, en, storageThemeSaved, personalizedT, metric, imperial } from "./utils.js";
import { raw } from "./raw.js";
const selector = (tag, container = $d) => container.querySelector(`${tag}`);
const selectorAll = (tag, container = $d) => container.querySelectorAll(`${tag}`);

//!  PAGE ITEMS //
const BODY = selector("body");
const modal = selector(`[modal]`);
let storagePokedex = {};

let currentLang = es;
let audioActive = true;

let currentMeasurmentSystem = metric;
let itsFirstPokemonSearch = true;

let currentPokeFlavors = {};
let currentPokemon = 1;

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
const deleteArrElements = (parentElement) => {
    while (parentElement.length > 0) {
        parentElement.forEach((item) => {
            parentElement.pop(item);
        });
    }
};
const properCase = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
};
const fetchFunc = async (url) => {
    try {
        const fetching = await fetch(url);
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
const pillDataTemplate = selector("[pill-template]").content;

//! SPEECH FUNCTION //
const synth = window.speechSynthesis;

const speechFunction = (textToSpeech) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeech);
    synth.speak(utterance);
};

const createTypePill = (dataType, container) => {
    const newPillClone = pillDataTemplate.cloneNode(true);
    const newPill = selector("[pill-template]", newPillClone);
    const btnPill = selector("[pill-btn]", newPillClone);
    const labelPill = selector("[label]", newPillClone);
    const iconPill = selector("[icon]", newPillClone);
    labelPill.setAttribute("es", dataType.name[es]);
    labelPill.setAttribute("en", dataType.name[en]);
    labelPill.textContent = dataType.name[currentLang];
    btnPill.classList.add("type_pill");
    btnPill.setAttribute("color-scheme", dataType.name[en]);
    iconPill.insertAdjacentHTML("afterbegin", dataType.svg);
    btnPill.setAttribute(`details-btn`, "");
    btnPill.addEventListener("click", () => activateDialogAction("details", btnPill));
    container.append(newPill);
};
const createPill = (data, container) => {
    console.log(data);
    const newPillClone = pillDataTemplate.cloneNode(true);
    const newPill = selector("[pill-template]", newPillClone);
    const labelPill = selector("[label]", newPillClone);
    selector("[icon]", newPillClone).remove();
    labelPill.setAttribute("es", data.es);
    labelPill.setAttribute("en", data.en);
    labelPill.textContent = data[currentLang];
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
const createDataCards = (list, container) => {
    list.forEach((pokeItem) => {
        const itemData = createBasicCard(pokeItem, container);
        const [card, cardIdData] = itemData;
        if (cardIdData === currentPokemon) card.disabled = true;
    });
};
const createBasicCard = (item, container) => {
    const newClone = cardBtnTemplate.cloneNode(true);
    const newItem = selector("[card-item]", newClone);
    const card = selector("[card-btn]", newItem);
    const cardSelector = selector("[card-selector]", newItem);
    const cardImg = selector("[card-img]", newItem);
    const cardId = selector("[card-id]", newItem);
    const cardText = selector("[card-text]", newItem);
    const cardTypes = selector("[card-types]", newItem);
    cardText.textContent = item.name;
    cardId.textContent = item.id;
    cardImg.src = item.img;
    const cardIdData = item.id;
    item.types.forEach((itemType) => {
        const thisType = pokeTypesData.find((item) => item.name.en === itemType);
        createTypePill(thisType, cardTypes);
    });
    card.addEventListener("click", () => {
        setPokeData(item.id);
        closeModal();
    });

    container.appendChild(newItem);
    return [card, cardIdData];
};
//! STORAGE FUNCTIONS FUNCTION //
const updatePokedex = () => {
    storagePokedex = JSON.parse(localStorage.getItem(dbName));
};
const savePokedex = () => {
    localStorage.setItem(dbName, JSON.stringify(storagePokedex));
};
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
        cardText.setAttribute("es", theme.name[es]);
        cardText.setAttribute("en", theme.name[en]);
        cardText.textContent = theme.name[currentLang];
        cardImg.src = `./assets/images/pokemon/${theme.name[en]}.png`;
        cardContent.setAttribute("color-scheme", theme.name[en]);
        card.addEventListener("click", () => BODY.setAttribute("color-scheme", theme.name[en]));
        selector("[default-themes]").appendChild(newItem);
    });
};
//! SET BASIC DATA IN PAGE //
const checkStorageAnswer = () => {
    if (window.navigator.language === "es" || (window.navigator.language[0] === "e" && window.navigator.language[1] === "s" && window.navigator.language[2] === "-")) {
        console.log("navegador en idioma español");
    } else {
        console.log("navegador en otro idioma no español");
    }
    updatePokedex();
    if (!storagePokedex) {
        localStorage.setItem(dbName, JSON.stringify(storageContent));
        console.log("local storage item is created");
    } else {
        console.log("Cantidad de temas salvados: " + storagePokedex[storageThemes].length);
    }
};
//! FETCH GENERAL DATA //

const pokeImg = selector("[poke-img");
const pokeIcons = selectorAll("[poke-icon]");
const pokeNames = selectorAll("[poke-name");
const pokeId = selector("[poke-id]");
const pokePillsContainer = selector("[poke-types]");
const pokeDescriptionHabitat = selector("[poke-habitat]");
const pokeDescriptionWeight = selector("[poke-weight]");
const pokeDescriptionHeight = selector("[poke-height]");

const evoCardsContainer = selector("[evo-cards]");
const varietieCardsContainer = selector("[varietie-cards]");
const abilitiesContainer = selector("[poke-abilities]");

const itemCardData = (dataItem) => {
    const { name, id, types, sprites } = dataItem;
    const pokeTypes = [];
    for (let type = 0; type < types.length; type++) {
        pokeTypes.push(types[type].type.name);
    }
    const pokeImg = sprites.other["official-artwork"]["front_default"];

    return { name: name, id: id, types: pokeTypes, img: pokeImg };
};

let currentEvoChain = "";
const timeOfDay = selector("[time_of_day]");
const minHappiness = selector("[min_happiness]");
const setPokeData = async (id) => {
    const evoChain = [];
    const varrietiesData = [];
    try {
        const data = await fetchFunc(pokeApi(`pokemon/${id}`));
        if (!data) throw error;
        currentPokemon = data.id;
        deleteChildElements(varietieCardsContainer);
        pokeIcons.forEach((icon) => {
            icon.setAttribute("active", false);
            icon.setAttribute("hidden", true);
        });

        const speciesLink = data.species.url;
        const speciesData = await fetchFunc(speciesLink);

        console.log("Primer data");
        console.log(data);
        console.log(speciesData);

        if (speciesData.evolves_from_species) console.log(speciesData.evolves_from_species);
        if (itsFirstPokemonSearch === true) {
            itsFirstPokemonSearch = false;
            pokeImg.classList.remove("animation_spin");
        }

        //! BASIC DATA//
        const artworkImg = data.sprites.other["official-artwork"]["front_default"];
        /* SET PAGE DATA ASYNC */
        pokeImg.src = artworkImg;
        pokeImg.setAttribute("alt", data.name);
        pokeNames.forEach((name) => (name.textContent = data.name));
        pokeId.textContent = data.id;
        if (audioActive) playAudio(data.cries.latest);

        //! DESCRIPTION FLAVORS DATA//
        const pokeFlavors = speciesData.flavor_text_entries;
        currentPokeFlavors.es = pokeFlavors.find((item) => item.language.name === es);
        currentPokeFlavors.en = pokeFlavors.find((item) => item.version.name === currentPokeFlavors.es.version.name && item.language.name === en);

        currentPokeFlavors.es = currentPokeFlavors.es.flavor_text.replace("\f", "\n").replace("\u00ad\n", "").replace("\u00ad", "").replace(" -\n", " - ").replace("-\n", "-").replace("\n", " ");
        currentPokeFlavors.en = currentPokeFlavors.en.flavor_text.replace("\f", "\n").replace("\u00ad\n", "").replace("\u00ad", "").replace(" -\n", " - ").replace("-\n", "-").replace("\n", " ");

        const flavor = selector("[poke-flavor]");
        flavor.setAttribute("es", currentPokeFlavors.es);
        flavor.setAttribute("en", currentPokeFlavors.en);
        flavor.innerHTML = currentPokeFlavors[currentLang];
        //! TYPES DATA//
        deleteChildElements(pokePillsContainer);
        selectorAll(`[bg-type]`).forEach((bg) => bg.setAttribute("hidden", true));
        selector(`[bg-type='${data.types[0].type.name}']`).setAttribute("hidden", false);

        if (data.types.length > 1) {
            data.types.forEach(async (type) => createTypePill(pokeTypesData.filter((item) => item.name.en === type.type.name)[0], pokePillsContainer));
        } else if (data.types.length === 1) createTypePill(pokeTypesData.filter((item) => item.name.en === data.types[0].type.name)[0], pokePillsContainer);

        //! ABILITIES DATA//
        deleteChildElements(abilitiesContainer);
        data.abilities.forEach(async (item) => {
            let abilityData;
            let dataEs;
            let dataEn;
            try {
                abilityData = await fetchFunc(item.ability.url);
                if (!abilityData) throw error;
                dataEs = abilityData.names.find((ability) => ability.language.name === es);
                dataEn = abilityData.names.find((ability) => ability.language.name === en);
                createPill({ type: dataEn.name.toLowerCase(), es: dataEs.name.toLowerCase(), en: dataEn.name.toLowerCase() }, abilitiesContainer);
            } catch (error) {
                console.log(error);
            }
        });

        //! HABITAT DATA//
        if (speciesData.habitat) {
            const habitatData = await fetchFunc(speciesData.habitat.url);
            pokeDescriptionHabitat.setAttribute(`es`, habitatData.names.find((item) => item.language.name === "es").name);
            pokeDescriptionHabitat.setAttribute(`en`, habitatData.names.find((item) => item.language.name === "en").name);
        } else {
            pokeDescriptionHabitat.setAttribute(`es`, "Desconocido");
            pokeDescriptionHabitat.setAttribute(`en`, "Unknown");
        }

        pokeDescriptionHabitat.textContent = pokeDescriptionHabitat.getAttribute(`${currentLang}`);
        //! MEADURMENTS DATA//
        let metricPokeHeight = convertDecimals(data.height * 0.1);
        let metricPokeWeight = convertDecimals(data.weight * 0.1);

        let imperialHeightFeet = metricPokeHeight * feetsInMeter;
        let decimals = `.${imperialHeightFeet.toString().split(".")[1]}`;
        let imperialHeightInches = Math.round((decimals / feetsInMeter) * inchesInMeters).toString();
        let imperilPokeWeight = (metricPokeWeight * lbsInKg).toFixed(1);

        pokeDescriptionHeight.setAttribute("value-metric", `${metricPokeHeight}m`);
        pokeDescriptionHeight.setAttribute("value-imperial", imperialHeightInches.length === 1 ? `${parseInt(imperialHeightFeet)}'0${imperialHeightInches}"` : `${parseInt(imperialHeightFeet)}'${imperialHeightInches}"`);

        pokeDescriptionWeight.setAttribute("value-metric", `${metricPokeWeight}Kg`);
        pokeDescriptionWeight.setAttribute("value-imperial", `${imperilPokeWeight}Lbs`);

        pokeDescriptionHeight.textContent = pokeDescriptionHeight.getAttribute(`value-${currentMeasurmentSystem}`);
        pokeDescriptionWeight.textContent = pokeDescriptionWeight.getAttribute(`value-${currentMeasurmentSystem}`);

        //! GENDER DATA//
        const pokeFemales = await fetchFunc(pokeApi("gender/1"));
        const pokeMales = await fetchFunc(pokeApi("gender/2"));
        const pokeGenderless = await fetchFunc(pokeApi("gender/3"));

        if (pokeFemales[`pokemon_species_details`].find((item) => item[`pokemon_species`][`name`] === data.name)) activePokeIconStat("female");
        if (pokeMales[`pokemon_species_details`].find((item) => item[`pokemon_species`][`name`] === data.name)) activePokeIconStat("male");
        if (pokeGenderless[`pokemon_species_details`].find((item) => item[`pokemon_species`][`name`] === data.name)) activePokeIconStat("genderless");

        //! SPECIAL DATA//
        if (speciesData.is_baby) activePokeIconStat("baby");
        if (speciesData.is_legendary) activePokeIconStat("legendary");
        if (speciesData.is_mythical) activePokeIconStat("mythical");
        if (!speciesData.is_baby && !speciesData.is_legendary && !speciesData.is_mythical) activePokeIconStat("none");

        //! STATS DATA//

        data.stats.forEach((statType) => {
            selectorAll("[poke-stat-item]").forEach((statItem) => {
                let itemType = selector("[poke-stat-type]", statItem).getAttribute("poke-stat-type");

                if (statType.stat.name === itemType) {
                    const extraValuePh = selector("[extra-value-placeholder]", statItem);
                    const extraValue = selector("[extra-value]", statItem);
                    if (statType.effort > 0) {
                        extraValue.textContent = statType.effort;
                        extraValuePh.setAttribute("hidden", false);
                        extraValuePh.setAttribute("show", true);
                    } else {
                        extraValuePh.setAttribute("hidden", true);
                        extraValuePh.setAttribute("show", false);
                    }

                    selector("[stat-value]", statItem).textContent = statType.base_stat;
                }
            });
        });

        //! VARIETIES DATA//
        speciesData.varieties.forEach(async (varietie) => {
            try {
                const varietieData = await fetchFunc(varietie.pokemon.url);
                if (!varietieData) throw error;
                const [card, cardIdData] = createBasicCard(itemCardData(varietieData), varietieCardsContainer);
                if (cardIdData === currentPokemon) card.disabled = true;
            } catch (error) {
                console.log(error);
            }
        });

        const createEvoItems = async (pokeData, arrContainer) => {
            let thisEvoItem;
            let response;
            try {
                const evoChainData = await fetchFunc(pokeData.species.url);
                if (!evoChainData) throw error;

                thisEvoItem = await fetchFunc(pokeApi(`pokemon/${evoChainData.id}`));

                if (!thisEvoItem) throw error;

                arrContainer.push(itemCardData(thisEvoItem));
            } catch (error) {
                console.log(error);
            } finally {
                console.log(pokeData.evolves_to);
                if (pokeData.evolves_to.length >= 1) {
                    const evoBy = pokeData.evolves_to.find((evolveType) => evolveType.species.name === data.name);
                    if (evoBy) {
                        console.log(evoBy.evolution_details);
                        evoBy.evolution_details.map((detail) => {
                            console.log(detail);
                            Object.keys(detail).forEach(async (key) => {
                                if (detail[key] !== null) {
                                    if (typeof detail[key] === "string" || (detail[key] !== "boolean" && key !== "item" && key !== "held_item" && key !== "known_move")) {
                                        console.log(`${key}: ${detail[key].name}`);
                                        response = detail[key].name;
                                    } else {
                                        console.log(key, detail[key]);
                                        response = key;
                                    }
                                    if (response === "level-up") console.log(thisEvoItem);
                                    if (key !== "known_move_type" && key !== "needs_overworld_rain " && key !== "turn_upside_down" && response !== undefined && key !== "location") {
                                        console.log(response);
                                        activePokeIconStat(response);
                                    }

                                    if (key === "item") {
                                        const itemImg = await fetchFunc(detail[key].url);
                                        console.log(itemImg);
                                        selector("[stone-item-img]").src = itemImg.sprites.default;
                                        selector("[stone-item-name]").textContent = detail[key].name;
                                    }
                                    if (key === "held_item") {
                                        const heldItemData = await fetchFunc(detail[key].url);
                                        console.log(heldItemData);
                                        selector("[held-item-img]").src = heldItemData.sprites.default;
                                        selector("[held-item-name]").textContent = detail[key].name;
                                    }
                                    if (key === "known_move") {
                                        const moveData = await fetchFunc(detail[key].url);
                                        const enData = moveData.names.find((type) => type.language.name === en);
                                        const esData = moveData.names.find((type) => type.language.name === es);
                                        createPill({ en: enData.name, es: esData.name }, selector("[known-move-types]"));
                                    }
                                }
                            });
                        });
                    }

                    pokeData.evolves_to.forEach((newPokeData) => createEvoItems(newPokeData, evoChain));
                } else if (pokeData.evolves_to.length === 0) {
                    deleteChildElements(evoCardsContainer);
                    arrContainer.forEach((evoItem) => {
                        const [card, cardIdData] = createBasicCard(evoItem, evoCardsContainer);
                        if (cardIdData === currentPokemon) card.disabled = true;
                    });
                }
            }
        };

        const evoData = await fetchFunc(speciesData.evolution_chain.url);
        await createEvoItems(evoData.chain, evoChain);

        toThetop();
        const pokeDescriptionSpeech = `${data.name}, ${currentPokeFlavors[currentLang]}, ${currentLang === es ? "cuenta con un peso promedio de" : "has an average weight of"} ${
            currentMeasurmentSystem === metric ? metricPokeWeight + (currentLang === es ? " kilogramos " : " kilograms ") : imperilPokeWeight + (currentLang === es ? " libras" : "pounds")
        } ${currentLang === es ? "y una altura promedio de " : " an average height of "}${
            currentMeasurmentSystem === metric ? metricPokeHeight + (currentLang === es ? " metros de altura" : " height") : parseInt(imperialHeightFeet) + (currentLang === es ? " pies, con " : " foots, with ") + imperialHeightInches + (currentLang === es ? " pulgadas" : " inches")
        }`;
        setTimeout(() => {
            speechFunction(pokeDescriptionSpeech);
        }, 3000);
    } catch (error) {
        console.log(error);
    } finally {
        searchInput.value = "";
        console.log(currentPokemon);
    }
};
let nextPage = "";
const generalPokeCards = selector("[general-cards-container]");
const startCards = async (link) => {
    const currentData = [];
    try {
        const data = await fetchFunc(link);
        if (!data) throw error;
        console.log(data.next);

        for (let step = 0; step < data.results.length; step++) {
            const pokeData = await fetchFunc(pokeApi(`pokemon/${data.results[step].name}`));
            currentData.push(itemCardData(pokeData));
        }
    } catch (error) {
        console.log(error);
    } finally {
        currentData.forEach((item) => {
            createBasicCard(item, generalPokeCards);
        });
    }
};
const closeModal = () => {
    BODY.style = "";
    modal.setAttribute("modal-active", "false");
    selectorAll(`[modal-window]`).forEach((window) => window.setAttribute("hidden", "true"));
    setTimeout(() => {
        modal.close();
    }, 500);
};
//! FORM AND SEARCH BTN ACTIONS //
const searchForm = selector("[search-form]");
const searchInput = selector("[search-input]");
const searchBtn = selector("[poke-search-btn]");
const searchPokemon = () => {
    console.log(`Buscando nuevo pokemon...`);
    searchInput.value === "" ? console.log("necesitas agregar un dato") : setPokeData(sanitizeInput(searchInput.value.toLowerCase()));

    closeModal();
};
searchBtn.addEventListener("click", searchPokemon);
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchPokemon();
});
const changePokemonByPosition = (btn) => {
    const ref = btn.getAttribute("position");
    if (itsFirstPokemonSearch === false) {
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
    } else {
        if (ref === "previous") {
            currentPokemon = 898;
        }
    }
    setPokeData(currentPokemon);
};
//! SOUND BTN ACTIIONS //
const changeSoundState = () => {
    selectorAll("[icon='sound']").forEach((icon) => {
        icon.setAttribute("hidden", icon.getAttribute("hidden") === "true" ? "false" : "true");
    });
    audioActive = !audioActive;
};
selectorAll("[action='sound']").forEach((btn) => btn.addEventListener("click", changeSoundState));
selector("[action='poke_sound_btn']").addEventListener("click", () => playAudio(pokeAudio.src));
//! LANG BTN ACTIIONS //
const changeLang = () => {
    currentLang = currentLang === es ? en : es;
    selectorAll("[change]").forEach((item) => {
        item.textContent = item.getAttribute(`${currentLang}`);
    });
};
selectorAll("[action='lang']").forEach((btn) => btn.addEventListener("click", changeLang));
//! POSITION BTN ACTIONS //

selectorAll("[position]").forEach((btn) => btn.addEventListener("click", () => changePokemonByPosition(btn)));
selector("[action='top_btn']").addEventListener("click", toThetop);

//! MEASUREMENT ACTIONS //
const measurementLabels = selectorAll("[ measurement-system ]");
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
    currentMeasurmentSystem = newSystem;
    measurementBtn.setAttribute("current-system", newSystem);
    measurementLabels.forEach((label) => {
        label.textContent = measurementData[newSystem][currentLang];
        label.setAttribute("es", measurementData[newSystem][es]);
        label.setAttribute("en", measurementData[newSystem][en]);
    });
    selectorAll("[poke-measurement]").forEach((measurement) => (measurement.textContent = measurement.getAttribute(`value-${newSystem}`)));
};
measurementBtn.addEventListener("click", changeMeasurementSystem);
//! DIALOGS ACTIONS //
const dialogWindows = ["modal", "details"];
const activateDialogAction = (dialog, btn) => {
    console.log(dialog, btn);
    const modal = selector(`[${dialog}]`);
    const dialogStatus = modal.getAttribute("modal-active");
    freezPage();
    selectorAll(`[${dialog}-window-btn]`).forEach((swiperBtn) => swiperBtn.setAttribute("btn-active", false));
    const currentBtn = btn.getAttribute(`${dialog}-btn`);
    selector(`[${dialog}-window-btn='${currentBtn}']`).setAttribute("btn-active", true);
    const dialogWindow = selector(`[${dialog}-window='${currentBtn}']`);
    selector(`[close-btn]`, modal).setAttribute(`${dialog}-btn`, currentBtn);
    if (dialogStatus === "false") {
        modal.showModal();
        modal.setAttribute("modal-active", "true");
        dialogWindow.setAttribute("hidden", "false");
        setTimeout(() => dialogWindow.setAttribute("modal-active", "true"), 100);
    }
    return dialogStatus;
};
dialogWindows.forEach((dialog) => {
    let modal;
    let dialogStatus;
    selectorAll(`[${dialog}-btn]`).forEach((btn) =>
        btn.addEventListener("click", () => {
            dialogStatus = activateDialogAction(dialog, btn);
        })
    );
    selectorAll("[close-btn]").forEach((btn) => {
        modal = selector(`[${dialog}]`);
        dialogStatus = modal.getAttribute("modal-active");
        if (dialogStatus === "true") {
            btn.addEventListener("click", () => {
                BODY.style = "";
                modal.setAttribute("modal-active", "false");

                selectorAll(`[${dialog}-window]`).forEach((window) => window.setAttribute("hidden", "true"));
                setTimeout(() => {
                    modal.close();
                }, 500);
            });
        }
    });
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
                    currentWindow.setAttribute("hidden", "true");
                    nextWindow.setAttribute("hidden", "false");
                    setTimeout(() => nextWindow.setAttribute("modal-active", "true"), 500);
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
            optionsDroper.setAttribute("options-active", isMenuActive === "true" ? "false" : "true");

            setTimeout(() => optionsDroper.setAttribute("hidden", isDroperHidding === "true" ? "false" : "true"), 500);
        } else {
            optionsDroper.setAttribute("hidden", isDroperHidding === "true" ? "false" : "true");

            setTimeout(() => optionsDroper.setAttribute("options-active", isMenuActive === "true" ? "false" : "true"), 500);
        }
    });
});

const newCards = (link) => {
    console.log("prueba de new");
};
//! START FUNCTION //
selector("[target]").addEventListener("click", () => {
    newCards("");
});
const setStart = () => {
    checkStorageAnswer();
    createThemeBtns();
    startCards(pokeApi("pokemon"));
    freezPage();
};
setStart();
