function getGravatarUrl(email) {
  const trimmedEmail = email.trim().toLowerCase();
  const emailHash = CryptoJS.MD5(trimmedEmail).toString(CryptoJS.enc.Hex);
  return `https://www.gravatar.com/avatar/${emailHash}`;
}

var client;

init();

async function init() {
  try {
    client = await app.initialized();
    client.events.on('app.activated', renderContent);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

async function renderContent() {
  try {
    const contactData = await client.data.get('contact');
    const email = contactData.contact ? contactData.contact.email : '';
    const name = contactData.contact ? contactData.contact.name : 'Unknown';

    // Render Gravatar section
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

    // Render Contact Details section
    document.getElementById('contact-name').innerText = name;
    document.getElementById('contact-email').innerText = email;

    // Initialize with the Gravatar view active
    showView('gravatar-view', 'contact-details-button');

  } catch (error) {
    console.error('Error rendering content:', error);
  }
}

function showView(viewIdToShow, buttonToShowId) {
  // Hide all views
  const views = document.querySelectorAll('.view');
  views.forEach(view => {
    view.classList.remove('active');
  });

  // Show the selected view
  const activeView = document.getElementById(viewIdToShow);
  if (activeView) {
    activeView.classList.add('active');
  }

  document.querySelectorAll('.tab-button').forEach(button => {
    button.style.display = 'none';
  });
  const buttonToShow = document.getElementById(buttonToShowId);
  if (buttonToShow) {
    buttonToShow.style.display = 'inline-block';
  }
}


