import { changeUserDetails } from '../api';
import { CollapsingComponent } from './CollapsingComponent';
import { PopupMessage } from './PopupMessage';

export class UserSettings extends CollapsingComponent {
  innerContent = `
        <div class="settings">
            <div class="setting-row">
                <h3>Language:</h3>
                <fieldset id="language">
                <label class="setting-label" for="english">English</label>
                <input type="radio" name="language" value="english" id="english"/>
                <label class="setting-label" for="japanese">Japanese</label>
                <input type="radio" name="language" value="japanese" id="japanese"/>
                </fieldset>
            </div>
            <div class="separator"></div>
            <div class="setting-row">
                <h3>Change Username</h3>
                <input type="text" id="username"/>
            </div>
            <div class="separator"></div>
            <div class="setting-row">
                <h3>Change Password</h3>
                <input type="password" id="passw"/>
                </div>
                <button class="popup-button" id="changeDetails">Confirm</button>
        </div>`;

  usernameInput: HTMLInputElement | null = null;
  passwordInput: HTMLInputElement | null = null;
  constructor() {
    super('Settings', 'bottom-right', () => {
      this.setup();
    });
  }

  setup = (): void => {
    this.getByIdAndBind('english', 'change', (e) => this.changeLanguage(e));
    this.getByIdAndBind('japanese', 'change', (e) => this.changeLanguage(e));

    this.usernameInput = this.getById('username') as HTMLInputElement;
    this.passwordInput = this.getById('passw') as HTMLInputElement;

    this.getByIdAndBind('changeDetails', 'click', () => this.changeDetails());
  };

  changeLanguage = (e: Event): void => {
    const element = e.currentTarget as HTMLInputElement;
  };

  changeDetails = (): void => {
    if (this.usernameInput && this.passwordInput) {
      if (this.usernameInput.value === '' && this.passwordInput.value === '') {
        new PopupMessage('Please enter your desired username or password.');
        return;
      }
      const result = changeUserDetails(
        this.usernameInput?.value as string,
        this.passwordInput?.value as string
      );

      this.usernameInput.value = '';
      this.passwordInput.value = '';

      result.then((res) => {
        let message = '';

        if (res.data.type === 'username') {
          localStorage.setItem('username', res.data.username);
          message = 'Username';
        } else if (res.data.type === 'password') {
          message = 'Password';
        } else {
          localStorage.setItem('username', res.data.username);
          message = 'Username and password';
        }

        new PopupMessage(`${message} succesfully changed!`);
      });
    }
  };
}

customElements.define('x-settings', UserSettings);
