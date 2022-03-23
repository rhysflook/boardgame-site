export class Message extends HTMLElement {
  constructor(
    public message: string,
    public sender: string,
    public isLocal: boolean
  ) {
    super();
  }

  renderMessage = (): HTMLElement => {
    const newMessage = document.createElement('div');
    newMessage.classList.add(this.isLocal ? 'right' : 'left');
    newMessage.classList.add('message-box');
    newMessage.innerHTML = `
        <p class="message-sender">${this.sender}</p>
        <p class="message-content">${this.message}</p>
    `;
    this.appendChild(newMessage);
    return this;
  };
}

customElements.define('x-message', Message);
