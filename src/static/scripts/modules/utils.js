export function debounce(callback, delay) {
    // Delay the execution of the function passed as an argument by the specified amount
    let timer;
    return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(), delay);
    };
}

export function createHtmlElementFromString(template) {
    let parent = document.createElement("div");
    parent.innerHTML = template.trim();

    return parent.firstChild;
}

export function createTableElement(tag = "td", innerText = "", className = "") {
    // TODO: Figure out why it's not possible to use createHtmlElement() with table tags (<th>, <tr>, <td>)
    let tableElement = document.createElement(tag);
    tableElement.innerText = innerText;
    tableElement.className = className;

    return tableElement;
}

export function generateId(idLength = 9) {
    const characters = "01234567890abcdefghijklmnopqrstuvwxyz";

    let id = "";
    for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.random() * characters.length);
    }

    return id;
}
