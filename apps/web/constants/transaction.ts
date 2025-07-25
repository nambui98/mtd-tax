export const TRANSACTION_SELF_EMPLOYMENT_CATEGORIES = [
    {
        value: 'turnover',
        label: 'Turnover',
        hmrcField: 'periodIncome.turnover',
        type: 'income',
    },
    {
        value: 'otherIncome',
        label: 'Other Income',
        hmrcField: 'periodIncome.other',
        type: 'income',
    },
    {
        value: 'taxTakenOffTradingIncome',
        label: 'Tax Taken Off Trading Income',
        hmrcField: 'periodIncome.taxTakenOffTradingIncome',
        type: 'income',
    },

    {
        value: 'costOfGoods',
        label: 'Cost of Goods Bought',
        hmrcField: 'periodExpenses.costOfGoods',
        type: 'expense',
    },
    {
        value: 'paymentsToSubcontractors',
        label: 'Payments to Subcontractors (CIS)',
        hmrcField: 'periodExpenses.paymentsToSubcontractors',
        type: 'expense',
    },
    {
        value: 'wagesAndStaffCosts',
        label: 'Wages and Staff Costs',
        hmrcField: 'periodExpenses.wagesAndStaffCosts',
        type: 'expense',
    },
    {
        value: 'carVanTravelExpenses',
        label: 'Car, Van and Travel Expenses',
        hmrcField: 'periodExpenses.carVanTravelExpenses',
        type: 'expense',
    },
    {
        value: 'premisesRunningCosts',
        label: 'Premises Running Costs',
        hmrcField: 'periodExpenses.premisesRunningCosts',
        type: 'expense',
    },
    {
        value: 'maintenanceCosts',
        label: 'Repairs and Maintenance',
        hmrcField: 'periodExpenses.maintenanceCosts',
        type: 'expense',
    },
    {
        value: 'adminCosts',
        label: 'Admin Costs (Phone, Internet, Stationery)',
        hmrcField: 'periodExpenses.adminCosts',
        type: 'expense',
    },
    {
        value: 'businessEntertainmentCosts',
        label: 'Business Entertainment Costs',
        hmrcField: 'periodExpenses.businessEntertainmentCosts',
        type: 'expense',
    },
    {
        value: 'advertisingCosts',
        label: 'Advertising and Marketing',
        hmrcField: 'periodExpenses.advertisingCosts',
        type: 'expense',
    },
    {
        value: 'interestOnBankOtherLoans',
        label: 'Interest on Bank and Other Loans',
        hmrcField: 'periodExpenses.interestOnBankOtherLoans',
        type: 'expense',
    },
    {
        value: 'financeCharges',
        label: 'Financial Charges',
        hmrcField: 'periodExpenses.financeCharges',
        type: 'expense',
    },
    {
        value: 'irrecoverableDebts',
        label: 'Bad Debts',
        hmrcField: 'periodExpenses.irrecoverableDebts',
        type: 'expense',
    },
    {
        value: 'professionalFees',
        label: 'Professional Fees',
        hmrcField: 'periodExpenses.professionalFees',
        type: 'expense',
    },
    {
        value: 'depreciation',
        label: 'Depreciation (Non-Allowable)',
        hmrcField: 'periodExpenses.depreciation',
        type: 'expense',
    },
    {
        value: 'otherExpenses',
        label: 'Other Expenses',
        hmrcField: 'periodExpenses.otherExpenses',
        type: 'expense',
    },

    {
        value: 'costOfGoodsDisallowable',
        label: 'Disallowable: Cost of Goods',
        hmrcField: 'periodDisallowableExpenses.costOfGoodsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'paymentsToSubcontractorsDisallowable',
        label: 'Disallowable: Payments to Subcontractors',
        hmrcField:
            'periodDisallowableExpenses.paymentsToSubcontractorsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'wagesAndStaffCostsDisallowable',
        label: 'Disallowable: Wages and Staff',
        hmrcField: 'periodDisallowableExpenses.wagesAndStaffCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'carVanTravelExpensesDisallowable',
        label: 'Disallowable: Car, Van, Travel',
        hmrcField:
            'periodDisallowableExpenses.carVanTravelExpensesDisallowable',
        type: 'disallowable',
    },
    {
        value: 'premisesRunningCostsDisallowable',
        label: 'Disallowable: Premises Running Costs',
        hmrcField:
            'periodDisallowableExpenses.premisesRunningCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'maintenanceCostsDisallowable',
        label: 'Disallowable: Repairs and Maintenance',
        hmrcField: 'periodDisallowableExpenses.maintenanceCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'adminCostsDisallowable',
        label: 'Disallowable: Admin Costs',
        hmrcField: 'periodDisallowableExpenses.adminCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'businessEntertainmentCostsDisallowable',
        label: 'Disallowable: Entertainment',
        hmrcField:
            'periodDisallowableExpenses.businessEntertainmentCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'advertisingCostsDisallowable',
        label: 'Disallowable: Advertising',
        hmrcField: 'periodDisallowableExpenses.advertisingCostsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'interestOnBankOtherLoansDisallowable',
        label: 'Disallowable: Loan Interest',
        hmrcField:
            'periodDisallowableExpenses.interestOnBankOtherLoansDisallowable',
        type: 'disallowable',
    },
    {
        value: 'financeChargesDisallowable',
        label: 'Disallowable: Finance Charges',
        hmrcField: 'periodDisallowableExpenses.financeChargesDisallowable',
        type: 'disallowable',
    },
    {
        value: 'irrecoverableDebtsDisallowable',
        label: 'Disallowable: Bad Debts',
        hmrcField: 'periodDisallowableExpenses.irrecoverableDebtsDisallowable',
        type: 'disallowable',
    },
    {
        value: 'professionalFeesDisallowable',
        label: 'Disallowable: Professional Fees',
        hmrcField: 'periodDisallowableExpenses.professionalFeesDisallowable',
        type: 'disallowable',
    },
    {
        value: 'depreciationDisallowable',
        label: 'Disallowable: Depreciation',
        hmrcField: 'periodDisallowableExpenses.depreciationDisallowable',
        type: 'disallowable',
    },
    {
        value: 'otherExpensesDisallowable',
        label: 'Disallowable: Other Expenses',
        hmrcField: 'periodDisallowableExpenses.otherExpensesDisallowable',
        type: 'disallowable',
    },
];

