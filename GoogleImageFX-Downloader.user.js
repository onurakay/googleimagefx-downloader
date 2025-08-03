// ==UserScript==
// @name         Google Image FX Automation
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automates prompt copying, seed extraction, image downloading, and JSON saving on Google Image FX.
// @author
// @match        https://labs.google/fx/tools/image-fx
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let generatedID = "";

    // Function to generate a unique ID using timestamp and random characters
function generateUniqueID() {
    let now = new Date();

    let timestamp = [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0'),
        now.getDate().toString().padStart(2, '0'),
        (now.getMonth() + 1).toString().padStart(2, '0'),
        now.getFullYear() // YYYY
    ].join('');

    let randomID = Math.random().toString(36).substr(2, 5); // 5 random lowercase letters

    return timestamp + randomID;
}


    // Function to click the button and retrieve the copied prompt from the clipboard
    function clickButtonAndGetPrompt() {
        let targetDiv = document.querySelector("div.sc-2b6ef9e5-0.fyDfHs.sc-2519865f-0.cWIaav");
        if (targetDiv) {
            let button = targetDiv.querySelector("button");
            if (button) {
                button.click(); // Clicks the button to copy the prompt

                // Wait a short delay and retrieve clipboard contents
                setTimeout(async () => {
                    try {
                        const clipboardText = await navigator.clipboard.readText();
                        window.customPrompt = clipboardText;
                        console.log("Copied prompt:", window.customPrompt);
                    } catch (err) {
                        console.error("Failed to read clipboard:", err);
                    }
                }, 500);
            } else {
                console.log("No button found inside target div.");
            }
        } else {
            console.log("Target div for button not found.");
        }
    }

    // Function to extract the seed value
    function extractSeedValue() {
        let seedInput = document.querySelector("input#imagefx-seed-input");
        if (seedInput) {
            window.seedValue = seedInput.value;
            console.log("Extracted seed value:", window.seedValue);
        } else {
            console.log("Seed input field not found.");
        }
    }

// Function to download all images from the specified div class: sc-f45adf7f-2 kBLNCv
function downloadImages() {
    let targetDivs = document.querySelectorAll(
  "div.sc-d90fd836-2.hAOKDZ, div.sc-d90fd836-2.eSfDyi, div.sc-d90fd836-2.fKeNXo, div.sc-d90fd836-2.fmBYkN, div.sc-d90fd836-2.ddIzvD"
);

    if (targetDivs.length === 0) {
        console.log("No matching parent image divs found.");
        return;
    }

    let imageUrls = [];
    targetDivs.forEach(div => {
        let img = div.querySelector("img");
        if (img && img.src) {
            imageUrls.push(img.src);
        } else {
            let bgStyle = window.getComputedStyle(div).getPropertyValue("background-image");
            if (bgStyle && bgStyle.startsWith("url(")) {
                let imageUrl = bgStyle.slice(5, -2);
                imageUrls.push(imageUrl);
            }
        }
    });

    if (imageUrls.length === 0) {
        console.log("No images found.");
        return;
    }

    generatedID = generateUniqueID(); // Generate a unique ID for the image set
    console.log("Generated ID:", generatedID);

    imageUrls.forEach((imageUrl, index) => {
        let fileName = `imagefx_${generatedID}_${index + 1}.jpg`;
        let a = document.createElement("a");
        a.href = imageUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`Image ${index + 1} download triggered: ${fileName}`);
    });

    // After downloading images, save the JSON metadata
    saveJSONMetadata();
}

    // Function to save metadata as a JSON file with the generatedID name (with prefix)
    function saveJSONMetadata() {
        let jsonData = {
            prompt: window.customPrompt || "Unknown Prompt",
            seed: window.seedValue || "Unknown Seed",
            imageid: generatedID
        };

        let jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        let jsonUrl = URL.createObjectURL(jsonBlob);
        let a = document.createElement("a");
        a.href = jsonUrl;
        // Add the "imagefx_" prefix to the JSON file name
        a.download = `imagefx_${generatedID}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("JSON metadata saved:", jsonData);
    }

    // Function to run all actions
    function performActions() {
        clickButtonAndGetPrompt();
        extractSeedValue();
        setTimeout(downloadImages, 1000); // Delay to ensure images are loaded
    }

    // Function to add a floating button
    function addCustomButton() {
        if (window.location.href === "https://labs.google/fx/tools/image-fx") {
            const btn = document.createElement("button");
            btn.textContent = "Run Script Actions";
            btn.style.position = "fixed";
            btn.style.top = "80px"; // 50px below the original position
            btn.style.right = "40px";
            btn.style.zIndex = "10000";
            btn.style.padding = "10px";
            btn.style.backgroundColor = "rgb(143, 154, 255)"; // Updated color
            btn.style.color = "rgb(37, 41, 75)"; // Updated text color
            btn.style.border = "none";
            btn.style.borderRadius = "5px";
            btn.style.cursor = "pointer";

            btn.addEventListener("click", performActions);
            document.body.appendChild(btn);
        }
    }

    // Wait for the page to load and add the button only if on the correct page
    window.addEventListener("load", function() {
        addCustomButton();
    });
})();
