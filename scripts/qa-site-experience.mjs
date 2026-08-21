import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evidencePath = join(root, "docs", "qa", "site-experience-latest.json");
const previewPort = 43_220 + (process.pid % 500);
const baseUrl = `http://127.0.0.1:${previewPort}`;
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const sleep = (duration) => new Promise((resolvePromise) => setTimeout(resolvePromise, duration));

async function waitFor(check, label, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }

  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ""}`);
}

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await readFile(candidate);
      return candidate;
    } catch (_) {}
  }
  throw new Error("Chrome/Edge executable not found. Set CHROME_PATH and retry.");
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let sequence = 0;
  const pending = new Map();
  const listeners = new Map();

  const opened = new Promise((resolvePromise, rejectPromise) => {
    socket.addEventListener("open", resolvePromise, { once: true });
    socket.addEventListener("error", () => rejectPromise(new Error("CDP WebSocket failed to open.")), { once: true });
  });

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data));
    if (message.id) {
      const handler = pending.get(message.id);
      pending.delete(message.id);
      if (!handler) return;
      if (message.error) handler.reject(new Error(message.error.message));
      else handler.resolve(message.result);
      return;
    }

    for (const listener of listeners.get(message.method) ?? []) listener(message.params);
  });

  return {
    async send(method, params = {}) {
      await opened;
      const id = ++sequence;
      const response = new Promise((resolvePromise, rejectPromise) => {
        pending.set(id, { resolve: resolvePromise, reject: rejectPromise });
      });
      socket.send(JSON.stringify({ id, method, params }));
      return response;
    },
    on(method, listener) {
      const methodListeners = listeners.get(method) ?? [];
      methodListeners.push(listener);
      listeners.set(method, methodListeners);
    },
    close() {
      socket.close();
    },
  };
}

async function main() {
  const chromePath = await findChrome();
  const chromeProfile = await mkdtemp(join(tmpdir(), "naraka-experience-qa-"));
  const previewLog = [];
  const browserIssues = [];
  const checks = [];
  let preview;
  let chrome;
  let cdp;
  const selectedCheck = process.env.QA_CHECK;

  const record = async (id, run) => {
    if (selectedCheck && selectedCheck !== id) return;
    try {
      const evidence = await run();
      checks.push({ id, status: "pass", evidence });
    } catch (error) {
      checks.push({ id, status: "fail", evidence: { error: error.message } });
    }
  };

  try {
    preview = spawn(
      process.execPath,
      [join(root, "node_modules", "astro", "bin", "astro.mjs"), "preview", "--host", "127.0.0.1", "--port", String(previewPort)],
      { cwd: root, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    preview.stdout.on("data", (data) => previewLog.push(String(data).trim()));
    preview.stderr.on("data", (data) => previewLog.push(String(data).trim()));

    await waitFor(async () => (await fetch(baseUrl)).ok, "Astro preview");

    chrome = spawn(
      chromePath,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--remote-debugging-port=0",
        `--user-data-dir=${chromeProfile}`,
        "--window-size=375,812",
        "about:blank",
      ],
      { windowsHide: true, stdio: "ignore" },
    );

    const devToolsPort = await waitFor(async () => {
      const content = await readFile(join(chromeProfile, "DevToolsActivePort"), "utf8");
      return Number(content.split(/\r?\n/)[0]);
    }, "Chrome DevTools port");
    const targets = await waitFor(async () => {
      const response = await fetch(`http://127.0.0.1:${devToolsPort}/json/list`);
      const items = await response.json();
      return items.find((item) => item.type === "page") ? items : undefined;
    }, "Chrome page target");
    const target = targets.find((item) => item.type === "page");
    cdp = createCdpClient(target.webSocketDebuggerUrl);

    await Promise.all([
      cdp.send("Page.enable"),
      cdp.send("Runtime.enable"),
      cdp.send("Network.enable"),
      cdp.send("Log.enable"),
      cdp.send("Emulation.setDeviceMetricsOverride", {
        width: 375,
        height: 812,
        deviceScaleFactor: 1,
        mobile: true,
      }),
      cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 }),
    ]);

    cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      browserIssues.push({ type: "exception", text: exceptionDetails.text });
    });
    cdp.on("Log.entryAdded", ({ entry }) => {
      if (entry.level === "error") browserIssues.push({ type: "console", text: entry.text });
    });
    cdp.on("Network.responseReceived", ({ response }) => {
      if (response.status >= 400) browserIssues.push({ type: "network", status: response.status, url: response.url });
    });

    const evaluate = async (expression, awaitPromise = false) => {
      const response = await cdp.send("Runtime.evaluate", {
        expression,
        awaitPromise,
        returnByValue: true,
      });
      if (response.exceptionDetails) {
        throw new Error(
          response.exceptionDetails.exception?.description ??
          response.exceptionDetails.exception?.value ??
          response.exceptionDetails.text,
        );
      }
      return response.result.value;
    };

    const navigate = async (path) => {
      await cdp.send("Page.navigate", { url: `${baseUrl}${path}` });
      await waitFor(
        () => evaluate(`location.pathname === ${JSON.stringify(path)} && document.documentElement.classList.contains("site-experience-ready")`),
        path,
      );
    };

    const key = async (value, code = value) => {
      const virtualKeyCodes = { Enter: 13, Escape: 27, Tab: 9 };
      const virtualKeyCode = virtualKeyCodes[value] ?? 0;
      const params = {
        key: value,
        code,
        windowsVirtualKeyCode: virtualKeyCode,
        nativeVirtualKeyCode: virtualKeyCode,
        ...(value === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}),
      };
      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", ...params });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...params });
    };

    const clickAt = async (selector) => {
      const point = await evaluate(`(() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!target) throw new Error(${JSON.stringify(`Missing target: ${selector}`)});
        const rect = target.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
      await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
    };

    const pointerDownOutsidePanel = async () => {
      const point = await evaluate(`(() => {
        const overlay = document.querySelector("[data-menu-overlay]");
        const panel = document.querySelector("[data-menu-panel]");
        if (!overlay || !panel) throw new Error("Missing mobile menu overlay or panel");

        const overlayRect = overlay.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const x = Math.max(overlayRect.left + 8, panelRect.left - 8);
        const y = Math.min(Math.max(overlayRect.top + 8, 80), overlayRect.bottom - 8);
        const hit = document.elementFromPoint(x, y);

        if (hit !== overlay) {
          throw new Error(JSON.stringify({
            message: "No visible overlay hit target outside the open menu panel",
            point: { x, y },
            overlayRect,
            panelRect,
            hit: hit?.outerHTML,
          }));
        }

        return { x, y };
      })()`);
      await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
      return async () => {
        await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
      };
    };

    await navigate("/");

    await record("mobile-layout-and-targets", async () => {
      const evidence = await evaluate(`(() => {
        const selectors = ["[data-menu-toggle]", ".theme-switcher button", ".color-theme-toggle"];
        const sizes = selectors.map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect();
          return { selector, width: rect.width, height: rect.height };
        });
        return { sizes, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      })()`);
      if (evidence.overflow > 0 || evidence.sizes.some(({ width, height }) => width < 44 || height < 44)) {
        throw new Error(JSON.stringify(evidence));
      }
      return evidence;
    });

    await record("menu-keyboard-close-paths", async () => {
      await evaluate('document.querySelector("[data-menu-toggle]").focus()');
      await key("Enter");
      await sleep(120);
      const opened = await evaluate(`(() => {
        const panel = document.querySelector("[data-menu-panel]");
        return {
          expanded: document.querySelector("[data-menu-toggle]").getAttribute("aria-expanded"),
          focusInPanel: panel.contains(document.activeElement),
          inert: panel.inert,
          ariaHidden: panel.getAttribute("aria-hidden"),
          overlayTag: document.querySelector("[data-menu-overlay]").tagName,
          overlayRole: document.querySelector("[data-menu-overlay]").getAttribute("role"),
          overlayTabIndex: document.querySelector("[data-menu-overlay]").tabIndex,
        };
      })()`);
      await key("Enter");
      await sleep(80);
      const closeButton = await evaluate(`(() => {
        const panel = document.querySelector("[data-menu-panel]");
        const toggle = document.querySelector("[data-menu-toggle]");
        return { focusRestored: document.activeElement === toggle, inert: panel.inert, ariaHidden: panel.getAttribute("aria-hidden") };
      })()`);
      await key("Tab", "Tab");
      const tabIsolation = await evaluate(`(() => {
        const panel = document.querySelector("[data-menu-panel]");
        const overlay = document.querySelector("[data-menu-overlay]");
        return { focusInPanel: panel.contains(document.activeElement), focusOnOverlay: document.activeElement === overlay };
      })()`);

      await evaluate('document.querySelector("[data-menu-toggle]").focus()');
      await key("Enter");
      await sleep(80);
      const releaseOverlayPointer = await pointerDownOutsidePanel();
      await sleep(20);
      const overlay = await evaluate(`(() => {
        const panel = document.querySelector("[data-menu-panel]");
        const toggle = document.querySelector("[data-menu-toggle]");
        return {
          focusRestored: document.activeElement === toggle,
          expanded: toggle.getAttribute("aria-expanded"),
          inert: panel.inert,
          ariaHidden: panel.getAttribute("aria-hidden"),
        };
      })()`);
      await releaseOverlayPointer();

      await key("Enter");
      await sleep(80);
      await key("Escape", "Escape");
      await sleep(80);
      const escape = await evaluate('document.activeElement === document.querySelector("[data-menu-toggle]")');
      const evidence = { opened, closeButton, tabIsolation, overlayPointerDown: overlay, escapeFocusRestored: escape };
      if (
        opened.expanded !== "true" || !opened.focusInPanel || opened.inert || opened.ariaHidden !== "false" ||
        !["DIV", "SPAN"].includes(opened.overlayTag) || opened.overlayRole !== null || opened.overlayTabIndex !== -1 ||
        !closeButton.focusRestored || !closeButton.inert || closeButton.ariaHidden !== "true" ||
        tabIsolation.focusInPanel || tabIsolation.focusOnOverlay || !overlay.focusRestored || overlay.expanded !== "false" || !overlay.inert || overlay.ariaHidden !== "true" || !escape
      ) throw new Error(JSON.stringify(evidence));
      return evidence;
    });

    await record("theme-crossfade-and-persistence", async () => {
      await clickAt("[data-menu-toggle]");
      await sleep(80);
      await clickAt('[data-map-theme-target="huoluo"]');
      await sleep(80);
      const crossfadeMidpoint = await evaluate(`(() => {
        const pictures = [...document.querySelectorAll("[data-map-theme-picture]")].map((item) => ({
          theme: item.dataset.mapThemePicture,
          opacity: getComputedStyle(item).opacity,
          duration: getComputedStyle(item).transitionDuration,
        }));
        return { theme: document.documentElement.dataset.mapTheme, pictures };
      })()`);
      await sleep(620);
      const crossfade = await evaluate(`(() => {
        const pictures = [...document.querySelectorAll("[data-map-theme-picture]")].map((item) => ({
          theme: item.dataset.mapThemePicture,
          opacity: getComputedStyle(item).opacity,
          duration: getComputedStyle(item).transitionDuration,
        }));
        const layers = [...document.querySelectorAll("[data-theme-copy-layer]")].map((item) => ({
          theme: item.dataset.themeCopyLayer,
          hidden: item.getAttribute("aria-hidden"),
          titleOpacity: getComputedStyle(item.querySelector("[data-theme-title-layer]")).opacity,
          descriptionDelay: getComputedStyle(item.querySelector("[data-theme-description-layer]")).transitionDelay,
        }));
        const pressedByGroup = [...document.querySelectorAll('[aria-label="地图主题切换"]')].map((group) =>
          group.querySelectorAll('[aria-pressed="true"]').length
        );
        return { theme: document.documentElement.dataset.mapTheme, pictures, layers, pressedByGroup };
      })()`);
      await clickAt('[data-map-theme-target="longyin"]');
      await sleep(80);
      await cdp.send("Page.reload", { ignoreCache: true });
      await waitFor(() => evaluate('document.documentElement.classList.contains("site-experience-ready")'), "theme reload");
      const persisted = await evaluate(`({
        theme: document.documentElement.dataset.mapTheme,
        pressedByGroup: [...document.querySelectorAll('[aria-label="地图主题切换"]')].map((group) => group.querySelectorAll('[aria-pressed="true"]').length)
      })`);
      const activePicture = crossfade.pictures.find(({ theme }) => theme === "huoluo");
      const inactivePictures = crossfade.pictures.filter(({ theme }) => theme !== "huoluo");
      const activeLayer = crossfade.layers.find(({ theme }) => theme === "huoluo");
      const midpointActive = Number(crossfadeMidpoint.pictures.find(({ theme }) => theme === "huoluo")?.opacity);
      const midpointPrevious = Number(crossfadeMidpoint.pictures.find(({ theme }) => theme === "juku")?.opacity);
      if (
        midpointActive <= 0 || midpointActive >= 1 || midpointPrevious <= 0 || midpointPrevious >= 1 ||
        crossfade.theme !== "huoluo" || activePicture?.opacity !== "1" || inactivePictures.some(({ opacity }) => opacity !== "0") ||
        !activePicture?.duration.includes("0.62") || activeLayer?.hidden !== "false" || activeLayer?.titleOpacity !== "1" ||
        crossfade.pressedByGroup.some((value) => value !== 1) || persisted.theme !== "longyin" || persisted.pressedByGroup.some((value) => value !== 1)
      ) throw new Error(JSON.stringify({ crossfadeMidpoint, crossfade, persisted }));
      return { crossfadeMidpoint, crossfade, persisted };
    });

    await record("astro-page-transition", async () => {
      const evidence = await evaluate(`new Promise((resolve) => {
        document.querySelector('.nav-links a[href$="/menu/"]').click();
        setTimeout(() => resolve({
          path: location.pathname,
          animations: document.getAnimations().map((animation) => ({
            name: animation.animationName || animation.effect?.getKeyframes?.()[0]?.easing || "unknown",
            playState: animation.playState,
          }))
        }), 100);
      })`, true);
      await waitFor(() => evaluate('location.pathname === "/menu/" && document.documentElement.classList.contains("site-experience-ready")'), "Astro menu transition");
      if (evidence.path !== "/menu/" || evidence.animations.length === 0) throw new Error(JSON.stringify(evidence));
      return evidence;
    });

    await record("hidden-theme-reveal", async () => {
      await evaluate(`localStorage.setItem("naraka-restaurant-map-theme", "juku")`);
      await cdp.send("Page.reload", { ignoreCache: true });
      await waitFor(() => evaluate('document.documentElement.classList.contains("site-experience-ready")'), "menu reload");
      await clickAt('[aria-label="菜单主题切换"] [data-map-theme-target="huoluo"]');
      await evaluate('document.querySelector(\'[data-theme-section="huoluo"]\').scrollIntoView({ block: "center" })');
      await waitFor(() => evaluate('document.querySelector(\'[data-theme-section="huoluo"]\').classList.contains("is-revealed")'), "revealed 火罗国 section");
      const evidence = await evaluate(`(() => {
        const section = document.querySelector('[data-theme-section="huoluo"]');
        return {
          hidden: section.classList.contains("is-hidden"),
          revealed: section.classList.contains("is-revealed"),
          nestedRevealCount: section.querySelectorAll("[data-reveal]").length,
          observerRoots: document.querySelectorAll("[data-theme-section][data-reveal]").length,
        };
      })()`);
      if (evidence.hidden || !evidence.revealed || evidence.nestedRevealCount !== 0 || evidence.observerRoots !== 3) {
        throw new Error(JSON.stringify(evidence));
      }
      return evidence;
    });

    await record("coarse-pointer-press-and-reduced-motion", async () => {
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
      await navigate("/");
      const point = await evaluate(`(() => {
        const target = document.querySelector("[data-menu-toggle]");
        const rect = target.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: point.x, y: point.y }] });
      await sleep(50);
      const normal = await evaluate(`({ coarse: matchMedia("(pointer: coarse)").matches, pressed: document.querySelector("[data-menu-toggle]").classList.contains("is-pressed"), transform: getComputedStyle(document.querySelector("[data-menu-toggle]")).transform })`);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
      await cdp.send("Page.reload", { ignoreCache: true });
      await waitFor(() => evaluate('document.documentElement.classList.contains("site-experience-ready")'), "reduced motion reload");
      const reducedPoint = await evaluate(`(() => {
        const target = document.querySelector("[data-menu-toggle]");
        const rect = target.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: reducedPoint.x, y: reducedPoint.y }] });
      const reduced = await evaluate(`({
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
        pressed: document.querySelector("[data-menu-toggle]").classList.contains("is-pressed"),
        transform: getComputedStyle(document.querySelector("[data-menu-toggle]")).transform,
        themeTransition: getComputedStyle(document.querySelector("[data-map-theme-picture]")).transitionDuration,
        revealOpacity: getComputedStyle(document.querySelector("[data-reveal]")).opacity
      })`);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      if (!normal.coarse || !normal.pressed || normal.transform === "none" || !reduced.reduced || !reduced.pressed || reduced.transform !== "none" || reduced.revealOpacity !== "1") {
        throw new Error(JSON.stringify({ normal, reduced }));
      }
      return { normal, reduced };
    });

    await record("browser-errors", async () => {
      if (browserIssues.length > 0) throw new Error(JSON.stringify(browserIssues));
      return { issues: [] };
    });

    const result = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      command: "npm.cmd run qa:experience",
      environment: {
        browser: chromePath,
        viewport: { width: 375, height: 812, mobile: true, touch: true },
        preview: baseUrl,
      },
      summary: {
        status: checks.every(({ status }) => status === "pass") ? "pass" : "fail",
        passed: checks.filter(({ status }) => status === "pass").length,
        failed: checks.filter(({ status }) => status === "fail").length,
      },
      checks,
      previewLog: previewLog.filter(Boolean),
    };

    await mkdir(dirname(evidencePath), { recursive: true });
    await writeFile(evidencePath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    console.log(`Experience QA ${result.summary.status}: ${result.summary.passed} passed, ${result.summary.failed} failed.`);
    console.log(`Evidence: ${evidencePath}`);
    if (result.summary.failed > 0) process.exitCode = 1;
  } finally {
    cdp?.close();
    if (chrome && chrome.exitCode === null) {
      const exited = new Promise((resolvePromise) => chrome.once("exit", resolvePromise));
      chrome.kill();
      await Promise.race([exited, sleep(5_000)]);
    }
    preview?.kill();
    if (chromeProfile.startsWith(tmpdir())) {
      await rm(chromeProfile, { recursive: true, force: true, maxRetries: 6, retryDelay: 250 });
    }
  }
}

await main();
