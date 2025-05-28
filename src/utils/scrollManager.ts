// ScrollManager placeholder: Lenis removed
class ScrollManager {
  init() {
    // Optionally, initialize smoother scroll here in the future
  }

  scrollTo(target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) {
    let scrollTarget: number = 0;
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el instanceof HTMLElement) {
        scrollTarget = el.getBoundingClientRect().top + window.pageYOffset;
      }
    } else if (typeof target === "number") {
      scrollTarget = target;
    } else if (target instanceof HTMLElement) {
      scrollTarget = target.getBoundingClientRect().top + window.pageYOffset;
    }
    const offset = options?.offset ?? 0;
    const top = scrollTarget + offset;
    const behavior = options?.immediate ? "auto" : "smooth";
    window.scrollTo({ top, behavior });
  }

  destroy() {
    // No-op: Lenis removed
  }

  stop() {
    // No-op: Lenis removed
  }

  start() {
    // No-op: Lenis removed
  }

  update() {
    // No-op: Lenis removed
  }
}

export const scrollManager = new ScrollManager(); 