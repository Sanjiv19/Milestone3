function getGravatarUrl(email) {
    const trimmedEmail = email.trim().toLowerCase();
    const emailHash = CryptoJS.MD5(trimmedEmail).toString(CryptoJS.enc.Hex);
    return `https://www.gravatar.com/avatar/${emailHash}`;
}

var client;

init();

async function init() {
    try {
        if (typeof app === 'undefined') {
            throw new Error('Freshdesk SDK is not loaded');
        }
        client = await app.initialized();
        client.events.on('app.activated', renderContent);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

async function renderContent() {
    try {
        if (!client) {
            console.error('Client not initialized');
            return;
        }
        
        const contactData = await client.data.get('contact');
        if (!contactData || !contactData.contact) {
            console.error('Contact data not available');
            return;
        }

        const email = contactData.contact.email || '';
        const name = contactData.contact.name || 'Unknown';

        if (email) {
            const gravatarUrl = getGravatarUrl(email);
            const gravatarElement = document.getElementById('gravatar');
            gravatarElement.src = gravatarUrl;
            gravatarElement.alt = `Gravatar for ${email}`;
            gravatarElement.onload = function() {
                console.log("Gravatar image loaded successfully.");
            };
            gravatarElement.onerror = function() {
                console.error("Failed to load Gravatar image. Check the URL: ", gravatarUrl);
            };
        } else {
            console.warn('No valid email found for Gravatar.');
        }

        document.getElementById('contact-name').innerText = name;
        document.getElementById('contact-email').innerText = email;

        document.querySelector('.tabs').style.display = 'flex';
        showView('gravatar-view', 'contact-details-button');

    } catch (error) {
        console.error('Error rendering content:', error);
    }
}

function showView(viewIdToShow, buttonToShowId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    const activeView = document.getElementById(viewIdToShow);
    if (activeView) {
        activeView.classList.add('active');
    } else {
        console.warn(`View not found: ${viewIdToShow}`);
    }

    document.querySelectorAll('.tab-button').forEach(button => {
        button.style.display = 'none';
    });

    const buttonToShow = document.getElementById(buttonToShowId);
    if (buttonToShow) {
        buttonToShow.style.display = 'inline-block';
    } else {
        console.warn(`Button not found: ${buttonToShowId}`);
    }
}
