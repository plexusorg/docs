// One click handler for every permission chip copy button. After a copy, the button shows a check and "Copied" for
// 1.5 seconds, and its label changes to "Copied <node>" for screen readers.
function copied(button, permission) {
    button.setAttribute('data-copied', '');
    button.setAttribute('aria-label', `Copied ${permission}`);
    clearTimeout(button.plexCopyTimer);
    button.plexCopyTimer = setTimeout(() => {
        button.removeAttribute('data-copied');
        button.setAttribute('aria-label', `Copy ${permission}`);
    }, 1500);
}

// Without the Clipboard API (an insecure origin or an old browser), copy through a hidden text area.
function fallbackCopy(button, permission) {
    const area = document.createElement('textarea');
    area.value = permission;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    let ok = false;
    try {
        ok = document.execCommand('copy');
    } catch {
        ok = false;
    }
    area.remove();
    button.focus();
    if (ok) {
        copied(button, permission);
    }
}

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.perm-copy') : null;
    if (!button) {
        return;
    }
    const permission = button.getAttribute('data-permission');
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(permission).then(() => copied(button, permission), () => fallbackCopy(button, permission));
    } else {
        fallbackCopy(button, permission);
    }
});
