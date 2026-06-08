use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};

use rand::RngCore;

use base64::{
    engine::general_purpose,
    Engine as _,
};

use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm,
    Nonce,
};

use argon2::Argon2;

#[derive(Serialize, Deserialize)]
struct EncryptedPayload {
    version: u8,
    salt: String,
    nonce: String,
    ciphertext: String,
}

fn random_bytes(length: usize) -> Vec<u8> {
    let mut bytes = vec![0u8; length];
    rand::thread_rng().fill_bytes(&mut bytes);
    bytes
}

fn derive_key(password: &str, salt: &[u8]) -> [u8; 32] {
    let mut key = [0u8; 32];

    Argon2::default()
        .hash_password_into(
            password.as_bytes(),
            salt,
            &mut key,
        )
        .unwrap();

    key
}

#[wasm_bindgen]
pub fn encrypt(
    plaintext: &str,
    password: &str,
) -> Result<String, JsValue> {

    let salt = random_bytes(16);

    let nonce_bytes = random_bytes(12);

    let key = derive_key(
        password,
        &salt,
    );

    let cipher =
        Aes256Gcm::new_from_slice(&key)
            .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let nonce =
        Nonce::from_slice(&nonce_bytes);

    let encrypted = cipher
        .encrypt(
            nonce,
            plaintext.as_bytes(),
        )
        .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let payload = EncryptedPayload {
        version: 1,
        salt: general_purpose::STANDARD.encode(salt),
        nonce: general_purpose::STANDARD.encode(nonce_bytes),
        ciphertext: general_purpose::STANDARD.encode(encrypted),
    };

    serde_json::to_string(&payload)
    .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn decrypt(
    payload_json: &str,
    password: &str,
) -> Result<String, JsValue> {

    let payload: EncryptedPayload =
    serde_json::from_str(payload_json)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    if payload.version != 1 {
    return Err(
        JsValue::from_str(
            "Unsupported payload version"
        )
    );
}

    let salt =
        general_purpose::STANDARD
            .decode(payload.salt)
            .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let nonce_bytes =
        general_purpose::STANDARD
            .decode(payload.nonce)
            .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let ciphertext =
        general_purpose::STANDARD
            .decode(payload.ciphertext)
            .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let key =
        derive_key(
            password,
            &salt,
        );

    let cipher =
        Aes256Gcm::new_from_slice(&key)
            .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    let nonce =
        Nonce::from_slice(&nonce_bytes);

    let plaintext = cipher
        .decrypt(
            nonce,
            ciphertext.as_ref(),
        )
        .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })?;

    String::from_utf8(plaintext)
        .map_err(|_| {
        JsValue::from_str(
            "Invalid password or corrupted data"
        )
    })
}