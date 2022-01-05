



async function requestToken() {
    const codeVerifier = localStorage.getItem('handle_login_verifier');
    const state = localStorage.getItem('handle_login_state');
    const params = new URLSearchParams(location.href.toString().split("?")[1]);
    if (params.has('code') === false) {
        return false;
    }
    const code = params.get('code');
    const returnedState = params.get('state');
    const redirect = encodeURIComponent('https://testing-genericbells.pages.dev');
    if (returnedState !== state) {
        return false;
    }
    // const requestBody = {
    //     'grant_type': 'authorization_code',
    //     'code': code,
    //     'redirect_uri': redirect,
    //     'client_id': 'genericbellstestingonly',
    //     'code_verifier': codeVerifier
    // }
    const requestBody = (
        code
    );
    const requestURL = (
        "https://student.sbhs.net.au/api/token" +
        "grant_type=authorization_code" +
        "&redirect_uri=" + redirect +
        "&client_id=genericbellstestingonly" +
        "&code_verifier=" + codeVerifier
    );

    console.log(requestURL);
    const tokens = await fetch(requestURL, {method: "POST", body: code});
    console.log(tokens);
    return tokens.json();
}


const data = requestToken();
console.log(data);


document.getElementById("test").onclick = async function requestCode() {
    //generate code verifier 43-128 characters long
    function randomString(length) {
        let randomNumbers = new Uint32Array(length);
        let verifier = "";
        const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        crypto.getRandomValues(randomNumbers);
        for (const i of randomNumbers) {
            verifier += allowedChars.charAt((i % 66));
        }
        return verifier;
    }
    async function digestMessage(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return hash;
    }
    function base64url(input) {
        let hashString = "";
        for (const i of input) {
            hashString += String.fromCharCode(i);
        }
        return btoa(hashString).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
    }
    const codeVerifier = randomString(128);
    const hash = await digestMessage(codeVerifier);
    const viewHash = new Uint8Array(hash);
    const codeChallenge = base64url(viewHash);
    const state = randomString(32);
    localStorage.setItem('handle_login_verifier', codeVerifier);
    localStorage.setItem('handle_login_state', state);
    console.log(codeVerifier);

    const redirect = encodeURIComponent('https://testing-genericbells.pages.dev');

    // generate code challenge from code verifier
    //
    //
    //        "&redirect_uri=https://testing-genericbells.pages.dev"
    // https://student.sbhs.net.au/api/authorize&client_id=genericbellstestingonly
    // &response_type=code&state=DLK1b44s4BWk~ys5holF7Vm7m8Eiy_Re
    // &code_challenge=u2lOoOGYBWoOW46exdRPTX7g0qNUHVE7VS6iUJowCBw
    // &code_challenge_method=S256&scope=all-ro

    const requestURL = (
        "https://student.sbhs.net.au/api/authorize?" +
        "client_id=genericbellstestingonly&" +
        "response_type=code&" +
        "state=" + state + "&" +
        "code_challenge=" + codeChallenge + "&" +
        "code_challenge_method=S256&" +
        "scope=all-ro&" +
        "redirect_uri=" + redirect
    );

    location.assign(requestURL);

};