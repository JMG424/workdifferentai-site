(function () {
  var form = document.getElementById("inquire");
  var error = document.getElementById("form-error");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = (form.elements.name.value || "").trim();
    var email = (form.elements.email.value || "").trim();
    var work = (form.elements.work.value || "").trim();

    if (!work) {
      error.hidden = false;
      form.elements.work.focus();
      return;
    }

    error.hidden = true;
    var lines = ["Hi Jason,", "", work];
    if (name || email) {
      lines.push("");
      if (name) lines.push("Name: " + name);
      if (email) lines.push("Email: " + email);
    }

    var href =
      "mailto:jason@meta57.xyz" +
      "?subject=" + encodeURIComponent("Work Different AI — inquiry") +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = href;
  });
})();
