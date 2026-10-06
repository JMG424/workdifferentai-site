/* Ballpark estimator for "What is your data worth?"
   Everything runs in the browser. Nothing is sent anywhere unless the
   visitor chooses to email the summary. Numbers are heuristics, not an offer. */
(function () {
  var form = document.getElementById("estimator");
  if (!form) return;

  var result = document.getElementById("result");
  var rangeEl = document.getElementById("range");
  var noteEl = document.getElementById("range-note");
  var driversEl = document.getElementById("drivers");
  var book = document.getElementById("book");
  var copyBtn = document.getElementById("copy");
  var copied = document.getElementById("copied");

  // Rough annual licence value, in USD, for a mid-sized body of each kind of
  // data: proprietary, rights-cleared, 100k to 1M records, a few years deep.
  var TYPES = {
    crm:        { base: 25000, name: "CRM" },
    accounting: { base: 15000, name: "accounting" },
    email:      { base: 40000, name: "email and documents" },
    support:    { base: 60000, name: "support and call transcripts" },
    ops:        { base: 80000, name: "industry-specific system" },
    media:      { base: 70000, name: "images, video, drawings" },
    sensor:     { base: 30000, name: "machine and sensor logs" }
  };

  var SECTOR = {
    manufacturing: { m: 1.2, name: "Manufacturing, packaging, print" },
    logistics:     { m: 1.1, name: "Logistics, freight, warehousing" },
    construction:  { m: 1.2, name: "Construction, engineering, trades" },
    professional:  { m: 1.15, name: "Professional services" },
    healthcare:    { m: 1.5, name: "Healthcare, clinical, life sciences" },
    finance:       { m: 1.3, name: "Finance, insurance, lending" },
    retail:        { m: 0.9, name: "Retail, hospitality, e-commerce" },
    software:      { m: 1.0, name: "Software, SaaS, agency" },
    other:         { m: 1.0, name: "Other" }
  };

  var VOLUME = {
    small:  { m: 0.5, name: "under 100k" },
    medium: { m: 1.0, name: "100k to 1M" },
    large:  { m: 2.0, name: "1M to 10M" },
    huge:   { m: 3.5, name: "10M or more" }
  };

  var HISTORY = {
    short: { m: 0.6, name: "under 2 years" },
    mid:   { m: 1.0, name: "2 to 5 years" },
    long:  { m: 1.3, name: "5 to 10 years" },
    deep:  { m: 1.6, name: "10 or more years" }
  };

  var UNIQUE = {
    public:      { m: 0.3, name: "mostly public" },
    partial:     { m: 0.8, name: "partly unique" },
    proprietary: { m: 1.4, name: "almost entirely proprietary" }
  };

  var TRAIL = {
    thin: { m: 0.7, name: "thin" },
    some: { m: 1.0, name: "some notes and approvals" },
    rich: { m: 1.6, name: "rich" }
  };

  var RIGHTS = {
    clear:   { m: 1.0, name: "clear" },
    unsure:  { m: 0.7, name: "not confirmed" },
    blocked: { m: 0.25, name: "probably restricted" }
  };

  var FLOOR = 5000;
  var CEILING = 5000000;

  function picked(name) {
    var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]');
    return el ? el.value : null;
  }

  function pickedAll(name) {
    return Array.prototype.map.call(form.querySelectorAll('[name="' + name + '"]:checked'), function (el) {
      return el.value;
    });
  }

  function nice(n) {
    // Round to a figure that reads like a ballpark, not an invoice.
    var step;
    if (n >= 1000000) step = 100000;
    else if (n >= 200000) step = 25000;
    else if (n >= 50000) step = 10000;
    else if (n >= 10000) step = 5000;
    else step = 1000;
    return Math.round(n / step) * step;
  }

  function money(n) {
    if (n >= 1000000) {
      var m = n / 1000000;
      return "$" + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + "M";
    }
    return "$" + Math.round(n / 1000) + "K";
  }

  function estimate() {
    var types = pickedAll("types");
    var sector = SECTOR[picked("sector")] || SECTOR.other;
    var volume = VOLUME[picked("volume")] || VOLUME.medium;
    var history = HISTORY[picked("history")] || HISTORY.mid;
    var unique = UNIQUE[picked("unique")] || UNIQUE.partial;
    var trail = TRAIL[picked("trail")] || TRAIL.some;
    var rights = RIGHTS[picked("rights")] || RIGHTS.unsure;

    var base = 0;
    types.forEach(function (t) {
      if (TYPES[t]) base += TYPES[t].base;
    });

    var mid = base * sector.m * volume.m * history.m * unique.m * trail.m * rights.m;
    var low = Math.max(FLOOR, Math.min(CEILING, nice(mid * 0.5)));
    var high = Math.max(FLOOR, Math.min(CEILING, nice(mid * 2)));
    if (high <= low) high = nice(low * 2);

    return {
      types: types,
      sector: sector,
      volume: volume,
      history: history,
      unique: unique,
      trail: trail,
      rights: rights,
      mid: mid,
      low: low,
      high: high
    };
  }

  function drivers(e) {
    var out = [];
    if (e.types.length === 0) {
      out.push({ cls: "flag", text: "Pick at least one place the data lives. Without that there is nothing to price." });
      return out;
    }
    if (e.rights.m < 1) {
      out.push({ cls: "flag", text: e.rights.m < 0.5
        ? "Rights look restricted. That caps everything. A rights review is the first conversation, not the valuation."
        : "Rights not confirmed. Clearing them is the fastest way to raise this number, and it is usually a contract read, not a rebuild." });
    }
    if (e.trail.m < 1) {
      out.push({ cls: "down", text: "A thin judgment trail. Labs pay for decisions, not just fields. Notes, approvals and corrections can double the value." });
    } else if (e.trail.m > 1) {
      out.push({ cls: "", text: "A rich judgment trail. This is the part the public web does not have." });
    }
    if (e.unique.m < 1) {
      out.push({ cls: "down", text: "Some of this exists elsewhere. The unique slice is what gets priced; the rest is context." });
    } else {
      out.push({ cls: "", text: "Almost entirely proprietary. Scarcity is what labs are paying for right now." });
    }
    if (e.history.m > 1) {
      out.push({ cls: "", text: e.history.name.replace(/^./, function (c) { return c.toUpperCase(); }) + " of history. Longitudinal depth is rare and hard to fake." });
    }
    if (e.types.indexOf("ops") >= 0) {
      out.push({ cls: "", text: "An industry-specific system. The further from generic SaaS, the fewer people have anything like it." });
    }
    if (e.types.indexOf("support") >= 0 || e.types.indexOf("email") >= 0) {
      out.push({ cls: "", text: "Conversations and documents. Natural language with real outcomes attached is the most wanted shape." });
    }
    if (e.volume.m < 1) {
      out.push({ cls: "down", text: "Small volume. Still sellable if it is unique, but it tends to price as a one-off rather than a licence." });
    }
    return out.slice(0, 5);
  }

  function summary(e) {
    var typeNames = e.types.map(function (t) { return TYPES[t] ? TYPES[t].name : t; });
    return [
      "What is our data worth: a ballpark from workdifferentai.com/data-worth/",
      "",
      "Sector: " + e.sector.name,
      "Data lives in: " + (typeNames.length ? typeNames.join(", ") : "not specified"),
      "History: " + e.history.name,
      "Volume: " + e.volume.name,
      "Uniqueness: " + e.unique.name,
      "Judgment trail: " + e.trail.name,
      "Rights: " + e.rights.name,
      "",
      "Ballpark annual licence value: " + money(e.low) + " to " + money(e.high),
      "",
      "A bit about the company and what we have:",
      ""
    ].join("\n");
  }

  function render() {
    var e = estimate();
    var list = drivers(e);

    if (e.types.length === 0) {
      rangeEl.textContent = "—";
      noteEl.textContent = "Nothing to price yet.";
    } else {
      rangeEl.textContent = money(e.low) + " to " + money(e.high);
      noteEl.textContent = e.rights.m < 0.5
        ? "Per year, if the rights can be cleared. Right now they look like the blocker."
        : "Per year, licensed to one or more labs. Treat it as an order of magnitude, not a quote.";
    }

    driversEl.innerHTML = "";
    list.forEach(function (d) {
      var li = document.createElement("li");
      if (d.cls) li.className = d.cls;
      li.textContent = d.text;
      driversEl.appendChild(li);
    });

    var text = summary(e);
    book.href = "mailto:jason@meta57.xyz?subject=" + encodeURIComponent("What is our data worth: " + e.sector.name) + "&body=" + encodeURIComponent(text);
    book.dataset.summary = text;

    result.hidden = false;
    result.classList.remove("is-in");
    void result.offsetWidth;
    result.classList.add("is-in");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    render();
    if (window.matchMedia("(max-width: 900px)").matches) {
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Once a first estimate exists, keep it live as inputs change.
  form.addEventListener("change", function () {
    if (!result.hidden) render();
  });

  copyBtn.addEventListener("click", function () {
    var text = book.dataset.summary || "";
    function done(ok) {
      copied.textContent = ok ? "Copied." : "Select the text and copy it.";
      setTimeout(function () { copied.textContent = ""; }, 2400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });
})();
