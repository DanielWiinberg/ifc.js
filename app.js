import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });

// Create grid and axes
viewer.grid.setGrid();
viewer.axes.setAxes();



window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
    const result = await viewer.IFC.selector.highlightIfcItem();
    if (!result) return;
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    createPropertiesMenu(props);
};

const propsGUI = document.getElementById("ifc-property-menu-root");

function createPropertiesMenu(properties) {
    console.log(properties);

    removeAllChildren(propsGUI);

    delete properties.psets;
    delete properties.mats;
    delete properties.type;


    for (let key in properties) {
        createPropertyEntry(key, properties[key]);
    }

}

async function load(file_path){
    await viewer.IFC.setWasmPath("wasm/")
    const model = await viewer.IFC.loadIfcUrl(file_path);
    await viewer.shadowDropper.renderShadow(model.modelID);
    viewer.context.renderer.postProduction.active = true;
}

const file_path = "ifc_files/01.ifc";
// load(file_path);

// Loading with file-input picker 
const input = document.getElementById("file-input");

input.addEventListener("change", async () => {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    load(url);
})

function createPropertyEntry(key, value) {
    const propContainer = document.createElement("div");
    propContainer.classList.add("ifc-property-item");

    if(value === null || value === undefined) value = "undefined";
    else if(value.value) value = value.value;

    const keyElement = document.createElement("div");
    keyElement.textContent = key;
    propContainer.appendChild(keyElement);

    const valueElement = document.createElement("div");
    valueElement.classList.add("ifc-property-value");
    valueElement.textContent = value;
    propContainer.appendChild(valueElement);

    propsGUI.appendChild(propContainer);
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}