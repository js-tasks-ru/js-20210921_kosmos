export default class SortableTable {
  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  sortField = null;
  sortOrder = null;

  getTemplate() {
    return `<div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row"></div>
        <div data-element="body" class="sortable-table__body"></div>
      </div>
  `;
  }

  renderHeader() {
    const renderHeaderCeil = (data) => {
      const arrow = `<span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                     </span>`;

      return `
          <div class="sortable-table__cell" data-id="${
            data.id
          }" data-sortable="${data.sortable}" data-order="${
        this.sortField === data.id ? this.sortOrder : ""
      }">
            <span>${data.title}</span>
            ${data.sortable ? arrow : ""}
          </div>`;
    };

    this.subElements.header.innerHTML = `${this.headerConfig
      .map((item) => renderHeaderCeil(item))
      .join("")}`;
  }

  renderBody() {
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

    this.subElements.body.innerHTML = `${this.data
      .map((dataItem) => renderBodyRow(dataItem))
      .join("")}`;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.renderHeader();
    this.renderBody();
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
    this.sortField = field;
    this.sortOrder = value;

    const fieldSortType = this.headerConfig.find(
      (item) => item.id === field
    ).sortType;

    const sortFn = SortableTable.sortFn[fieldSortType][this.sortOrder];

    this.data.sort((a, b) => sortFn(a[field], b[field]));

    this.renderHeader();
    this.renderBody();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  static sortFn = {
    string: {
      asc: (a, b) => a.localeCompare(b, ["ru", "en"], { caseFirst: "upper" }),
      desc: (a, b) => -a.localeCompare(b, ["ru", "en"], { caseFirst: "upper" }),
    },
    number: {
      asc: (a, b) => a - b,
      desc: (a, b) => b - a,
    },
  };
}
