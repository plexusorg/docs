// Progressive enhancement for the reference pages: the ReferenceFilter box, and opening the entry in the URL hash.
// Without this script the references still work: every setting opens with a click, and every anchor resolves.

/** The heading that the page puts directly above a reference section, if there is one. */
function headingBefore(section: Element): HTMLElement | null {
    const previous = section.previousElementSibling;
    return previous instanceof HTMLElement && previous.matches('.sl-heading-wrapper, h2, h3, h4') ? previous : null;
}

function applyFilter(query: string) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const item of document.querySelectorAll<HTMLElement>('[data-ref-item][data-search]')) {
        const text = item.dataset.search ?? '';
        item.hidden = !words.every((word) => text.includes(word));
        if (!item.hidden) {
            shown++;
        }
    }
    for (const section of document.querySelectorAll<HTMLElement>('[data-ref]')) {
        if (!section.querySelector('[data-ref-item][data-search]')) {
            continue;
        }
        section.hidden = section.querySelector('[data-ref-item]:not([hidden])') === null;
        const heading = headingBefore(section);
        if (heading) {
            heading.hidden = section.hidden;
        }
    }
    const empty = document.querySelector<HTMLElement>('[data-ref-empty]');
    if (empty) {
        empty.hidden = shown > 0;
    }
}

function openTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target || !target.closest('[data-ref]')) {
        return;
    }
    const input = document.querySelector<HTMLInputElement>('[data-ref-filter]');
    if (target.closest('[hidden]') && input) {
        input.value = '';
        applyFilter('');
    }
    const details = target.querySelector<HTMLDetailsElement>(':scope > details');
    if (details) {
        details.open = true;
    }
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({block: 'start', behavior: smooth ? 'smooth' : 'auto'});
}

const tools = document.querySelector<HTMLElement>('[data-ref-tools]');
const input = tools?.querySelector<HTMLInputElement>('[data-ref-filter]');
if (tools && input) {
    tools.hidden = false;
    input.addEventListener('input', () => applyFilter(input.value));
}

openTarget();
addEventListener('hashchange', openTarget);
