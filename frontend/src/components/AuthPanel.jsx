function AuthPanel({
  authMode,
  authForm,
  error,
  submitting,
  onModeChange,
  onFieldChange,
  onSubmit,
}) {
  return (
    <div className="notes-app">
      <div className="notes-header auth-header">
        <div>
          <h1>
            <span className="dot" />
            SimpleNotes
          </h1>
          <p>Login dulu supaya notes tersimpan sesuai akunmu.</p>
        </div>
        <div className="auth-switch">
          <button
            type="button"
            className={authMode === "login" ? "tab active" : "tab"}
            onClick={() => onModeChange("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={authMode === "register" ? "tab active" : "tab"}
            onClick={() => onModeChange("register")}
          >
            Register
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-card auth-card">
        <div className="form-label">
          {authMode === "login" ? "Masuk ke akun" : "Buat akun baru"}
        </div>

        {authMode === "register" && (
          <input
            type="text"
            placeholder="Nama"
            value={authForm.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(event) => onFieldChange("password", event.target.value)}
          required
        />

        {authMode === "register" && (
          <input
            type="password"
            placeholder="Konfirmasi password"
            value={authForm.password_confirmation}
            onChange={(event) =>
              onFieldChange("password_confirmation", event.target.value)
            }
            required
          />
        )}

        {error && <div className="form-error">{error}</div>}

        <div className="btn-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? "Memproses..."
              : authMode === "login"
                ? "Login"
                : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthPanel;
