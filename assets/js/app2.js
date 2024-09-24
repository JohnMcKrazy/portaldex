const $d = document;
import { pokeApi, pokeTypesData, itemToSave, storageContent, pokeStatsData, feetsInMeter, inchesInMeters, lbsInKg, dbName, storageThemes, es, en, storageThemeSaved, personalizedT, metric, imperial } from "./utils.js";
import { raw } from "./raw.js";
const selector = (tag, container = $d) => container.querySelector(`${tag}`);
const selectorAll = (tag, container = $d) => container.querySelectorAll(`${tag}`);

//!  PAGE ITEMS //
const BODY = selector("body");

let storagePokedex = {};

let currentLang = es;
let audioActive = true;

let currentMeasurmentSystem = metric;
let itsFirstPokemonSearch = true;

let lastSearchType = "";

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
const changeToHexa = (valueToCheck) => {
    let firstLeter = valueToCheck.trim().split("")[0];
    if (firstLeter === "r") {
        let splited = valueToCheck.split("(")[1].split(")")[0];
        splited = splited.split(",");
        let search = splited.map((digit) => {
            digit = parseInt(digit).toString(16);
            return digit.length === 1 ? "0" + digit : digit;
        });
        return "#" + search.join("");
    }
};
const setCurrentColors = () => {
    const target = selector(`.${BODY.className}`);
    const targetStyle = getComputedStyle(target);
    const getBgColorStyle = targetStyle.getPropertyValue("--bgColor");
    const getFirstColorStyle = targetStyle.getPropertyValue("--firstColor");
    const getTextColorStyle = targetStyle.getPropertyValue("--textColor");
    const getBgAccentStyle = targetStyle.getPropertyValue("--bgAccent");
    /* console.log(getBgColorStyle, getFirstColorStyle, getTextColorStyle, getBgAccentStyle); */
    currentBgColor = changeToHexa(getBgColorStyle);
    currentFirstColor = changeToHexa(getFirstColorStyle);
    currentTextColor = changeToHexa(getTextColorStyle);
    currentBgAccent = changeToHexa(getBgAccentStyle);
    /* console.log(currentBgColor, currentFirstColor, currentTextColor, currentBgAccent); */

    colorPikersPersonalizedTheme.forEach((btn) => {
        let target = btn.getAttribute("name");
        switch (target) {
            case "bgColor":
                btn.value = currentBgColor;
                break;
            case "firstColor":
                btn.value = currentFirstColor;
                break;
            case "textColor":
                btn.value = currentTextColor;
                break;
            case "bgAccent":
                btn.value = currentBgAccent;
        }
        /* console.log(btn.value, target); */
    });
    colorPikersEditPersonalizedTheme.forEach((btn) => {
        let target = btn.getAttribute("name");
        switch (target) {
            case "bgColor":
                btn.value = currentBgColor;
                break;
            case "firstColor":
                btn.value = currentFirstColor;
                break;
            case "textColor":
                btn.value = currentTextColor;
                break;
            case "bgAccent":
                btn.value = currentBgAccent;
        }
    });
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

//! STORAGE FUNCTIONS FUNCTION //
const updatePokedex = () => {
    storagePokedex = JSON.parse(localStorage.getItem(dbName));
};
const savePokedex = () => {
    localStorage.setItem(dbName, JSON.stringify(storagePokedex));
};
//!SET DEFAULT THEME BTNS //
const cardBtnTemplate = selector("[card-template]").content;
const setDefautThemeBtns = () => {
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
const setCardData = async (fetchId, rawObject) => {
    try {
        if (rawObject.find((item) => item.pokeId === fetchId)) return;
        const raw = await fetchFunc(pokeApi(`pokemon/${fetchId}`));
        if (!raw) throw error;
        const { name, id, sprites, types } = raw;
        const thisData = { pokeName: name, pokeId: id, pokeImg: sprites.other["official-artwork"]["front_default"], pokeTypes: types.map((item) => item.type.name) };
        rawObject.push(thisData);
    } catch (error) {
        console.log(error);
    }
};

const pokePillsContainer = selector("[poke-types]");
const pillDataTemplate = selector("[pill-template]").content;
const optionBtnTemplate = selector("[option-btn-template]").content;

const pokeImg = selector("[poke-img");
const pokeIcons = selectorAll("[poke-icon]");
const pokeNames = selectorAll("[poke-name");
const pokeId = selector("[poke-id]");

const pokeDescriptionHabitat = selector("[poke-habitat]");
const pokeDescriptionWeight = selector("[poke-weight]");
const pokeDescriptionHeight = selector("[poke-height]");

const evoCardsContainer = selector("[evo-cards]");
const varietieCardsContainer = selector("[varietie-cards]");
const abilitiesContainer = selector("[poke-abilities]");
let currentEvoChainLink = "";
const evoData = [];
const varietiesData = [];
const synth = window.speechSynthesis;
const createOptionBtns = (optionData, container) => {
    const newClone = optionBtnTemplate.cloneNode(true);
    const optionItem = selector("[option-item]", newClone);
    const optionBtn = selector("[option-btn]", optionItem);
    const optionLabel = selector("[label]", optionItem);

    console.log(optionItem);
    container.appendChild(optionItem);
};

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
    container.append(newPill);
};
const createPill = (data, container) => {
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
    const thisIcon = selector(`[poke-icon='${typeIcon}']`);
    thisIcon.setAttribute("hidden", false);
    thisIcon.setAttribute("active", true);
};
const createEvoItems = async (pokeData) => {
    const evoChainData = await fetchFunc(pokeData.species.url);
    await setCardData(evoChainData.id, evoData);
    if (pokeData.evolves_to.length >= 1) {
        pokeData.evolves_to.forEach((newPokeData) => createEvoItems(newPokeData));
    }
};
const setPokeCards = (list, container) => {
    console.log(list);
    list.forEach((item) => {
        const newClone = cardBtnTemplate.cloneNode(true);
        const newItem = selector("[card-item]", newClone);
        const card = selector("[card-btn]", newItem);
        const cardSelector = selector("[card-selector]", newItem);
        const cardImg = selector("[card-img]", newItem);
        const cardId = selector("[card-id]", newItem);
        const cardText = selector("[card-text]", newItem);
        const cardTypes = selector("[card-types]", newItem);

        cardText.textContent = item.pokeName;
        cardId.textContent = item.pokeId;
        cardImg.src = item.pokeImg;

        item.pokeTypes.forEach((type) => {
            const thisType = pokeTypesData.find((item) => item.name.en === type);
            createTypePill(thisType, cardTypes);
        });
        item.pokeId === currentPokemon ? (card.disabled = true) : card.addEventListener("click", () => catchEmAll(item.pokeId));

        container.appendChild(newItem);
    });
};

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
    catchEmAll(currentPokemon);
};

