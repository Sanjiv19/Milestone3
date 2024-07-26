const CryptoJS = require('crypto-js');

var client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText);
}

async function renderText() {
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


  const name = contactData.contact ? contactData.contact.name : 'Unknown';
  textElement.innerHTML = `Ticket is created by ${name}`;

  if (email) {
    const gravatarUrl = getGravatarUrl(email);

    console.log('Gravatar URL:', gravatarUrl);

    const imgElement = document.createElement('img');
    imgElement.src = gravatarUrl;
    imgElement.alt = 'User Gravatar';
    imgElement.width = 100;
    imgElement.height = 100;

    const appContainer = document.getElementById('app-container');
    appContainer.appendChild(imgElement);
  } else {
    console.warn('No valid email found for the contact.');
  }
}

function getGravatarUrl(email) {
  const trimmedEmail = email.trim().toLowerCase();
  const emailHash = md5(trimmedEmail);
  console.log('MD5 Hash:', emailHash); 
  return `https://www.gravatar.com/avatar/${emailHash}`;
}


function md5(string) {
  return CryptoJS.MD5(string).toString();
}
