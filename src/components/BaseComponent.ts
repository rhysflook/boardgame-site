import { convertStyles, Styles } from './styles';

interface Component {
  render: (template: string) => void;
}

const baseStyles: Styles = {
  backgroundColor: 'var(--component-bg-colour)',
  display: 'flex',
  font: 'var(--font)',
  border: '4px var(--fancy-shadow-colour) solid',
  boxShadow:
    '3px 3px 10px var(--fancy-shadow-colour), -3px 3px 10px var(--fancy-shadow-colour)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  padding: '10px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

export class BaseComponent extends HTMLElement implements Component {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    console.log(convertStyles(baseStyles));
  }
  render = (template: string): void => {
    console.log(template);
    const tmpl = document.createElement('template');
    tmpl.innerHTML =
      `<style>.custom-comp ${convertStyles(baseStyles)}</style>` + template;
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
