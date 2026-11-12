/*
 * Masterclass registration.
 *
 * REGISTER_ENDPOINT is the one thing to set before this page is promoted:
 * the URL the sign-up form posts to on the email platform that holds
 * Michelle's list. The field names already match a Kit form
 * (email_address, fields[first_name]), e.g.
 *   https://app.kit.com/forms/<FORM_ID>/subscriptions
 * Any endpoint that accepts a form POST works; rename the two inputs in
 * index.html if the platform expects different field names.
 *
 * While it is empty, the form tells the visitor registration is not open
 * yet instead of pretending they are signed up.
 */
const REGISTER_ENDPOINT = "";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function show(form, text, kind) {
  const msg = form.querySelector("[data-signup-msg]");
  const note = form.querySelector("[data-signup-note]");
  msg.textContent = text;
  msg.dataset.kind = kind;
  msg.hidden = false;
  if (note) note.hidden = true;
}

function validate(form) {
  const name = form.elements["fields[first_name]"];
  const email = form.elements["email_address"];
  if (!name.value.trim()) {
    name.focus();
    return "Please add your first name.";
  }
  if (!email.value.trim() || !email.checkValidity()) {
    email.focus();
    return "Please add a valid email address.";
  }
  return "";
}

async function register(form) {
  const data = new FormData(form);
  // Carry campaign tags through, so list vs. Instagram sign-ups can be told apart.
  const query = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    if (query.get(key)) data.append(`fields[${key}]`, query.get(key));
  });

  const response = await fetch(REGISTER_ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Sign-up failed: ${response.status}`);
}

document.querySelectorAll("[data-signup]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const problem = validate(form);
    if (problem) return show(form, problem, "error");

    if (!REGISTER_ENDPOINT) {
      return show(form, "Registration opens soon. Please check back shortly.", "error");
    }

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Saving your seat…";

    try {
      await register(form);
      form.classList.add("is-done");
      show(form, "You’re in. Check your inbox for the details. See you Monday, November 30.", "ok");
    } catch (error) {
      button.disabled = false;
      button.textContent = "Save my seat";
      show(form, "Something went wrong and you are not registered yet. Please try again.", "error");
    }
  });
});
