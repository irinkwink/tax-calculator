const formatCurrency = (n) => 
  new Intl.NumberFormat('ru-Ru', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 2,
  }).format(n)

const validate = (n) => {
  return n < 0 ? 0 : n
}

const debounceTimer = (fn, msec) => {
  let lastCall = 0;
  let lastCallTimer = NaN;

  return (...arg) => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && ((lastCall - previousCall) <= msec)) {
      clearTimeout(lastCallTimer)
    }
    
    lastCallTimer = setTimeout(() => {
      fn(...arg);
    }, msec)
  }
}

{ // Навигация
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
}

{ // Cамозанятый
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

formSelfEmployment.addEventListener('input', debounceTimer((e) => {
  const resIndividual = +formSelfEmployment.individual.value * 0.04;
  const resEntity = +formSelfEmployment.entity.value * 0.06;

  checkCompensation()

  const tax = resIndividual + resEntity;
  formSelfEmployment.compensation.value = 
    +formSelfEmployment.compensation.value > 10000 ?
    10000 :
    formSelfEmployment.compensation.value
  const benefit = +formSelfEmployment.compensation.value;
  const resBenefit = +formSelfEmployment.individual.value * 0.01 + 
    +formSelfEmployment.entity.value * 0.02
  const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0
  const finalTax = tax - (benefit - finalBenefit)


  resultTaxSelfEmployment.textContent = formatCurrency(validate(tax))
  resultTaxCompensation.textContent = formatCurrency(validate(benefit - finalBenefit))
  resultTaxRestCompensation.textContent = formatCurrency(validate(finalBenefit))
  resultTaxResult.textContent = formatCurrency(validate(finalTax))
}, 500))
}

{ // 13%
const taxReturn = document.querySelector('.tax-return');
const formTaxReturn = taxReturn.querySelector('.calc__form')
const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

formTaxReturn.addEventListener('input', debounceTimer((e) => {
    const expenses = +formTaxReturn.expenses.value;
    const income = +formTaxReturn.income.value;
    const sumExpenses = +formTaxReturn.sumExpenses.value;

    const ndfl = income * 0.13;

    const possibleDeduction = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
    const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

    resultTaxNdfl.textContent = formatCurrency(validate(ndfl));
    resultTaxPossible.textContent = formatCurrency(validate(possibleDeduction));
    resultTaxDeduction.textContent = formatCurrency(validate(deduction));
}, 500))
}

{ // УСН
const LIMIT = 300000
const usn = document.querySelector('.usn');
const formUsn= usn.querySelector('.calc__form');

const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
const calcLabelProperty = usn.querySelector('.calc__label_property');
const resultBlockProperty = usn.querySelector('.result__block_property');

const resultTaxTotal = usn.querySelector('.result__tax_total');
const resultTaxProperty = usn.querySelector('.result__tax_property');

typeTax = {
  'income': () => {
    calcLabelExpenses.style.display = 'none';
    calcLabelProperty.style.display = 'none';
    resultBlockProperty.style.display = 'none';
    formUsn.expenses.value = '';
    formUsn.property.value = '';
  },
  'ip': () => {
    calcLabelExpenses.style.display = '';
    calcLabelProperty.style.display = 'none';
    resultBlockProperty.style.display = 'none';
    formUsn.property.value = '';
  },
  'ooo': () => {
    calcLabelExpenses.style.display = '';
    calcLabelProperty.style.display = '';
    resultBlockProperty.style.display = '';
  },
}

const percent = {
  'income': 0.06,
  'ip': 0.15,
  'ooo': 0.15,
}

typeTax[formUsn.typeTax.value]();

formUsn.addEventListener('input', debounceTimer((e) => {
  typeTax[formUsn.typeTax.value]();

  const income = +formUsn.income.value;
  const expenses = +formUsn.expenses.value;
  const contributions = +formUsn.contributions.value;
  const property = +formUsn.property.value;

  let profit = income - contributions;

  if (formUsn.typeTax.value !== 'income') {
    profit -= expenses
  }

  const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;

  const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);

  const tax = summ * percent[formUsn.typeTax.value]
  resultTaxTotal.textContent = formatCurrency(validate(tax));

  const taxProperty = property * 0.02;
  resultTaxProperty.textContent = formatCurrency(validate(taxProperty));
}, 500))

}

{ // ОСН / ОСНО
const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');
const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses')
const ndflIncome = osno.querySelector('.result__block_ndfl-income')
const taxProfit = osno.querySelector('.result__block_tax-profit')


const resultTaxNds = osno.querySelector('.result__tax_nds');
const resultTaxProperty = osno.querySelector('.result__tax_property');
const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
const resultTaxProfit = osno.querySelector('.result__tax_tax-profit');

taxProfit.style.display = 'none';

const checkType = () => {
  if (formOsno.type.value === 'ip') {
    ndflExpenses.style.display = '';
    ndflIncome.style.display = '';
    taxProfit.style.display = 'none';
  }
  if (formOsno.type.value === 'ooo') {
    ndflExpenses.style.display = 'none';
    ndflIncome.style.display = 'none';
    taxProfit.style.display = '';
  }
}

formOsno.addEventListener('input', debounceTimer((e) => {
  checkType(); 

  const income = +formOsno.income.value;
  const expenses = +formOsno.expenses.value;
  const property = +formOsno.property.value;

  // НДС
  const nds = income * 0.2;
  resultTaxNds.textContent = formatCurrency(validate(nds))

  // Налог на имущество
  const taxProperty = property * 0.02;
  resultTaxProperty.textContent = formatCurrency(validate(taxProperty));

  // НДФЛ(Вычет в виде расходов)
  const profit = income - expenses;
  const ndflExpensesTotal = profit * 0.13;
  resultTaxNdflExpenses.textContent = formatCurrency(validate(ndflExpensesTotal));

  // НДФЛ(Вычет 20% от доходов)
  const ndflIncomeTotal = (income - nds) * 0.13;
  resultTaxNdflIncome.textContent = formatCurrency(validate(ndflIncomeTotal));

  // Налог на прибыль 20%
  const taxProfitTotal = profit * 0.2;
  resultTaxProfit.textContent = formatCurrency(validate(taxProfitTotal));
}, 500))
}

{ // АУСН
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxAusn = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', debounceTimer((e) => {
  if (formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    const tax = +formAusn.income.value * 0.08;
    resultTaxAusn.textContent = formatCurrency(validate(tax));
  }
  if (formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = '';
    const tax = (+formAusn.income.value - +formAusn.expenses.value) * 0.2
    resultTaxAusn.textContent = formatCurrency(validate(tax));
  }
}, 500));
}
