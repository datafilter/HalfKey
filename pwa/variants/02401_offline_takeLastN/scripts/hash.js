const digestMessage = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                             // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);             // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const combineHash = async (salt, pepper, size) => {
    const saltHash = await digestMessage(salt)
    const pepperHash = await digestMessage(pepper)
    const hashHash = await digestMessage(saltHash + pepperHash)
    return hashHash.substring(hashHash.length - size)
}

export { combineHash }