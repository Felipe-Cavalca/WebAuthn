// Verifique se o navegador suporta WebAuthn
if (!window.PublicKeyCredential) {
    console.error("Seu navegador não suporta WebAuthn.");
} else {
    console.log("WebAuthn é suportado!");
}

// Simule um servidor que armazena informações de registro de usuário
const fakeServer = {
    users: {},
};

// Função para registrar um usuário
async function registerUser() {
    try {
        const publicKey = await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array([1, 2, 3, 4, 5]), // Desafio gerado pelo servidor
                rp: { id: "sistemalogin.test", name: "Exemplo Corp" },
                user: {
                    id: new Uint8Array([1, 2, 3, 4, 5]), // Identificador exclusivo do usuário
                    name: "usuario@exemplo.com",
                    displayName: "Usuário de Exemplo",
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 }, // ECDSA com P-256
                    { type: "public-key", alg: -35 }, // ECDSA com P-384
                    { type: "public-key", alg: -36 }, // ECDSA com P-521
                    { type: "public-key", alg: -257 },
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "cross-platform", // Prefer autenticadores integrados à plataforma
                    requireResidentKey: true, // Exige autenticadores com chaves residentes
                    userVerification: "preferred", // Exige verificação do usuário durante a autenticação
                },
            },
        });

        const base64RawId = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey.rawId)));
        const base64AttestationObject = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey.response.attestationObject)));
        const base64ClientDataJSON = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey.response.clientDataJSON)));

        const registrationData = {
            id: "usuario@exemplo.com",
            displayName: "Usuário de Exemplo",
            rawId: base64RawId,
            type: publicKey.type,
            attestationObject: base64AttestationObject,
            clientDataJSON: base64ClientDataJSON,
        };

        fakeServer.users[publicKey.id] = registrationData;

        console.log("Usuário registrado com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
    }
}

// Função para autenticar um usuário
async function authenticateUser() {
    try {
        const allowCredentials = Object.values(fakeServer.users).map((user) => ({
            id: user.rawId,
            type: user.type,
        }));

        const publicKey = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array([1, 2, 3, 4, 5]), // Desafio gerado pelo servidor
                allowCredentials,
                userVerification: "preferred", // Pode ser "preferred" se você não quiser exigir verificação do usuário
            },
        });

        console.log("Usuário autenticado com sucesso!");
    } catch (error) {
        console.error("Erro na autenticação do usuário:", error);
    }
}
