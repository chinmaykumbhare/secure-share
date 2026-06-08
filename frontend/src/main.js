import "./style.css";

import init, {
encrypt,
decrypt
} from "../wasm/crypto_engine.js";

async function run() {
await init();

document.querySelector("#app").innerHTML = `
    <div class="container">

        <h1>Secure Share</h1>

        <div class="card">

            <h2>Encrypt</h2>

            <textarea
                id="secret"
                rows="6"
                placeholder="Enter secret"
            ></textarea>

            <input
                id="encrypt-password"
                type="password"
                placeholder="Password"
            />

            <button id="encrypt-btn">
                Encrypt
            </button>

            <button id="copy-payload-btn">
                Copy Payload
            </button>

            <button id="copy-link-btn">
                Copy Share Link
            </button>

            <textarea
                id="encrypted-output"
                rows="10"
                readonly
            ></textarea>

        </div>

        <div class="card">

            <h2>Decrypt</h2>

            <textarea
                id="encrypted-input"
                rows="10"
                placeholder="Encrypted payload"
            ></textarea>

            <input
                id="decrypt-password"
                type="password"
                placeholder="Password"
            />

            <button id="decrypt-btn">
                Decrypt
            </button>

            <textarea
                id="decrypted-output"
                rows="6"
                readonly
            ></textarea>

        </div>

        <div id="message"></div>

    </div>
`;

const secret =
    document.getElementById("secret");

const encryptPassword =
    document.getElementById("encrypt-password");

const encryptButton =
    document.getElementById("encrypt-btn");

const encryptedOutput =
    document.getElementById("encrypted-output");

const encryptedInput =
    document.getElementById("encrypted-input");

const decryptPassword =
    document.getElementById("decrypt-password");

const decryptButton =
    document.getElementById("decrypt-btn");

const decryptedOutput =
    document.getElementById("decrypted-output");

const copyPayloadButton =
    document.getElementById("copy-payload-btn");

const copyLinkButton =
    document.getElementById("copy-link-btn");

const message =
    document.getElementById("message");

if (window.location.hash.length > 1) {

    const payload =
        decodeURIComponent(
            window.location.hash.substring(1)
        );

    encryptedInput.value =
        payload;

    encryptedOutput.value =
        payload;
}

encryptButton.addEventListener(
    "click",
    () => {

        try {

            message.textContent = "";

            const result =
                encrypt(
                    secret.value,
                    encryptPassword.value
                );

            encryptedOutput.value =
                result;

        }
        catch (error) {

            message.textContent =
                error.message || error;

        }

    }
);

decryptButton.addEventListener(
    "click",
    () => {

        try {

            message.textContent = "";

            const result =
                decrypt(
                    encryptedInput.value,
                    decryptPassword.value
                );

            decryptedOutput.value =
                result;

        }
        catch (error) {

            message.textContent =
                error.message || error;

        }

    }
);

copyPayloadButton.addEventListener(
    "click",
    async () => {

        await navigator.clipboard.writeText(
            encryptedOutput.value
        );

        message.textContent =
            "Payload copied";
    }
);

copyLinkButton.addEventListener(
    "click",
    async () => {

        const url =
            window.location.origin +
            "/#" +
            encodeURIComponent(
                encryptedOutput.value
            );

        await navigator.clipboard.writeText(
            url
        );

        message.textContent =
            "Share link copied";
    }
);

}

run();
