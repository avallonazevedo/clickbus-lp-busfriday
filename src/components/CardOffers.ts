/* eslint-disable @typescript-eslint/ban-ts-comment */
import slugify from 'slugify';
import { CardOffersConstructor, CardOffersDOM, Routes } from '../types';
import {
  list,
  tableDatesBody,
  modalDates,
  maskModals,
  formOrigins,
  clearOrigins,
  applyButton,
  allOrigins,
  filterOptionsWrapper,
  triggerSelect,
  body,
  results,
  titleModal,
} from '../constants';

const CHECKBOX_ALL = 'bf-all';
const ALL = 'Todas';

const hideFilterOptionsWrapper = (returnTo = false) => {
  filterOptionsWrapper?.classList.remove('bf-active');
  body.classList.remove('no-navigation-enabled');
  if (returnTo) {
    scrollTo({
      left: 0,
      top: list?.offsetTop,
      behavior: 'smooth',
    });
  }
};

const hideModal = (): void => {
  modalDates?.classList.remove('bf-active');
  maskModals?.classList.remove('bf-active');
  body.classList.remove('no-navigation-enabled');
};

const showModal = (): void => {
  modalDates?.classList.add('bf-active');
  maskModals?.classList.add('bf-active');
  body.classList.add('no-navigation-enabled');
};

const cutText = (text: string): string =>
  text.length >= 20 ? text.split(',')[0].concat(' ...') : text;

export default class CardOffers {
  private readonly originsTotal: number;
  private originsSelected: number;
  private readonly routes: Routes;
  private origins: string[];
  private dom!: CardOffersDOM;

  constructor({ routes, origins }: CardOffersConstructor) {
    this.originsSelected = 0;
    this.routes = routes;
    this.origins = origins;
    this.originsTotal = origins.length;
    this.render();
    this.renderCheckbox();
    this.generateSelectedQuantity(this.originsTotal);
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

  private generateSelectedQuantity(selected: string[] | number): void {
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
        const origin = selected.origin.split(',')[0];
        const destination = selected.destination.split(',')[0];
        // @ts-ignore
        titleModal.innerHTML = `${origin} x ${destination}`;
        // @ts-ignore
        tableDatesBody.innerHTML = '';
        selected.availableDates.forEach((dates) => {
          const output = `<tr>${dates
            .map((date) => `<td>${date.date}</td>`)
            .join('')}</tr>`;
          tableDatesBody?.insertAdjacentHTML('beforeend', output);
        });
        showModal();
      });
    });
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
    this.render(cards);
    this.generateCurrentState(selected);
    this.generateSelectedQuantity(selected);
    hideFilterOptionsWrapper(true);
  }

  public attachApplyButtonEvents(): void {
    applyButton?.addEventListener('click', () => {
      this.saveItems();
    });
  }

  public render(currentRoutes = this.routes): void {
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
              <span>R$ ${route.price}</span>
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
  }
}
