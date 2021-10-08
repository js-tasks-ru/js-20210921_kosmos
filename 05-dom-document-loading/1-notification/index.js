export default class NotificationMessage {
  constructor(message = "", { duration = 2000, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.show();
  }

  timeout;

  get loading() {
    return this.data.length === 0;
  }

  getTemplate() {
    return `
        <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>`;
  }

  show(root) {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();

    if (NotificationMessage.instance) {
      NotificationMessage.instance.destroy();
    }
    this.element = element.firstElementChild;

    if (root) {
      root.append(this.element);
    }

    NotificationMessage.instance = this;

    this.timeout = setTimeout(() => {
      this.element.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timeout);
    NotificationMessage.instance = null;
  }
}
