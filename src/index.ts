// Main CSS
import './styles/app.scss';
import CardOffers from './components/CardOffers';
import {
  isProduction,
  accordionTitles,
  backToTop,
  closeFilterOptionsWrapper,
  filterOptionsWrapper,
  openFilterOptionsWrapper,
  body,
  maskModals,
  okButton,
  modalDates,
  landingPageContent,
} from './constants';
import { Routes } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const allRoutes = routes as Routes;
const origins = [...new Set(allRoutes.map((route) => route.origin))];

const runLandingPageApplication = () => {
  if (!isProduction) console.log('Application running...');

  // Card Offers
  new CardOffers({ routes: allRoutes, origins });

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
    filterOptionsWrapper?.classList.remove('bf-active');
    body.classList.remove('no-navigation-enabled');
  });

  // Open Wrapper
  openFilterOptionsWrapper?.addEventListener('click', () => {
    filterOptionsWrapper?.classList.add('bf-active');
    body.classList.add('no-navigation-enabled');
  });

  // Close Modals
  okButton?.addEventListener('click', (e) => {
    e.preventDefault();
    maskModals?.classList.remove('bf-active');
    modalDates?.classList.remove('bf-active');
    body.classList.remove('no-navigation-enabled');
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
