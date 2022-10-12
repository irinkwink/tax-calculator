const formatCurrency = (n) => 
  new Intl.NumberFormat('ru-Ru', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 2,
  }).format(n)

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
const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax_total');
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

const checkCompensation = () => {
  const setDisplay = formSelfEmployment.addCompensation.checked ? '' : 'none';
  calcCompensation.style.display = setDisplay;
  resultBlockCompensation.forEach(block => block.style.display = setDisplay)
}

checkCompensation()

formSelfEmployment.addEventListener('input', (e) => {
  const resIndividual = formSelfEmployment.individual.value * 0.04;
  const resEntity = formSelfEmployment.entity.value * 0.06;

  checkCompensation()

  const tax = resIndividual + resEntity;
  formSelfEmployment.compensation.value = 
    formSelfEmployment.compensation.value > 10000 ?
    10000 :
    formSelfEmployment.compensation.value
  const benefit = formSelfEmployment.compensation.value;
  const resBenefit = formSelfEmployment.individual.value * 0.01 + 
    formSelfEmployment.entity.value * 0.02
  const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0
  const finalTax = tax - (benefit - finalBenefit)


  resultTaxSelfEmployment.textContent = formatCurrency(tax)
  resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit)
  resultTaxRestCompensation.textContent = formatCurrency(finalBenefit)
  resultTaxResult.textContent = formatCurrency(finalTax)

})

// ОСН / ОСНО
const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');
const resultBlockNdflExpenses = osno.querySelector('.result__block_ndfl-expenses')
const resultBlockNdflIncome = osno.querySelector('.result__block_ndfl-income')
const resultBlockTaxIncome = osno.querySelector('.result__block_tax-income')

resultBlockTaxIncome.style.display = 'none';

formOsno.addEventListener('input', (e) => {
  if (formOsno.type.value === 'ip') {
    resultBlockNdflExpenses.style.display = '';
    resultBlockNdflIncome.style.display = '';
    resultBlockTaxIncome.style.display = 'none';
  }
  if (formOsno.type.value === 'ooo') {
    resultBlockNdflExpenses.style.display = 'none';
    resultBlockNdflIncome.style.display = 'none';
    resultBlockTaxIncome.style.display = '';
  }
})

// АУСН
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxAusn = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', (e) => {
  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    resultTaxAusn.textContent = formatCurrency(formAusn.income.value * 0.08);
  }
  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = '';
    resultTaxAusn.textContent = 
      formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
  }
});

