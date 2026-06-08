import init, { create_payload } from "../wasm/crypto_engine.js";

async function run() {
    await init();

    const payload = create_payload();

    document.querySelector("#app").innerHTML = `
        <pre>${payload}</pre>
    `;
}

run();