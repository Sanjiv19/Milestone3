function getGravatarUrl(email) {
  const trimmedEmail = email.trim().toLowerCase();
  const emailHash = md5(trimmedEmail);
  console.log('MD5 Hash:', emailHash); 
  return `https://www.gravatar.com/avatar/${emailHash}`;
}

function md5(string) {
  return CryptoJS.MD5(string).toString(CryptoJS.enc.Hex); // Ensure the hash is in hexadecimal format
}

var client;

init();

async function init() {
  try {
    client = await app.initialized();
    client.events.on('app.activated', renderText);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

async function renderText() {
  try {
    const textElement = document.getElementById('apptext');
    const contactData = await client.data.get('contact');
    console.log('Contact Data:', contactData);

    let email = '';
    if (contactData && contactData.contact && contactData.contact.email) {
      email = contactData.contact.email;
    } else if (contactData && contactData.agents && contactData.agents[0] && contactData.agents[0].subText) {
      email = contactData.agents[0].subText;
    }

    console.log('Extracted Email:', email);

    if (email) {
      const gravatarUrl = getGravatarUrl(email);

      console.log('Gravatar URL:', gravatarUrl);

      const imgElement = document.createElement('img');
      imgElement.src = gravatarUrl;
      imgElement.alt = 'User Gravatar';
      imgElement.width = 100;
      imgElement.height = 100;

      const appContainer = document.getElementById('app-container');
      appContainer.innerHTML = ''; // Clear any existing content before adding the new image
      appContainer.appendChild(imgElement);
    } else {
      console.warn('No valid email found for the contact.');
    }
  } catch (error) {
    console.error('Error rendering text:', error);
  }
}




function md5(string) {
  return CryptoJS.MD5(string).toString();
}
