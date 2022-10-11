const navigationLinkElems = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');

const showCalc = (tax) => {
  calcElems.forEach(calc => {
    if (calc.dataset.tax === tax) {
      calc.classList.add('calc_active');
    } else {
      calc.classList.remove('calc_active');
    }
  })
}

const openLink = (e) => {
  e.preventDefault();
  navigationLinkElems.forEach(link => {
    link.classList.remove('navigation__link_active');
  });
  e.target.classList.add('navigation__link_active');
  showCalc(e.target.dataset.tax);
}

navigationLinkElems.forEach(link => {
  link.addEventListener('click', openLink)
});


// Cамозанятый
const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resultSelfEmployment = selfEmployment.querySelector('.result__tax_total');

formSelfEmployment.addEventListener('input', (e) => {
  resultSelfEmployment.textContent = 
  formSelfEmployment.incomeIndividuals.value * 0.04 +
  formSelfEmployment.incomeLegalEntities.value * 0.06;
});

// АУСН
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultAusn = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', (e) => {
  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    resultAusn.textContent = formAusn.income.value * 0.08;
  }
  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = 'block';
    resultAusn.textContent = 
      (formAusn.income.value - formAusn.expenses.value) * 0.2;
  }
});

