export class Message extends HTMLElement {
  constructor(
    public message: string,
    public sender: string,
    public isLocal: boolean,
    public isLastSender: boolean
  ) {
    super();
  }

  renderMessage = (): HTMLElement => {
    const newMessage = document.createElement('div');
    newMessage.classList.add(this.isLocal ? 'right' : 'left');
    newMessage.classList.add('message-box');
    newMessage.innerHTML = `
    <link rel="stylesheet" href="../../styles/chatGroup.css">
    <div class="friend-msg ${this.isLocal ? 'right' : 'left'}">
        ${
          this.isLastSender
            ? ''
            : `<div class='message-sender'>${this.sender}</div>`
        }
        <div class="message-content">${this.message}</div>
    </div>
    `;
    this.appendChild(newMessage);
    return this;
  };
}

customElements.define('x-message', Message);
