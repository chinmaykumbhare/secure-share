use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use rand::RngCore;
use base64::{engine::general_purpose, Engine as _};

#[derive(Serialize, Deserialize)]
struct EncryptedPayload {
    salt: String,
    nonce: String,
    ciphertext: String,
}

fn random_bytes(length: usize) -> Vec<u8> {
    let mut bytes = vec![0u8; length];
    rand::thread_rng().fill_bytes(&mut bytes);
    bytes
}

#[wasm_bindgen]
pub fn create_payload() -> String {
    let salt = random_bytes(16);
    let nonce = random_bytes(12);

    let payload = EncryptedPayload {
        salt: general_purpose::STANDARD.encode(salt),
        nonce: general_purpose::STANDARD.encode(nonce),
        ciphertext: String::new(),
    };

    serde_json::to_string(&payload).unwrap()
}