export const TRANSACTION_CATEGORIES_FHL = [
    // ✅ UK FHL INCOME
    {
        label: 'Period Amount',
        value: 'period_amount',
        hmrcField: 'ukFhlProperty.income.periodAmount',
        type: 'income',
    },
    {
        label: 'Tax Deducted',
        value: 'tax_deducted',
        hmrcField: 'ukFhlProperty.income.taxDeducted',
        type: 'income',
    },
    {
        label: 'Rent a Room - Rents Received',
        value: 'rent_a_room_rents_received',
        hmrcField: 'ukFhlProperty.income.rentARoom.rentsReceived',
        type: 'income',
    },

    // ✅ UK FHL EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'premises_running_costs',
        hmrcField: 'ukFhlProperty.expenses.premisesRunningCosts',
        type: 'expense',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'repairs_and_maintenance',
        hmrcField: 'ukFhlProperty.expenses.repairsAndMaintenance',
        type: 'expense',
    },
    {
        label: 'Financial Costs',
        value: 'financial_costs',
        hmrcField: 'ukFhlProperty.expenses.financialCosts',
        type: 'expense',
    },
    {
        label: 'Professional Fees',
        value: 'professional_fees',
        hmrcField: 'ukFhlProperty.expenses.professionalFees',
        type: 'expense',
    },
    {
        label: 'Cost of Services',
        value: 'cost_of_services',
        hmrcField: 'ukFhlProperty.expenses.costOfServices',
        type: 'expense',
    },
    {
        label: 'Other',
        value: 'other',
        hmrcField: 'ukFhlProperty.expenses.other',
        type: 'expense',
    },
    {
        label: 'Travel Costs',
        value: 'travel_costs',
        hmrcField: 'ukFhlProperty.expenses.travelCosts',
        type: 'expense',
    },
    {
        label: 'Rent a Room - Amount Claimed',
        value: 'rent_a_room_amount_claimed',
        hmrcField: 'ukFhlProperty.expenses.rentARoom.amountClaimed',
        type: 'expense',
    },

    // ✅ UK Non-FHL INCOME
    {
        label: 'Premiums of Lease Grant',
        value: 'premiums_of_lease_grant',
        hmrcField: 'ukNonFhlProperty.income.premiumsOfLeaseGrant',
        type: 'income',
    },
    {
        label: 'Reverse Premiums',
        value: 'reverse_premiums',
        hmrcField: 'ukNonFhlProperty.income.reversePremiums',
        type: 'income',
    },
    {
        label: 'Period Amount',
        value: 'non_fhl_period_amount',
        hmrcField: 'ukNonFhlProperty.income.periodAmount',
        type: 'income',
    },
    {
        label: 'Tax Deducted',
        value: 'non_fhl_tax_deducted',
        hmrcField: 'ukNonFhlProperty.income.taxDeducted',
        type: 'income',
    },
    {
        label: 'Other Income',
        value: 'other_income',
        hmrcField: 'ukNonFhlProperty.income.otherIncome',
        type: 'income',
    },
    {
        label: 'Rent a Room - Rents Received',
        value: 'non_fhl_rent_a_room_rents_received',
        hmrcField: 'ukNonFhlProperty.income.rentARoom.rentsReceived',
        type: 'income',
    },

    // ✅ UK Non-FHL EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'non_fhl_premises_running_costs',
        hmrcField: 'ukNonFhlProperty.expenses.premisesRunningCosts',
        type: 'expense',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'non_fhl_repairs_and_maintenance',
        hmrcField: 'ukNonFhlProperty.expenses.repairsAndMaintenance',
        type: 'expense',
    },
    {
        label: 'Financial Costs',
        value: 'non_fhl_financial_costs',
        hmrcField: 'ukNonFhlProperty.expenses.financialCosts',
        type: 'expense',
    },
    {
        label: 'Professional Fees',
        value: 'non_fhl_professional_fees',
        hmrcField: 'ukNonFhlProperty.expenses.professionalFees',
        type: 'expense',
    },
    {
        label: 'Cost of Services',
        value: 'non_fhl_cost_of_services',
        hmrcField: 'ukNonFhlProperty.expenses.costOfServices',
        type: 'expense',
    },
    {
        label: 'Other',
        value: 'non_fhl_other',
        hmrcField: 'ukNonFhlProperty.expenses.other',
        type: 'expense',
    },
    {
        label: 'Residential Financial Cost',
        value: 'residential_financial_cost',
        hmrcField: 'ukNonFhlProperty.expenses.residentialFinancialCost',
        type: 'expense',
    },
    {
        label: 'Travel Costs',
        value: 'non_fhl_travel_costs',
        hmrcField: 'ukNonFhlProperty.expenses.travelCosts',
        type: 'expense',
    },
    {
        label: 'Residential Financial Costs Carried Forward',
        value: 'residential_financial_costs_carried_forward',
        hmrcField:
            'ukNonFhlProperty.expenses.residentialFinancialCostsCarriedForward',
        type: 'expense',
    },
    {
        label: 'Rent a Room - Amount Claimed',
        value: 'non_fhl_rent_a_room_amount_claimed',
        hmrcField: 'ukNonFhlProperty.expenses.rentARoom.amountClaimed',
        type: 'expense',
    },
];

