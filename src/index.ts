// Main CSS
import './styles/app.scss';

// Constants
const isProduction = process.env.NODE_ENV;
const landingPageContent = document.getElementById(
  'clickbus-landing-page-wrapper',
);
const accordionTitles = document.querySelectorAll(
  '.bf-accordion-title',
) as NodeListOf<Element>;
const backToTop = document.querySelector('.bf-go-to-top');
const filterOptionsWrapper = document.getElementById('bf-filter-options');
const closeFilterOptionsWrapper = document.querySelector('.bf-return');
const openFilterOptionsWrapper = document.getElementById('bf-origin-select');
const body = document.querySelector('body') as HTMLBodyElement;
const routesPrices = document.querySelectorAll('.bf-prices-and-dates');
const maskModals = document.getElementById('bf-mask-modal');
const modalDates = document.getElementById('bf-modal-dates');
const okButton = modalDates?.querySelector('button');

const runLandingPageApplication = () => {
  if (isProduction) console.log('Application running');

  // document.body.classList.add('no-navigation-enabled');

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

  // Open Modals
  routesPrices?.forEach((route) => {
    route.querySelector('button')?.addEventListener('click', (e) => {
      e.preventDefault();
      maskModals?.classList.add('bf-active');
      modalDates?.classList.add('bf-active');
    });
  });

  // Close Modals
  okButton?.addEventListener('click', (e) => {
    e.preventDefault();
    maskModals?.classList.remove('bf-active');
    modalDates?.classList.remove('bf-active');
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
