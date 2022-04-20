interface Component {
  render: (template: string) => void;
}

export class BaseComponent extends HTMLElement implements Component {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.style.display = 'hidden';
  }
  render = (template: string): void => {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = template;
    this.shadowRoot?.appendChild(tmpl.content.cloneNode(true));
  };

  getById = (id: string): HTMLElement | undefined | null => {
    return this.shadowRoot?.getElementById(id);
  };

  getByIdAndBind = (
    id: string,
    eventType: string,
    callback: (e: Event) => void
  ): void => {
    const element = this.shadowRoot?.getElementById(id);
    if (element) {
      element.addEventListener(eventType, (e) => callback(e));
    }
  };
}
