const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const pageTitle = document.getElementById("page-title");
const formSubtitle = document.getElementById("form-subtitle");

function switchForm(formType) {
  const showLogin = formType === "login";

  loginForm.hidden = !showLogin;
  registerForm.hidden = showLogin;

  loginTab.classList.toggle("active", showLogin);
  registerTab.classList.toggle("active", !showLogin);

  loginTab.setAttribute("aria-selected", String(showLogin));
  registerTab.setAttribute("aria-selected", String(!showLogin));

  pageTitle.innerHTML = showLogin
    ? 'Welcome back<span class="accent">.</span>'
    : 'Create your account<span class="accent">.</span>';

  formSubtitle.textContent = showLogin
    ? "Sign in to continue to your account."
    : "Join us and create your account.";

  clearFeedback(loginForm);
  clearFeedback(registerForm);
}

loginTab.addEventListener("click", () => switchForm("login"));
registerTab.addEventListener("click", () => switchForm("register"));

function getErrorElement(input) {
  return document.getElementById(`${input.id}-error`);
}

function showError(input, message) {
  const errorElement = getErrorElement(input);

  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message && input.value.trim() !== "");
  input.setAttribute("aria-invalid", String(Boolean(message)));

  if (errorElement) {
    errorElement.textContent = message;
  }

  return !message;
}

function validateEmail(input) {
  const email = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return showError(input, "Email address is required.");
  }

  if (!emailPattern.test(email)) {
    return showError(input, "Enter a valid email address.");
  }

  return showError(input, "");
}

function validatePassword(input) {
  if (!input.value) {
    return showError(input, "Password is required.");
  }

  if (input.value.length < 8) {
    return showError(input, "Password must be at least 8 characters.");
  }

  return showError(input, "");
}

function validateName(input) {
  if (!input.value.trim()) {
    return showError(input, "Full name is required.");
  }

  if (input.value.trim().length < 2) {
    return showError(input, "Enter at least 2 characters.");
  }

  return showError(input, "");
}

function validateConfirmPassword(input) {
  const password = document.getElementById("register-password");

  if (!input.value) {
    return showError(input, "Please confirm your password.");
  }

  if (input.value !== password.value) {
    return showError(input, "Passwords do not match.");
  }

  return showError(input, "");
}

function clearFeedback(form) {
  const feedback = form.querySelector(".form-feedback");

  if (feedback) {
    feedback.textContent = "";
  }
}

function setFeedback(form, message) {
  const feedback = form.querySelector(".form-feedback");
  feedback.textContent = message;
}

function validateInput(input) {
  switch (input.id) {
    case "login-email":
    case "register-email":
      return validateEmail(input);

    case "login-password":
      return validatePassword(input);

    case "register-password": {
      const passwordIsValid = validatePassword(input);
      const confirmInput = document.getElementById("confirm-password");

      if (confirmInput.value) {
        validateConfirmPassword(confirmInput);
      }

      return passwordIsValid;
    }

    case "register-name":
      return validateName(input);

    case "confirm-password":
      return validateConfirmPassword(input);

    default:
      return true;
  }
}

document.querySelectorAll("form input").forEach((input) => {
  input.addEventListener("input", () => {
    clearFeedback(input.form);

    if (input.dataset.touched === "true") {
      validateInput(input);
    }

    if (
      input.id === "register-password" &&
      document.getElementById("confirm-password").dataset.touched === "true"
    ) {
      validateConfirmPassword(document.getElementById("confirm-password"));
    }
  });

  input.addEventListener("blur", () => {
    input.dataset.touched = "true";
    validateInput(input);
  });
});

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const showPassword = input.type === "password";

    input.type = showPassword ? "text" : "password";
    button.textContent = showPassword ? "Hide" : "Show";
    button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
    button.setAttribute("aria-pressed", String(showPassword));
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  email.dataset.touched = "true";
  password.dataset.touched = "true";

  const emailIsValid = validateEmail(email);
  const passwordIsValid = validatePassword(password);

  if (!emailIsValid || !passwordIsValid) {
    setFeedback(loginForm, "Please correct the highlighted fields.");
    return;
  }

  setFeedback(
    loginForm,
    "Your inputs are valid. Connect a secure backend to sign in."
  );
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("register-name");
  const email = document.getElementById("register-email");
  const password = document.getElementById("register-password");
  const confirmPassword = document.getElementById("confirm-password");

  [name, email, password, confirmPassword].forEach((input) => {
    input.dataset.touched = "true";
  });

  const nameIsValid = validateName(name);
  const emailIsValid = validateEmail(email);
  const passwordIsValid = validatePassword(password);
  const confirmIsValid = validateConfirmPassword(confirmPassword);

  if (
    !nameIsValid ||
    !emailIsValid ||
    !passwordIsValid ||
    !confirmIsValid
  ) {
    setFeedback(registerForm, "Please correct the highlighted fields.");
    return;
  }

  setFeedback(
    registerForm,
    "Your inputs are valid. Connect a secure backend to create an account."
  );
});

switchForm("login");
