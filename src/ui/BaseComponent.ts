interface Component {
  render: (template: string) => void;
}

export class BaseComponent extends HTMLElement implements Component {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }
  render = (template: string): void => {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = template;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
  };
}
