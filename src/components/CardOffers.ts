/* eslint-disable @typescript-eslint/ban-ts-comment */
import slugify from 'slugify';
import {
  CardOffersConstructor,
  CardOffersDOM,
  Routes,
  FormattedRoutes,
  SortOptions,
} from '../types';
import {
  list,
  tableDatesBody,
  formOrigins,
  clearOrigins,
  applyButton,
  allOrigins,
  triggerSelect,
  results,
  titleModal,
  selectSort,
} from '../constants';
import {
  breakArrayIntoChunks,
  cutText,
  hideFilterOptionsWrapper,
  showModal,
} from '../utils';

const CHECKBOX_ALL = 'bf-all';
const ALL = 'Todas';

export default class CardOffers {
  private readonly originsTotal: number;
  private originsSelected: number;
  private totalRoutes: number;
  private readonly routes: FormattedRoutes;
  private currentRoutes!: FormattedRoutes;
  private origins: string[];
  private dom!: CardOffersDOM;
  private readonly collator = new Intl.Collator('pt-BR', {
    numeric: true,
    sensitivity: 'base',
  });

  constructor({ routes, origins }: CardOffersConstructor) {
    this.originsSelected = 0;
    this.routes = routes;
    this.origins = origins;
    this.originsTotal = origins.length;
    this.totalRoutes = routes.length;
    this.render();
    this.renderCheckbox();
    this.generateSelectedQuantity(this.totalRoutes);
    this.attachApplyButtonEvents();
  }

  protected updateDOMSelectors(next: Partial<CardOffersDOM>): void {
    this.dom = {
      ...this.dom,
      ...next,
    };
  }

  public setOriginsSelected(currentSelected: number): void {
    this.originsSelected = currentSelected;
  }

  public resetOriginsSelected(): void {
    this.setOriginsSelected(0);
  }

  public selectAllOrigins(): void {
    if (this.originsSelected !== this.originsTotal) {
      this.dom.checkboxes.forEach((input) => (input.checked = true));
      this.setOriginsSelected(this.originsTotal);
      return;
    }
    this.clearCheckboxOptions();
  }

  public toggleApplyButtonEnabling(status: boolean): void {
    if (status) return applyButton?.removeAttribute('disabled');
    applyButton?.setAttribute('disabled', 'true');
  }

  public toggleApplyButtonBySelected(): void {
    if (this.originsSelected > 0) {
      return this.toggleApplyButtonEnabling(true);
    }
    this.toggleApplyButtonEnabling(false);
  }

  public clearCheckboxOptions(): void {
    this.dom.checkboxes.forEach((input) => (input.checked = false));
    this.toggleApplyButtonEnabling(false);
    this.resetOriginsSelected();
  }

  public renderCheckbox(): void {
    this.origins.forEach((origin) => {
      const slug = slugify(origin);
      const output = `
      <label class="bf-label-selector" for="${slug}">
          ${origin}
          <input type="checkbox" value="${origin}" id="${slug}">
          <span></span>
      </label>`;
      formOrigins?.insertAdjacentHTML('beforeend', output);
    });
    this.updateDOMSelectors({
      originSelectors: document.querySelectorAll('#bf-update-origins label'),
      checkboxes: document.querySelectorAll('.bf-label-selector input'),
    });
    clearOrigins?.addEventListener('click', () => {
      this.clearCheckboxOptions();
    });
    this.attachCheckboxEvents();
  }

  public toggleCheckboxAllSelected(): void {
    if (this.originsSelected === this.originsTotal) {
      // @ts-ignore
      allOrigins?.checked = true;
      return;
    }
    // @ts-ignore
    allOrigins?.checked = false;
  }

  public attachCheckboxEvents(): void {
    this.updateDOMSelectors({
      checkboxes: document.querySelectorAll('.bf-label-selector input'),
    });
    this.dom.originSelectors.forEach((selector) => {
      selector.addEventListener('change', () => {
        const item = selector.getAttribute('for') as string;
        const target = document.getElementById(item) as HTMLInputElement;
        const isChecked = target.checked;
        if (item === CHECKBOX_ALL) {
          this.selectAllOrigins();
        } else {
          if (isChecked) {
            this.setOriginsSelected(this.originsSelected + 1);
          } else {
            this.setOriginsSelected(this.originsSelected - 1);
          }
        }
        this.toggleApplyButtonBySelected();
        this.toggleCheckboxAllSelected();
      });
    });
  }

