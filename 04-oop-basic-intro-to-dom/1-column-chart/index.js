export default class ColumnChart {
  chartHeight = 50;

  constructor(options = {}) {
    this.data = options.data ?? [];
    this.label = options.label ?? "";
    this.value = options.value ?? 0;
    this.link = options.link ?? 0;
    this.formatHeading = options.formatHeading ?? ((data) => `${data}`);

    this.setMaxValue();
    this.render();
  }

  setMaxValue() {
    this.maxValue = Math.max(...this.data);
  }

  get loading() {
    return this.data.length === 0;
  }

  getTemplate() {
    return `
    <div class="column-chart ${
      this.loading ? "column-chart_loading" : ""
    }" style="--chart-height: ${this.chartHeight}">
    <div class="column-chart__title">
      ${this.label}
      <a href="/sales" class="column-chart__link">View all</a>
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">${this.formatHeading(
        this.value
      )}</div>
      <div data-element="body" class="column-chart__chart">
        ${this.renderBody()}
      </div>
    </div>
  </div>
    `;
  }

  renderBody() {
    return ` ${this.data
      .map((val) => {
        const columnProps = this.getColumnProps(val);

        return `<div style="--value:${columnProps.value}" data-tooltip="${columnProps.percent}"></div>`;
      })
      .join("")}`;
  }

  getColumnProps(value) {
    return {
      percent: ((value / this.maxValue) * 100).toFixed(0) + "%",
      value: String(Math.floor((value * this.chartHeight) / this.maxValue)),
    };
  }

  render() {
    const element = document.createElement("div"); // (*)

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  update(data) {
    this.data = [...data];
    this.setMaxValue();

    const bodyEl = this.element.querySelector("[data-element='body']");
    bodyEl.innerHTML = this.renderBody();
  }
}