export const TRANSACTION_CATEGORIES_FOREIGN_FHL = [
    // ✅ Foreign FHL EEA - INCOME
    {
        label: 'Rent Amount',
        value: 'foreign_fhl_rent_amount',
        hmrcField: 'foreignFhlEea.income.rentAmount',
        type: 'income',
    },

    // ✅ Foreign FHL EEA - EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'foreign_fhl_premises_running_costs',
        hmrcField: 'foreignFhlEea.expenses.premisesRunningCosts',
        type: 'expense',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'foreign_fhl_repairs_and_maintenance',
        hmrcField: 'foreignFhlEea.expenses.repairsAndMaintenance',
        type: 'expense',
    },
    {
        label: 'Financial Costs',
        value: 'foreign_fhl_financial_costs',
        hmrcField: 'foreignFhlEea.expenses.financialCosts',
        type: 'expense',
    },
    {
        label: 'Professional Fees',
        value: 'foreign_fhl_professional_fees',
        hmrcField: 'foreignFhlEea.expenses.professionalFees',
        type: 'expense',
    },
    {
        label: 'Cost of Services',
        value: 'foreign_fhl_cost_of_services',
        hmrcField: 'foreignFhlEea.expenses.costOfServices',
        type: 'expense',
    },
    {
        label: 'Travel Costs',
        value: 'foreign_fhl_travel_costs',
        hmrcField: 'foreignFhlEea.expenses.travelCosts',
        type: 'expense',
    },
    {
        label: 'Other',
        value: 'foreign_fhl_other',
        hmrcField: 'foreignFhlEea.expenses.other',
        type: 'expense',
    },

    // ✅ Foreign Non-FHL - INCOME
    {
        label: 'Rent Amount',
        value: 'foreign_non_fhl_rent_amount',
        hmrcField: 'foreignNonFhlProperty[].income.rentIncome.rentAmount',
        type: 'income',
    },
    {
        label: 'Foreign Tax Credit Relief',
        value: 'foreign_tax_credit_relief',
        hmrcField: 'foreignNonFhlProperty[].income.foreignTaxCreditRelief',
        type: 'income',
    },
    {
        label: 'Premiums of Lease Grant',
        value: 'foreign_premiums_of_lease_grant',
        hmrcField: 'foreignNonFhlProperty[].income.premiumsOfLeaseGrant',
        type: 'income',
    },
    {
        label: 'Other Property Income',
        value: 'foreign_other_property_income',
        hmrcField: 'foreignNonFhlProperty[].income.otherPropertyIncome',
        type: 'income',
    },
    {
        label: 'Foreign Tax Paid Or Deducted',
        value: 'foreign_tax_paid_or_deducted',
        hmrcField: 'foreignNonFhlProperty[].income.foreignTaxPaidOrDeducted',
        type: 'income',
    },
    {
        label: 'Special Withholding Tax Or UK Tax Paid',
        value: 'foreign_special_withholding_tax_or_uk_tax_paid',
        hmrcField:
            'foreignNonFhlProperty[].income.specialWithholdingTaxOrUkTaxPaid',
        type: 'income',
    },

    // ✅ Foreign Non-FHL - EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'foreign_non_fhl_premises_running_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.premisesRunningCosts',
        type: 'expense',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'foreign_non_fhl_repairs_and_maintenance',
        hmrcField: 'foreignNonFhlProperty[].expenses.repairsAndMaintenance',
        type: 'expense',
    },
    {
        label: 'Financial Costs',
        value: 'foreign_non_fhl_financial_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.financialCosts',
        type: 'expense',
    },
    {
        label: 'Professional Fees',
        value: 'foreign_non_fhl_professional_fees',
        hmrcField: 'foreignNonFhlProperty[].expenses.professionalFees',
        type: 'expense',
    },
    {
        label: 'Cost of Services',
        value: 'foreign_non_fhl_cost_of_services',
        hmrcField: 'foreignNonFhlProperty[].expenses.costOfServices',
        type: 'expense',
    },
    {
        label: 'Travel Costs',
        value: 'foreign_non_fhl_travel_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.travelCosts',
        type: 'expense',
    },
    {
        label: 'Residential Financial Cost',
        value: 'foreign_residential_financial_cost',
        hmrcField: 'foreignNonFhlProperty[].expenses.residentialFinancialCost',
        type: 'expense',
    },
    {
        label: 'Brought Forward Residential Financial Cost',
        value: 'foreign_brought_forward_residential_financial_cost',
        hmrcField:
            'foreignNonFhlProperty[].expenses.broughtFwdResidentialFinancialCost',
        type: 'expense',
    },
    {
        label: 'Other',
        value: 'foreign_non_fhl_other',
        hmrcField: 'foreignNonFhlProperty[].expenses.other',
        type: 'expense',
    },
];

export const MAPPING_HMRC_TO_TRANSACTION_CATEGORIES = {
    'uk-property': TRANSACTION_CATEGORIES_FHL,
    'foreign-property': TRANSACTION_CATEGORIES_FOREIGN_FHL,
    'self-employment': TRANSACTION_SELF_EMPLOYMENT_CATEGORIES,
};