  private generateCurrentState(selected: string[]): void {
    const text =
      selected.length === this.originsTotal
        ? ALL
        : selected.length <= 1
        ? selected[0]
        : `${cutText(selected[0])} + ${selected.length - 1}`;
    // @ts-ignore
    triggerSelect?.innerHTML = text;
  }

  private generateSelectedQuantity(selected: FormattedRoutes | number): void {
    if (typeof selected === 'number') {
      // @ts-ignore
      return (results?.innerHTML = `${selected} ${
        selected === 1 ? 'resultado' : 'resultados'
      }`);
    }
    const text = `${selected.length} ${
      selected.length === 1 ? 'resultado' : 'resultados'
    }`;
    // @ts-ignore
    results?.innerHTML = text;
  }

  public showAllDates(): void {
    this.dom.showAllDatesTriggers.forEach((button) => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-route') as string);
        const selected = this.routes.filter((route) => route.id === id)[0];
        const origin = selected.origin.split('-')[0];
        const destination = selected.destination.split('-')[0];
        // @ts-ignore
        titleModal.innerHTML = `${origin} x ${destination}`;
        // @ts-ignore'
        tableDatesBody.innerHTML = '';

        selected.availableDates.forEach((dates) => {
          const output = `<tr>${dates
            .map(
              (date) =>
                `<td>${date.soldOff ? `<s>${date.date}</s>` : date.date}</td>`,
            )
            .join('')}</tr>`;
          tableDatesBody?.insertAdjacentHTML('beforeend', output);
        });
        showModal();
      });
    });
  }

  public sortItems(type: SortOptions): void {
    if (type === 'default') return this.render(this.currentRoutes, false);
    const compare = [...this.currentRoutes].sort((a, b) => {
      return this.collator.compare(a.price, b.price);
    });
    const sorted = type === 'price-lower' ? compare : compare.reverse();
    this.render(sorted, false);
  }

  public saveItems(): void {
    this.updateDOMSelectors({
      selectedCheckbox: document.querySelectorAll(
        '.bf-label-selector input:checked',
      ),
    });
    const selected = Array.from(this.dom.selectedCheckbox)
      .filter((input) => input.getAttribute('id') !== CHECKBOX_ALL)
      .map((input) => input.value);
    const cards =
      selected.length === this.originsTotal || selected.length === 0
        ? this.routes
        : this.routes.filter((route) => selected.includes(route.origin));
    const currentSort = selectSort.value as SortOptions;
    this.render(cards);
    this.sortItems(currentSort);
    this.generateCurrentState(selected);
    this.generateSelectedQuantity(cards);
    hideFilterOptionsWrapper(true);
  }

  public attachApplyButtonEvents(): void {
    applyButton?.addEventListener('click', () => {
      this.saveItems();
    });
  }

  public render(currentRoutes = this.routes, update = true): void {
    if (update) this.currentRoutes = currentRoutes;
    // @ts-ignore
    list?.innerHTML = '';
    currentRoutes.forEach((route) => {
      const html = `<li>
          <div class="bf-origin-destination">
              <span class="bf-origin">
                  <i class="icon-origin"></i>
                  ${route.origin}
              </span>
              <span class="bf-destination">
                  <i class="icon-destination"></i>
                  ${route.destination}
              </span>
          </div>
          <!-- /.bf-origin-destination -->
          <div class="bf-prices-and-dates">
              <span>${route.price}</span>
              <button data-route="${route.id}" type="button">Ver datas</button>
          </div>
          <!-- /.bf-prices-and-dates -->
      </li>`;
      list?.insertAdjacentHTML('beforeend', html);
      this.updateDOMSelectors({
        showAllDatesTriggers: document.querySelectorAll(
          '.bf-prices-and-dates button',
        ),
      });
    });
    this.updateDOMSelectors({
      showAllDatesTriggers: document.querySelectorAll(
        '.bf-prices-and-dates button',
      ),
    });
    this.showAllDates();
    selectSort?.addEventListener('change', () => {
      const value = selectSort.value as SortOptions;
      this.sortItems(value);
    });
  }
}
