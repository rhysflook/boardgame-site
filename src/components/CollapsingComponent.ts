import { BaseComponent } from './BaseComponent';

export class CollapsingComponent extends BaseComponent {
  base = `
    <link rel="stylesheet" href="../../menu.css">
    <div id="collapsable" class="collapsing ${this.customClasses}">
    <button id="showButton" class="popup-button short corner">${this.buttonLabel}</button>
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
    if (main) {
      main.innerHTML = this.collapsed ? '' : this.innerContent;
      if (!this.collapsed) {
        box?.classList.add('c-open');
        this.buttonAction();
      } else {
        box?.classList.remove('c-open');
      }
    }
  };
}

customElements.define('x-collapsing-element', CollapsingComponent);
