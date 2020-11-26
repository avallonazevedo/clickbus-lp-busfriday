// Main CSS
import './styles/app.scss';
import CardOffers from './components/CardOffers';
import {
  isProduction,
  accordionTitles,
  backToTop,
  closeFilterOptionsWrapper,
  openFilterOptionsWrapper,
  okButton,
  landingPageContent,
} from './constants';
import { Routes } from './types';
import {
  showFilterOptionsWrapper,
  hideModal,
  hideFilterOptionsWrapper,
  formatDate,
  formatCurrency,
  breakArrayIntoChunks,
} from './utils';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const allRoutes = routes as Routes;
const formattedRoutes = allRoutes.map((route) => {
  const price = formatCurrency(route.price);
  const splitDates = route.availableDates.split(',');
  const formatDates = splitDates.map((date) => {
    const isSoldOff = date.includes('E');
    const finalDate = isSoldOff ? date.split('E')[0] : date;
    const brazilianDate = formatDate(finalDate);
    return {
      date: brazilianDate,
      soldOff: isSoldOff,
    };
  });
  const rowDates = breakArrayIntoChunks(formatDates);
  return {
    ...route,
    price,
    availableDates: rowDates,
  };
});
const origins = [...new Set(allRoutes.map((route) => route.origin))];

const runLandingPageApplication = () => {
  if (!isProduction) console.log('Application running...');

  // Card Offers
  new CardOffers({ routes: formattedRoutes, origins });

  // Accordions
  accordionTitles.forEach((title) => {
    title.addEventListener('click', () => {
      title.classList.toggle('bf-active');
      title.nextElementSibling?.classList.toggle('bf-active');
    });
  });

  // Back to top
  backToTop?.addEventListener('click', () => {
    scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  });

  // Close Wrapper
  closeFilterOptionsWrapper?.addEventListener('click', () => {
    hideFilterOptionsWrapper();
  });

  // Open Wrapper
  openFilterOptionsWrapper?.addEventListener('click', () => {
    showFilterOptionsWrapper();
  });

  // Close Modals
  okButton?.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal();
  });
};

if (!landingPageContent) {
  throw new Error(
    [
      "The page's main wrapper could not be found. Please wrap the entire",
      'application within an element with id "#clickbus-landing-page-wrapper".',
      'So we guarantee that we will not have any kind of conflict.',
    ].join(' '),
  );
}

runLandingPageApplication();
