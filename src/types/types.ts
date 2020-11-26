export interface Dates {
  date: string;
  soldOff: boolean;
}

export type AvailableDates = Dates[];

export interface Route {
  id: number;
  origin: string;
  destination: string;
  price: number;
  availableDates: string;
}

export type FormattedRoute = Pick<Route, 'origin' | 'destination' | 'id'> & {
  availableDates: AvailableDates[];
  price: string;
};

export type Routes = Route[];

export type FormattedRoutes = FormattedRoute[];

export interface CardOffersConstructor {
  routes: FormattedRoutes;
  origins: string[];
}

export interface CardOffersDOM {
  originSelectors: NodeListOf<Element>;
  clearOptions: HTMLElement | null;
  checkboxes: NodeListOf<HTMLInputElement>;
  selectedCheckbox: NodeListOf<HTMLInputElement>;
  showAllDatesTriggers: NodeListOf<HTMLButtonElement>;
}

export type SortOptions = 'name' | 'price-lower' | 'price-high';