console.log(window.speechSynthesis.getVoices());
const catchEmAll = async (id) => {
    try {
        const data = await fetchFunc(pokeApi(`pokemon/${id}`));
        if (!data) throw error;
        currentPokemon = data.id;
        pokeIcons.forEach((icon) => {
            icon.setAttribute("active", false);
            icon.setAttribute("hidden", true);
        });

        const speciesLink = data.species.url;
        const speciesData = await fetchFunc(speciesLink);
        const versionsData = await fetchFunc(pokeApi("version"));

        console.log("Primer data");
        console.log(data);
        console.log(speciesData);
        console.log(versionsData);

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
        /* if (audioActive) playAudio(data.cries.latest); */

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
        lastSearchType = data.types[0].type.name;
        console.log(lastSearchType);
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
        console.log(speciesData.varieties);
        deleteArrElements(varietiesData);

        speciesData.varieties.forEach(async (varietie) => {
            const varietieData = await fetchFunc(varietie.pokemon.url);
            await setCardData(varietieData.id, varietiesData);
        });

        //! EVOLUTION DATA //
        if (speciesData.evolution_chain) {
            console.log(speciesData.evolution_chain);
            if (currentEvoChainLink !== speciesData.evolution_chain.url) {
                deleteArrElements(evoData);

                currentEvoChainLink = speciesData.evolution_chain.url;
                let evoRawdata = await fetchFunc(currentEvoChainLink);
                const evoChainData = await fetchFunc(evoRawdata.chain.species.url);
                await setCardData(evoChainData.id, evoData);

                if (evoRawdata.chain.evolves_to.length >= 1) evoRawdata.chain.evolves_to.forEach(async (evoItem) => await createEvoItems(evoItem));
            }
        }
        toThetop();
        const pokeDescriptionSpeech = `${data.name}, ${currentPokeFlavors[currentLang]}, ${currentLang === es ? "cuenta con un peso promedio de" : "has an average weight of"} ${
            currentMeasurmentSystem === metric ? metricPokeWeight + (currentLang === es ? " kilogramos " : " kilograms ") : imperilPokeWeight + (currentLang === es ? " libras" : "pounds")
        } ${currentLang === es ? "y una altura promedio de " : " an average height of "}${
            currentMeasurmentSystem === metric ? metricPokeHeight + (currentLang === es ? " metros de altura" : " height") : parseInt(imperialHeightFeet) + (currentLang === es ? " pies, con " : " foots, with ") + imperialHeightInches + (currentLang === es ? " pulgadas" : " inches")
        }`;
        setTimeout(() => {
            deleteChildElements(evoCardsContainer);
            deleteChildElements(varietieCardsContainer);
            sortDataDecent(varietiesData, "pokeId");
            setPokeCards(evoData, evoCardsContainer);
            setPokeCards(varietiesData, varietieCardsContainer);
            /* setTimeout(() => (audioActive === true ? speechFunction(pokeDescriptionSpeech) : null), 1500); */
        }, 1000);
    } catch (error) {
        console.log(error);
    } finally {
        searchInput.value = "";
        console.log(currentPokemon);
    }
};
const favCardsContainer = selector(`[fav-cards]`);
const basicCardsContainer = selector(`[general-cards-container]`);
const createGeneralCards = async () => {
    try {
        const data = await fetchFunc(pokeApi(`pokemon/`));
        if (!data) throw error;
        console.log(data.results);
        setPokeCards(data.results, basicCardsContainer);
    } catch (error) {
    } finally {
    }
};
const searchForm = selector("[search-form]");
const searchInput = selector("[search-input]");
const searchBtn = selector("[poke-search-btn]");
const searchPokemon = () => {
    console.log(`Buscando nuevo pokemon...`);
    console.log(searchInput);
    searchInput.value === "" ? console.log("necesitas agregar un dato") : catchEmAll(sanitizeInput(searchInput.value.toLowerCase()));
    const modal = selector(`[modal]`);
    BODY.style = "";
    modal.setAttribute("modal-active", "false");
    selectorAll(`[modal-window]`).forEach((window) => window.setAttribute("hidden", "true"));
    setTimeout(() => {
        modal.close();
    }, 500);
};
searchBtn.addEventListener("click", searchPokemon);
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchPokemon();
});
const changeSoundState = () => {
    selectorAll("[icon='sound']").forEach((icon) => {
        icon.setAttribute("hidden", icon.getAttribute("hidden") === "true" ? "false" : "true");
    });
    audioActive = !audioActive;
};
selectorAll("[action='sound']").forEach((btn) => btn.addEventListener("click", changeSoundState));
const changeLang = () => {
    currentLang = currentLang === es ? en : es;
    selectorAll("[change]").forEach((item) => {
        item.textContent = item.getAttribute(`${currentLang}`);
    });
};
selectorAll("[action='lang']").forEach((btn) => btn.addEventListener("click", changeLang));

selector("[action='poke_sound_btn']").addEventListener("click", () => playAudio(pokeAudio.src));
selectorAll("[position]").forEach((btn) => btn.addEventListener("click", () => changePokemonByPosition(btn)));
selector("[action='top_btn']").addEventListener("click", toThetop);
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
const dialogWindows = ["modal", "alert"];
dialogWindows.forEach((dialog) => {
    let modal;
    let dialogStatus;
    selectorAll(`[${dialog}-btn]`).forEach((btn) =>
        btn.addEventListener("click", () => {
            const modal = selector(`[${dialog}]`);
            dialogStatus = modal.getAttribute("modal-active");
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
const setStart = () => {
    checkStorageAnswer();
    setDefautThemeBtns();
    createGeneralCards();
    freezPage();
};
setStart();
