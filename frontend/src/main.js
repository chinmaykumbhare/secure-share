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

                <label>Secret</label>

                <textarea
                    id="secret"
                    rows="6"
                ></textarea>

                <label>Password</label>

                <input
                    id="encrypt-password"
                    type="password"
                />

                <button id="encrypt-btn">
                    Encrypt
                </button>

                <button id="copy-btn">
                    Copy Result
                </button>

                <textarea
                    id="encrypted-output"
                    rows="10"
                    readonly
                ></textarea>

            </div>

            <div class="card">

                <h2>Decrypt</h2>

                <label>Encrypted Payload</label>

                <textarea
                    id="encrypted-input"
                    rows="10"
                ></textarea>

                <label>Password</label>

                <input
                    id="decrypt-password"
                    type="password"
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

            <div
                id="message"
                class="error"
            ></div>

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

    const copyButton =
        document.getElementById("copy-btn");

    const message =
        document.getElementById("message");

    encryptButton.addEventListener(
        "click",
        () => {

            message.textContent = "";

            try {

                if (
                    encryptPassword.value.trim() === ""
                ) {
                    throw new Error(
                        "Password is required"
                    );
                }

                const result = encrypt(
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

            message.textContent = "";

            try {

                if (
                    decryptPassword.value.trim() === ""
                ) {
                    throw new Error(
                        "Password is required"
                    );
                }

                const result = decrypt(
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

    copyButton.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    encryptedOutput.value
                );

                message.className =
                    "success";

                message.textContent =
                    "Copied to clipboard";

                setTimeout(() => {

                    message.className =
                        "error";

                    message.textContent = "";

                }, 2000);

            }
            catch {

                message.textContent =
                    "Failed to copy";

            }

        }
    );
}

run();