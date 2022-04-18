interface Templates {
  [key: string]: string;
}

const invitePlayer = `
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/menuWindow.css">
    <div class="menu-window">
        <h1 class="-message">Invite a player!</h1>
        <input type="text" id="playerName">
        <button class="base-button" id="inviteButton">Invite</button>
    </div>
`;

const invitation = `
  <link rel="stylesheet" href="../../menu.css">
  <link rel="stylesheet" href="../../styles/menuWindow.css">
  <div class="popup flex-column-center">
  <h2 id="message"></h2>
    <button class="base-button" id="accept">Accept</button>
    <button class="base-button" id="reject">Reject</button>
  </div>
  `;

const inviteWait = `
  <link rel="stylesheet" href="../../menu.css">
  <link rel="stylesheet" href="../../styles/menuWindow.css">
  <div class="menu-window">
    <h2 class="popup-message">Waiting for response, will automatically cancel after 30 seconds</h2>
    <button class="base-button" id="cancel">Cancel</button>
  </div>
`;

const chooseColour = `
<link rel="stylesheet" href="../../menu.css">
<link rel="stylesheet" href="../../styles/menuWindow.css">

  <div class="light-bg flex-column-center">
      <div class="colour-select flex-row centered">
        <div class="black-square flex-row centered">
          <div id="is-white" class="whites-piece select">
          </div>
        </div>
        <div class="white-square flex-row centered"></div>
      </div>
      <div class="colour-select flex-row centered">
        <div class="white-square flex-row centered"></div>
        <div class="black-square flex-row centered">
          <div id="is-black" class="blacks-piece select">
          </div>
        </div>
      </div>
  </div>
`;

const waitForChoice = `
<link rel="stylesheet" href="../../menu.css">
<link rel="stylesheet" href="../../styles/menuWindow.css">
<h5>Please wait a moment!</h5>
`;

const templates: Templates = {
  invitePlayer,
  invitation,
  inviteWait,
  chooseColour,
  waitForChoice,
};

export const getTemplate = (tmplName: string) => {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = templates[tmplName];
  return tmpl.content.cloneNode(true);
};

export const getColourSelection = (title: string, tmpl: string): Node => {
  const template = document.createElement('template');

  template.innerHTML = `
  <link rel="stylesheet" href="../../menu.css">
  <link rel="stylesheet" href="../../styles/menuWindow.css">
  <div class="menu-window">
      <h2 class="popup-message" id="colour-heading">${title}</h2>
      ${templates[tmpl]}
  </div>
  `;
  return template.content.cloneNode(true);
};
