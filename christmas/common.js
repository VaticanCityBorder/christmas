/**
 * @typedef {{what: string, who1: string, who2?: string}} PartialElf
 */

/**
 * Ez a függvény a javascript legvégén fut le, amikor már minden elem betöltött.
 * Első lépésben vizsgáljuk a checkbox értékét, és az alapján beállítjuk a többi elem
 * státuszát (ha nincs bepipálva akkor a mano2 és a muszak2 értéke nem engedélyezett)
 * Aztán feliratkozunk a change eseményre, hogy amikor változik a checkbox értéke,
 * akkor is frissüljenek a státuszok.
 * 
 * @param {HTMLInputElement} checkboxElem ami a formon belül helyezkedik el
 * @returns {void}
 */
function initCheckbox(checkboxElem){
    changeCheckboxValue(checkboxElem);
    checkboxElem.addEventListener("change", (e) => {
        changeCheckboxValue(checkboxElem);
    })
}

/**
 * 
 * A bemeneti checkbox értéke alapján állítja a formon belüli mano2 és muszak2 disabled
 * értékét. Ha nincs bepipálva a checkbox, akkor a disabled érték igaz lesz, tehát nem
 * módosíthatjuk őket.
 * Ha be van pipálva, akkor a disabled értéke false lesz, tehát a mezők módosíthatóak
 * a checkboxtól a formot a parentElementjének (div) a parentElementjén keresztül érjük
 * el, és a két beviteli mező azonosítója mano2 és muszak2
 * 
 * @param {HTMLInputElement} checkbox egy jelölőnégyzet
 * @returns {void}
 */
function changeCheckboxValue(checkbox){
    const mano2 = document.getElementById("mano2");
    const muszak2 = document.getElementById("muszak2");

    if (checkbox.checked) {
        mano2.disabled = false;
        muszak2.disabled = false;
    }
    else {
        mano2.disabled = true;
        muszak2.disabled = true;
    }
}

/**
 * Segédfüggvény, aminek a segítségével elkérjük a htmlformon belüli 
 * manochooser azonosítójú elemet, ami tartalmazza az összes rendszerben létező manót
 * 
 * @returns {HTMLSelectElement}
 */
function getSelectElement() {
    const htmlForm = document.getElementById('htmlform');
    const select = htmlForm.querySelector('#manochooser');
    return select;
}

/**
 * 
 * A tömb alapján felépíti a dropdownlist opcióit.
 * Első lépésben töröljük az optionlist tartalmát, majd
 * létrehozunk egy opciót, aminek nincs value értéke,
 * a tartalma pedig "Válassz manót!" utána végigiterálunk
 * a bemeneti tömbön és hozzáfűzük a tömb who1 manóit az
 * optionlisthez. Amennyiben a who2 is definiálva van,
 * azt is hozzáfűzzük.
 * a függvény korán fut le, hiszen a dropdownlist a html-en
 * található 
 * 
 * @param {PartialElf[]} arr az adattömb, ami alapján felépítjük az opciókat
 * @returns {void}
 */
function initSelect(arr) {
    const select = getSelectElement();
    select.innerHTML = '';
    createoption(select, "Válassz Manót!"); // ez a függvény még nincs implementálva, görgess lejjebb

    for (const elem of arr) {
        createoption(select, elem.who1, elem.who1);
        if (elem.who2) {
            createoption(select, elem.who2, elem.who2);
        }
    }
}

/**
 * Létrehoz és hozzáfűz egy új optiont a selecthez
 * 
 * @param {HTMLSelectElement} selectElement a select element
 * @param {string} label az option tag közötti szöveg
 * @param {string} [value=""] az option value értéke, alapértelmezett értéke üres string
 * @returns {void}
 */
function createoption(selectElement, label, value = "") {
    
    const option = document.createElement("option");
    option.value = value;
    option.innerText = label;
    selectElement.appendChild(option);
}

/**
 * 
 * Ez a függvény azután fut le az eseménykezelőben,
 * miután a validáció sikeres volt, és összeállítottuk az objektumot.
 * Hasonlóan az inithez, az objektum who1 és a who2 (ha van) tulajdonság
 * alapján fűzzük hozzá a selecthez az új opciókat.
 * Ezután fűzzük hozzá az új elemet a tömb paraméterhez, majd meghívjuk a renderTbody
 * függvényt az array-el (ez a tömb alapján újrarendereli a táblázatot)
 * Végül töröljük az ürlap beviteli mezőinek a tartalmát.
 * Fontos, hogy a reset függvény után meghívjuk a {@link changeCheckboxValue} a checkbox elemmel,
 * mert change esemény nem keletkezik a form resetelésekor.
 * Az objektum abban az esetben, ha a "Két manót veszek fel" jelölő négyzet nincs bepipálva,
 * csak az első manó adatait tartalmazza, a másik manóhoz tartozó tulajdonságok nem definiáltak
 * 
 * @param {PartialElf} obj ez az összerakott elem
 * @param {HTMLFormElement} form az ürlap
 * @param {PartialElf[]} array az adattömb
 * @returns {void}
 */
function createNewElement(obj, form, array) {

    const select = getSelectElement();
    createoption(select, obj.who1, obj.who1);
    if (obj.who2) {
        createoption(select, obj.who2, obj.who2);
    }
    
    // ez egy ismerős rész, ehhez nem kell nyúlni
    array.push(obj);
    renderTbody(array);
    form.reset();
    // ismerős rész vége
    
    const mano2 = document.getElementById("masodikmano");
    changeCheckboxValue(mano2);
}

