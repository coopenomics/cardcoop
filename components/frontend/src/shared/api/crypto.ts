// Функция для расшифровки данных
export const decrypt = async (encryptedData: string, password: string) => {
  const encryptedBytes = new Uint8Array(encryptedData.length / 2);
  for (let i = 0; i < encryptedData.length; i += 2) {
    encryptedBytes[i / 2] = parseInt(encryptedData.substr(i, 2), 16);
  }
  const iv = encryptedBytes.slice(0, 16);
  const cipherText = encryptedBytes.slice(16);
  const passwordBuffer = new TextEncoder().encode(password);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('some-random-salt'), // это временное решение, в будущем посолим
      iterations: 1000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    true,
    ['decrypt']
  );
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    cipherText
  );
  return new TextDecoder().decode(decryptedData);
};

// Функция для шифрования данных
export const encrypt = async (plainText: string, password: string) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const plainTextBuffer = encoder.encode(plainText);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('some-random-salt'), // это временное решение, в будущем посолим
      iterations: 1000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    plainTextBuffer
  );
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  return Array.from(combined)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Хэширование строки в SHA-256
export const hashSHA256 = async (
  message: string | Uint8Array
): Promise<string> => {
  const msgBuffer =
    message instanceof Uint8Array ? message : new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};
