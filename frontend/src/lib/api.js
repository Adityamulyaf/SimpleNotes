const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

let csrfTokenCache = "";

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

function summarizeTextPayload(payload) {
  if (typeof payload !== "string") {
    return null;
  }

  const compactText = payload.replace(/\s+/g, " ").trim();

  if (!compactText) {
    return null;
  }

  if (compactText.startsWith("<!DOCTYPE") || compactText.startsWith("<html")) {
    return "Server mengembalikan halaman HTML, bukan JSON. Biasanya ini karena route salah, redirect auth, atau error Laravel.";
  }

  return compactText.slice(0, 180);
}

function buildErrorMessage(response, payload, fallbackMessage) {
  const statusLabel = `${response.status} ${response.statusText}`.trim();

  if (payload && typeof payload === "object" && payload.errors) {
    const validationMessage = Object.values(payload.errors).flat().join(" ");
    return `${statusLabel}: ${validationMessage}`;
  }

  if (payload && typeof payload === "object" && payload.message) {
    return `${statusLabel}: ${payload.message}`;
  }

  const textSummary = summarizeTextPayload(payload);

  if (textSummary) {
    return `${statusLabel}: ${textSummary}`;
  }

  if (response.status === 401) {
    return `${statusLabel}: Belum terautentikasi atau session sudah habis. Coba login lagi.`;
  }

  if (response.status === 403) {
    return `${statusLabel}: Akses ditolak untuk request ini.`;
  }

  if (response.status === 404) {
    return `${statusLabel}: Endpoint tidak ditemukan. Cek URL API dan route backend.`;
  }

  if (response.status === 419) {
    return `${statusLabel}: CSRF token tidak valid atau session sudah expired.`;
  }

  if (response.status >= 500) {
    return `${statusLabel}: Terjadi error di server Laravel.`;
  }

  return `${statusLabel}: ${fallbackMessage}`;
}

async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...restOptions,
    headers: {
      Accept: "application/json",
      ...customHeaders,
    },
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const requestError = new Error(
      buildErrorMessage(response, data, "Request gagal."),
    );

    requestError.status = response.status;
    requestError.data = data;

    throw requestError;
  }

  return data;
}

async function fetchCsrfToken(forceRefresh = false) {
  if (csrfTokenCache && !forceRefresh) {
    return csrfTokenCache;
  }

  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(
      buildErrorMessage(response, data, "Gagal mengambil CSRF token."),
    );
  }

  csrfTokenCache = data.csrf_token;

  return csrfTokenCache;
}

async function apiMutation(path, method, payload) {
  const csrfToken = await fetchCsrfToken();

  return apiRequest(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export function clearCsrfToken() {
  csrfTokenCache = "";
}

export function getCurrentUser() {
  return apiRequest("/user");
}

export function login(payload) {
  return apiMutation("/login", "POST", payload);
}

export function register(payload) {
  return apiMutation("/register", "POST", payload);
}

export function logout() {
  return apiMutation("/logout", "POST");
}

export function fetchNotes() {
  return apiRequest("/notes");
}

export function createNote(payload) {
  return apiMutation("/notes", "POST", payload);
}

export function updateNote(noteId, payload) {
  return apiMutation(`/notes/${noteId}`, "PUT", payload);
}

export function deleteNote(noteId) {
  return apiMutation(`/notes/${noteId}`, "DELETE");
}
