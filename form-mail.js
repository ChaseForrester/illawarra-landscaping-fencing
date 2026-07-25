/**
 * Shared form email delivery for Illawarra Landscaping & Fencing
 * Sends via FormSubmit to all business inboxes.
 *
 * First-time setup: FormSubmit emails each NEW primary address an activation
 * link. Click "Confirm" in each inbox once so live submissions deliver.
 */
(function (global) {
    const PRIMARY_EMAIL = 'illawarralandscapingandfencing@hotmail.com';
    const CC_EMAILS = [
        'stormychaseforrester@gmail.com',
        'hello@techaidaustralia.com.au',
    ].join(',');

    const ALL_INBOXES = [
        'illawarralandscapingandfencing@hotmail.com',
        'stormychaseforrester@gmail.com',
        'hello@techaidaustralia.com.au',
    ];

    /**
     * @param {Object} fields - plain key/value fields for the email body
     * @param {Object} options
     * @param {string} options.subject
     * @param {string} [options.replyTo]
     * @param {FileList|File[]} [options.files]
     * @returns {Promise<{ok:boolean, message:string, results:any[]}>}
     */
    async function sendFormEmail(fields, options = {}) {
        const subject = options.subject || 'New enquiry — Illawarra Landscaping & Fencing';
        const replyTo = options.replyTo || fields.Email || fields.email || '';
        const files = options.files || null;

        // Primary delivery: business inbox + CC the other two
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            formData.append(key, String(value));
        });
        formData.append('_subject', subject);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('_cc', CC_EMAILS);
        if (replyTo) formData.append('_replyto', replyTo);
        formData.append('_honey', ''); // honeypot (empty = human)

        if (files && files.length) {
            const list = Array.from(files).slice(0, 4);
            list.forEach((file, i) => {
                formData.append(i === 0 ? 'attachment' : `attachment_${i + 1}`, file);
            });
        }

        // Also fan-out lightweight copies so every inbox gets a primary message
        // (FormSubmit CC can be flaky; parallel primaries improve reliability)
        const lightPayload = {
            ...fields,
            _subject: subject,
            _template: 'table',
            _captcha: 'false',
            _replyto: replyTo || undefined,
        };

        const requests = [
            fetch(`https://formsubmit.co/ajax/${PRIMARY_EMAIL}`, {
                method: 'POST',
                body: formData,
            }).then(async (r) => {
                const data = await r.json().catch(() => ({}));
                return { email: PRIMARY_EMAIL, ok: r.ok, status: r.status, data };
            }),
        ];

        // Parallel light copies to the other two (no files — size/rate limits)
        CC_EMAILS.split(',').forEach((email) => {
            requests.push(
                fetch(`https://formsubmit.co/ajax/${email.trim()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(lightPayload),
                }).then(async (r) => {
                    const data = await r.json().catch(() => ({}));
                    return { email: email.trim(), ok: r.ok, status: r.status, data };
                })
            );
        });

        const results = await Promise.allSettled(requests);
        const normalized = results.map((r) =>
            r.status === 'fulfilled' ? r.value : { ok: false, error: String(r.reason) }
        );
        const anyOk = normalized.some((r) => r.ok);
        const needsActivation = normalized.some((r) => {
            const msg = (r.data && (r.data.message || r.data.success)) || '';
            return String(msg).toLowerCase().includes('activation') ||
                String(msg).toLowerCase().includes('activate');
        });

        // FormSubmit returns success:false on first use until the owner clicks Activate.
        // Treat activation responses as a soft success so the UI is not scary.
        if (!anyOk && needsActivation) {
            return {
                ok: true,
                needsActivation: true,
                message:
                    'Almost there — check your email inboxes for a FormSubmit “Activate Form” link and click it once. After activation, submissions will arrive normally.',
                results: normalized,
                inboxes: ALL_INBOXES,
            };
        }

        return {
            ok: anyOk,
            needsActivation: false,
            message: anyOk
                ? 'Enquiry sent successfully.'
                : 'All email deliveries failed. Please call 0456 299 538.',
            results: normalized,
            inboxes: ALL_INBOXES,
        };
    }

    global.ILFFormMail = {
        send: sendFormEmail,
        PRIMARY_EMAIL,
        ALL_INBOXES,
    };
})(window);
