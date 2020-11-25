export interface Dates {
  date: string;
  soldOff: boolean;
}

export type AvailableDates = Dates[];

export interface Route {
  id: number;
  origin: string;
  destination: string;
  price: string;
  availableDates: Dates[][];
}

export type Routes = Route[];

export interface CardOffersConstructor {
  routes: Routes;
  origins: string[];
}

export interface CardOffersDOM {
  originSelectors: NodeListOf<Element>;
  clearOptions: HTMLElement | null;
  checkboxes: NodeListOf<HTMLInputElement>;
  selectedCheckbox: NodeListOf<HTMLInputElement>;
  showAllDatesTriggers: NodeListOf<HTMLButtonElement>;
}
