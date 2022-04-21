import { BaseComponent } from './BaseComponent';

export class CollapsingComponent extends BaseComponent {
  base = `
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles/collapsable.css">
    <div id="collapsable" class="collapsed ${this.customClasses}">
    <button id="showButton" class="base-button toggle-button short">${this.buttonLabel}</button>
    <div id="main" >
    </div>
    </div>
    `;

  innerContent: string = '';
  collapsed: boolean = true;
  constructor(
    public buttonLabel: string,
    public customClasses: string,
    public buttonAction: () => void
  ) {
    super();
    this.render(this.base);
  }

  connectedCallback(): void {
    this.shadowRoot
      ?.getElementById('showButton')
      ?.addEventListener('click', () => {
        this.collapsed = !this.collapsed;
        this.toggleComponent();
      });
  }

  toggleComponent = (): void => {
    const main = this.shadowRoot?.getElementById('main');
    const box = this.getById('collapsable');
    const button = this.getById('showButton');
    if (main) {
      main.innerHTML = this.collapsed ? '' : this.innerContent;
      if (!this.collapsed) {
        if (button) {
          button.innerText = '✕';
        }
        box?.classList.remove('collapsed');
        box?.classList.add('c-open');
        this.buttonAction();
      } else {
        box?.classList.add('collapsed');
        box?.classList.remove('c-open');
        if (button) {
          button.innerText = this.buttonLabel;
        }
      }
    }
  };
}

customElements.define('x-collapsing-element', CollapsingComponent);
