export default class SortableTable {
  static sortFn = {
    string: (a, b) => a.localeCompare(b, ["ru", "en"], { caseFirst: "upper" }),
    number: (a, b) => a - b,
  };

  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTemplate() {
    return `<div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row"></div>
        <div data-element="body" class="sortable-table__body"></div>
      </div>
  `;
  }

  renderHeader(sortField, sortOrder) {
    const renderHeaderCeil = (data) => {
      const order = sortField === data.id ? sortOrder : "";

      const arrowTpl = `<span data-element="arrow" class="sortable-table__sort-arrow">
                          <span class="sort-arrow"></span>
                        </span>`;

      return `
          <div class="sortable-table__cell"
            data-id="${data.id}"
            data-sortable="${data.sortable}"
            data-order="${order}">
            <span>${data.title}</span>
            ${data.sortable ? arrowTpl : ""}
          </div>`;
    };

    this.subElements.header.innerHTML = `${this.headerConfig
      .map((item) => renderHeaderCeil(item))
      .join("")}`;
  }

  renderBody(bodyData) {
    const renderBodyRow = (data) => {
      return `
      <a href="/products/dvd/${data.id}" class="sortable-table__row">
        ${this.headerConfig
          .map(
            ({ id, template }) =>
              `<div class="sortable-table__cell">${
                template ? template(data[id]) : data[id]
              }</div>`
          )
          .join("")}
      </a>`;
    };

    this.subElements.body.innerHTML = `${bodyData
      .map((dataItem) => renderBodyRow(dataItem))
      .join("")}`;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.renderHeader();
    this.renderBody(this.data);
  }

  getSubElements(element) {
    const subElements = element.querySelectorAll("[data-element]");

    const result = {};
    for (const subElement of subElements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }
  sort(field, value) {
    const fieldSortType = this.headerConfig.find(
      (item) => item.id === field
    ).sortType;

    const sortFn = SortableTable.sortFn[fieldSortType];

    const sortedData = [...this.data].sort(
      (a, b) => (value === "asc" ? 1 : -1) * sortFn(a[field], b[field])
    );

    this.renderHeader(field, value);
    this.renderBody(sortedData);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
