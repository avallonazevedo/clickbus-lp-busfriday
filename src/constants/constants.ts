// Constants
export const isProduction = process.env.NODE_ENV === 'production';
export const landingPageContent = document.getElementById(
  'clickbus-landing-page-wrapper',
);
export const accordionTitles = document.querySelectorAll(
  '.bf-accordion-title',
) as NodeListOf<Element>;
export const backToTop = document.querySelector('.bf-go-to-top');
export const filterOptionsWrapper = document.getElementById(
  'bf-filter-options',
);
export const closeFilterOptionsWrapper = document.querySelector('.bf-return');
export const openFilterOptionsWrapper = document.getElementById(
  'bf-origin-select',
);
export const body = document.querySelector('body') as HTMLBodyElement;
export const routesPrices = document.querySelectorAll('.bf-prices-and-dates');
export const maskModals = document.getElementById('bf-mask-modal');
export const modalDates = document.getElementById('bf-modal-dates');
export const okButton = modalDates?.querySelector('button');
export const list = document.querySelector('.bf-list') as HTMLElement;
export const formOrigins = document.getElementById('bf-update-origins');
export const applyButton = document.getElementById('apply-origins-options');
export const allOrigins = document.getElementById('bf-all') as HTMLInputElement;
export const clearOrigins = document.getElementById('clear-origins-options');
export const results = document.querySelector('.bf-results');
export const triggerSelect = document.querySelector('#bf-origin-select span');
export const titleModal = modalDates?.querySelector('header h3 span');
export const tableHeadRowDates = modalDates?.querySelector('table thead tr');
export const tableDatesBody = modalDates?.querySelector('table tbody');
