import {
  body,
  filterOptionsWrapper,
  list,
  maskModals,
  modalDates,
} from '../constants';

/**
 * Transform array into multidimensional array
 * @param array
 * @param perPage
 */
export const breakArrayIntoChunks = <T>(array: T[], perPage = 3): T[][] =>
  Array.from({ length: Math.ceil(array.length / perPage) }, (_, index) =>
    array.slice(index * perPage, index * perPage + perPage),
  );

/**
 * Show filter options
 */
export const showFilterOptionsWrapper = () => {
  filterOptionsWrapper?.classList.add('bf-active');
  body.classList.add('no-navigation-enabled');
};

/**
 * Hide filter options
 * @param returnTo
 */
export const hideFilterOptionsWrapper = (returnTo = false): void => {
  filterOptionsWrapper?.classList.remove('bf-active');
  body.classList.remove('no-navigation-enabled');
  if (returnTo) {
    setTimeout(() => {
      scrollTo({
        left: 0,
        top: list?.offsetTop,
        behavior: 'smooth',
      });
    }, 500);
  }
};

/**
 * Hide modal
 */
export const hideModal = (): void => {
  modalDates?.classList.remove('bf-active');
  maskModals?.classList.remove('bf-active');
  body.classList.remove('no-navigation-enabled');
};

/**
 * Show modal
 */

export const showModal = (): void => {
  modalDates?.classList.add('bf-active');
  maskModals?.classList.add('bf-active');
  body.classList.add('no-navigation-enabled');
};

/**
 * Split text
 * @param text
 */
export const cutText = (text: string): string =>
  text.length >= 20 ? text.split('-')[0].concat(' ...') : text;

/**
 * Format date
 * @param date
 */
export const formatDate = (date: string): string => {
  const splitDate = date.split('-');
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
};

/**
 * Format currency
 * @param value
 */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