/**
 * 
 * Mivel a műszakválasztó 1,2 vagy 3 elemet vesz fel,
 * ezért ezt át kell alakítani olyan értékké, amit a 
 * felhasználónak meg szeretnénk jeleníteni. Ezt a függvényt
 * akkor hívjuk, amikor az objektumot összeállítjuk, mielőtt a
 * tömbbe beleraknánk.
 * Ha 1 az értéke akkor "Délelöttös", ha 2 akkor "Délutános", míg
 * 3 esetén az "Éjszakai" értékkel kell visszatérjen a függvény
 * 
 * @param {string} muszakValue az érték, amit a select optionjéből kapunk
 * @returns {string}
 */
function mapMuszak(muszakValue){
    
    if (muszakValue == "1") {muszakValue = "Délelőttös"};
    if (muszakValue == "2") {muszakValue = "Délutános"};
    if (muszakValue == "3") {muszakValue = "Éjszakai"};

    return muszakValue;
}

/**
 *  Lekérjük a tableselectort, és regisztrálunk egy change eseménykezelőt!
 */
const tableSelector = document.getElementById("tableselector");
tableSelector.addEventListener("change", (e) => {
    const target = e.target;
    const htmlSection = document.getElementById("htmlsection");
    const jsSection = document.getElementById("jssection");

    if (target.checked) {
        if (target.value == "jssection"){
            htmlSection.classList.add("hide");
            jsSection.classList.remove("hide");
        }
        else {
            htmlSection.classList.remove("hide");
            jsSection.classList.add("hide");
        }
    }
});

/**
 * Létrehoz egy cellát és egy sorhoz fűzi.
 * @param {"th"|"td"} cellType A cella típusa.
 * @param {string} cellContent A cella szöveges tartalma.
 * @param {HTMLTableRowElement} parentRow A sor amihez fűzzük.
 * @returns {HTMLTableCellElement}
 */
function createCell(cellType, cellContent, parentRow) {
    const cell = document.createElement(cellType);
    cell.innerText = cellContent;
    parentRow.appendChild(cell);

    return cell;
}

/**
 * Újratölti a táblázatot az adatokból.
 * @param {{what: string, who1: string, shift1: string, who2?: string, shift2?: string}[]} dataArray A táblázat adatai
 */
function renderTbody(dataArray) {
    const tbody = document.getElementById("jstbody");
    tbody.innerHTML = "";

    for (const item of dataArray) {
        const row = document.createElement("tr");
        tbody.appendChild(row);

        const whatCell = createCell("td", item.what, row);
        createCell("td", item.who1, row);
        createCell("td", item.shift1, row);
        
        if (item.who2 && item.shift2) {
            whatCell.rowSpan = 2;
            
            const secondRow = document.createElement("tr");
            tbody.appendChild(secondRow);

            createCell("td", item.who2, secondRow);
            createCell("td", item.shift2, secondRow);
        }
    }
}

/**
 * Létrehozza a form-ot  az adatok alapján.
 * @param {{id:string, label:string, name:string, type?:string, optionList?:{value:string, label:string}[]}[]} formData A form adatai.
 * @returns {HTMLFormElement}
 */
function createForm(formData) {
    const form = document.createElement("form");
    form.id = "jsform";

    for (const element of formData) {
        createFormField(element, form);
    }

    const submitButton = document.createElement("button");
    submitButton.innerText = "Hozzaadas";
    form.appendChild(submitButton);

    return form;
}

/**
 * Csinál egy mezőt a form-ba.
 * @param {{id:string, label:string, name:string, type?:string, optionList?:{value:string, label:string}[]}} field A jelenlegi adat.
 * @param {HTMLFormElement} form A form amihez fűzi.
 */
function createFormField(field, form) {
    const div = document.createElement("div");
    form.appendChild(div);

    if (field.type && field.type !== "select") {
        if (field.type === "checkbox") {
            const input = document.createElement("input");
            input.id = field.id;
            input.name = field.name;
            input.type = "checkbox";
            div.appendChild(input);

            const label = document.createElement("label");
            label.innerText = field.label;
            label.htmlFor = field.id;
            div.appendChild(label);
        }
    } else {
        const label = document.createElement("label");
        label.innerText = field.label;
        label.htmlFor = field.id;
        div.appendChild(label);
        div.appendChild(document.createElement("br"));

        if (field.type === "select") {
            const select = document.createElement("select");
            select.id = field.id;
            div.appendChild(select);

            const defaultOption = document.createElement("option");
            defaultOption.innerText = "Válassz műszakot!";
            defaultOption.value = "";
            select.appendChild(defaultOption);

            for (const option of field.optionList) {
                const opt = document.createElement("option");
                opt.innerText = option.label;
                opt.value = option.value;
                select.appendChild(opt);
            }
        } else {
            const input = document.createElement("input");
            input.id = field.id;
            input.name = field.name;
            div.appendChild(input);
            div.appendChild(document.createElement("br"));
        }
    }

    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error");
    div.appendChild(errorSpan);
}

/**
 * Validál egy inputot.
 * @param {HTMLInputElement} inputElement Az ellenőrizendő input.
 * @returns {boolean}
 */
function validateRequired(inputElement) {
    let isValid = true;

    if (inputElement.value === "") {
        inputElement.parentElement
            .querySelector(".error")
            .innerText = "Kötelező elem!";
        isValid = false;
    }

    return isValid;
}

/**
 * Törli az error kiírásokat a form-ból.
 * @param {HTMLFormElement} form A form aminek törli az error feliratait.
 */
function clearErrors(form) {
    const errorSpans = form.querySelectorAll(".error");
    for (const span of errorSpans) {
        span.innerText = "";
    }
}
