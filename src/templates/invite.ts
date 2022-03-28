interface Templates {
  [key: string]: string;
}

const invitePlayer = `
    <link rel="stylesheet" href="../../menu.css">
    <div class="invite-menu">
        <h1 class="popup-message">Invite a player!</h1>
        <input type="text" id="playerName">
        <button class="popup-button" id="inviteButton">Invite</button>
    </div>
`;

const invitation = `
  <link rel="stylesheet" href="../../menu.css">
  <div class="popup">
  <h2 id="message"></h2>
    <button class="popup-button" id="accept">Accept</button>
    <button class="popup-button" id="reject">Reject</button>
  </div>
  `;

const inviteWait = `
  <link rel="stylesheet" href="../../menu.css">
  <div class="invite-menu">
    <h2 class="popup-message">Waiting for response, will automatically cancel after 30 seconds</h2>
    <button class="popup-button" id="cancel">Cancel</button>
  </div>
`;

const chooseColour = `
  <div class="light-bg">
      <div class="colour-select">
        <div class="black-square">
          <div id="is-white" class="white select">
          </div>
        </div>
        <div class="white-square"></div>
      </div>
      <div class="colour-select">
        <div class="white-square"></div>
        <div class="black-square">
          <div id="is-black" class="black select">
          </div>
        </div>
      </div>
  </div>
`;

const chatBox = `
  <link rel="stylesheet" href="../../menu.css">
  <div id="chat-box">
      <div id="messages"></div>
      <div id="type-area">
      <div id="type-input">
        <textarea id="new-message"></textarea>
        <button id="send-message" class="popup-button">^</button>
      </div>
      </div>
  </div>
`;

const playerCard = `
  <link rel="stylesheet" href="../../menu.css">
  <div id="card" class="player-info">
    <div class="player-card-right">
      <h2 id="username"></h2>
      <div class="black-square light-bg">
      <div id="colour" class="select"></div></div>
    </div>
    <div id="captures"></div>
  </div>
`;

const waitForChoice = `
<link rel="stylesheet" href="../../menu.css">
<h5>Please wait a moment!</h5>
`;

const templates: Templates = {
  invitePlayer,
  invitation,
  inviteWait,
  chooseColour,
  chatBox,
  playerCard,
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
  <div class="invite-menu">
      <h2 class="popup-message" id="colour-heading">${title}</h2>
      ${templates[tmpl]}
  </div>
  `;
  return template.content.cloneNode(true);
};
