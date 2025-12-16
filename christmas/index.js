/**
 * @type {{what:string, who1:string, shift1:string, who2?:string, shift2?:string}[]}
 */
const elfData = [
    {
        what: "Logisztika",
        who1: "Kovács Máté",
        shift1: "Délelőttös",
        who2: "Kovács József",
        shift2: "Délutános"
    },
    {
        what: "Könyvelés",
        who1: "Szabó Anna",
        shift1: "Éjszakai"
    },
    {
        what: "Játékfejlesztés",
        who1: "Varga Péter",
        shift1: "Délutános",
        who2: "Nagy Eszter",
        shift2: "Éjszakai"
    }
];

initSelect(elfData);

const jsSection = document.createElement("div");
jsSection.id = "jssection";
jsSection.classList.add("hide");
document.body.appendChild(jsSection);

// Táblázat:

const table = document.createElement("table");
jsSection.appendChild(table);

const tableHead = document.createElement("thead");
table.appendChild(tableHead);

const headerRow = document.createElement("tr");
tableHead.appendChild(headerRow);

const headerTitles = ["Osztály", "Manó", "Műszak"];
for (const title of headerTitles) {
    createCell("th", title, headerRow);
}

const tableBody = document.createElement("tbody");
tableBody.id = "jstbody";
table.appendChild(tableBody);

renderTbody(elfData);

// Form:

/**
 * @type {{id:string, label:string, name:string, type?:string, optionList?:{value:string, label:string}[]}[]}
 */
const formData = [
    {   
        id: "osztaly",
        label: "Osztály",
        name: "osztaly"
    },{   
        id: "mano1",
        label: "Manó 1",
        name: "mano1"
    },{
        id: "muszak1",
        label: "Manó 1 műszak",
        name: "muszak1",
        type: "select",
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" }, { value: "3", label: "Éjszakai" }]
    },{
        id: "masodikmano",
        label: "Két manót veszek fel",
        name: "masodikmano",
        type: "checkbox"
    },{ 
        id: "mano2",
        label: "Manó 2",
        name: "mano2"
    },{
        id: "muszak2",
        label: "Manó 2 műszak",
        name: "muszak2",
        type: "select",
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" }, { value: "3", label: "Éjszakai" }]
    }
];

const jsForm = createForm(formData);
jsSection.appendChild(jsForm);

jsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;

    const departmentInput = form.querySelector("#osztaly");
    const firstElfInput = form.querySelector("#mano1");
    const firstShiftSelect = form.querySelector("#muszak1");
    const secondElfInput = form.querySelector("#mano2");
    const secondShiftSelect = form.querySelector("#muszak2");
    const secondElfCheckbox = form.querySelector("#masodikmano");

    clearErrors(form);

    if (
        validateRequired(departmentInput) &
        validateRequired(firstElfInput) &
        validateRequired(firstShiftSelect)
    ) {
        const newEntry = {
            what: departmentInput.value,
            who1: firstElfInput.value,
            shift1: mapMuszak(firstShiftSelect.value)
        };

        if (secondElfCheckbox.checked) {
            newEntry.who2 = secondElfInput.value;
            newEntry.shift2 = mapMuszak(secondShiftSelect.value);
        }

        createNewElement(newEntry, form, elfData);
    }
});

document.getElementById("htmlform").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const elfSelect = form.querySelector("#manochooser");
    const taskInput1 = form.querySelector("#manotev1");
    const taskInput2 = form.querySelector("#manotev2");

    clearErrors(form);

    if (validateRequired(elfSelect) & validateRequired(taskInput1)) {
        const tbody = document.getElementById("htmltbody");
        const row = document.createElement("tr");
        tbody.appendChild(row);

        createCell("td", elfSelect.value, row);
        createCell("td", taskInput1.value, row);
        
        if (taskInput2.value) {
            createCell("td", taskInput2.value, row);
        } else {
            taskCell1.colSpan = 2;
        }

        form.reset();
    }
});

initCheckbox(document.getElementById("jsform").querySelector("#masodikmano"));
