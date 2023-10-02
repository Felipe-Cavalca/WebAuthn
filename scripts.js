// classe para somular o servidor
class Servidor {

};

var Server = new Servidor();
let email;
let credential;
let ramdom = "12345";

async function register() {
    debugger;
    email = document.getElementById('email').value;

    // Create options for the new credential
    let options = {
        challenge: new Uint8Array([ramdom]),
        rp: {
            name: "Example RP"
        },
        user: {
            id: new Uint8Array([ramdom]),
            name: email,
            displayName: email
        },
        pubKeyCredParams: [
            {
                type: "public-key",
                alg: -7  // "ES256" IANA COSE Algorithm identifier
            },
            {
                type: "public-key",
                alg: -257 // "RS256" IANA COSE Algorithm identifier
            }
        ]
    };

    // Create a new credential
    credential = await navigator.credentials.create({ publicKey: options });

    // Store the credential in server
    Server.credential = credential;
}

async function login() {
    debugger;
    let email = document.getElementById('email').value;

    // Get the stored credential from server
    let storedCredential = Server.credential;

    // Create options for the assertion
    let options = {
        challenge: new Uint8Array([ramdom]),
        allowCredentials: [
            {
                id: storedCredential.rawId,
                type: "public-key",
                transports: ['usb', 'ble', 'nfc', 'internal'],
            }
        ]
    };

    // Get an assertion from the authenticator
    let assertion = await navigator.credentials.get({ publicKey: options });

    // In a real-world scenario, you would send the assertion response to your server
    // and verify it against the original credential data there.

    // Since this is a client-side only proof of concept, we'll compare the credential ID instead.
    if (assertion.id === storedCredential.id) {
        alert("Login successful");
    } else {
        alert("Login failed");
    }
}
