export const TRANSACTION_SELF_EMPLOYMENT_CATEGORIES = [
    {
        value: 'turnover',
        label: 'Turnover',
        hmrcField: 'periodIncome.turnover',
    },
    {
        value: 'otherIncome',
        label: 'Other Income',
        hmrcField: 'periodIncome.other',
    },
    {
        value: 'taxTakenOffTradingIncome',
        label: 'Tax Taken Off Trading Income',
        hmrcField: 'periodIncome.taxTakenOffTradingIncome',
    },

    {
        value: 'costOfGoods',
        label: 'Cost of Goods Bought',
        hmrcField: 'periodExpenses.costOfGoods',
    },
    {
        value: 'paymentsToSubcontractors',
        label: 'Payments to Subcontractors (CIS)',
        hmrcField: 'periodExpenses.paymentsToSubcontractors',
    },
    {
        value: 'wagesAndStaffCosts',
        label: 'Wages and Staff Costs',
        hmrcField: 'periodExpenses.wagesAndStaffCosts',
    },
    {
        value: 'carVanTravelExpenses',
        label: 'Car, Van and Travel Expenses',
        hmrcField: 'periodExpenses.carVanTravelExpenses',
    },
    {
        value: 'premisesRunningCosts',
        label: 'Premises Running Costs',
        hmrcField: 'periodExpenses.premisesRunningCosts',
    },
    {
        value: 'maintenanceCosts',
        label: 'Repairs and Maintenance',
        hmrcField: 'periodExpenses.maintenanceCosts',
    },
    {
        value: 'adminCosts',
        label: 'Admin Costs (Phone, Internet, Stationery)',
        hmrcField: 'periodExpenses.adminCosts',
    },
    {
        value: 'businessEntertainmentCosts',
        label: 'Business Entertainment Costs',
        hmrcField: 'periodExpenses.businessEntertainmentCosts',
    },
    {
        value: 'advertisingCosts',
        label: 'Advertising and Marketing',
        hmrcField: 'periodExpenses.advertisingCosts',
    },
    {
        value: 'interestOnBankOtherLoans',
        label: 'Interest on Bank and Other Loans',
        hmrcField: 'periodExpenses.interestOnBankOtherLoans',
    },
    {
        value: 'financeCharges',
        label: 'Financial Charges',
        hmrcField: 'periodExpenses.financeCharges',
    },
    {
        value: 'irrecoverableDebts',
        label: 'Bad Debts',
        hmrcField: 'periodExpenses.irrecoverableDebts',
    },
    {
        value: 'professionalFees',
        label: 'Professional Fees',
        hmrcField: 'periodExpenses.professionalFees',
    },
    {
        value: 'depreciation',
        label: 'Depreciation (Non-Allowable)',
        hmrcField: 'periodExpenses.depreciation',
    },
    {
        value: 'otherExpenses',
        label: 'Other Expenses',
        hmrcField: 'periodExpenses.otherExpenses',
    },

    {
        value: 'costOfGoodsDisallowable',
        label: 'Disallowable: Cost of Goods',
        hmrcField: 'periodDisallowableExpenses.costOfGoodsDisallowable',
    },
    {
        value: 'paymentsToSubcontractorsDisallowable',
        label: 'Disallowable: Payments to Subcontractors',
        hmrcField:
            'periodDisallowableExpenses.paymentsToSubcontractorsDisallowable',
    },
    {
        value: 'wagesAndStaffCostsDisallowable',
        label: 'Disallowable: Wages and Staff',
        hmrcField: 'periodDisallowableExpenses.wagesAndStaffCostsDisallowable',
    },
    {
        value: 'carVanTravelExpensesDisallowable',
        label: 'Disallowable: Car, Van, Travel',
        hmrcField:
            'periodDisallowableExpenses.carVanTravelExpensesDisallowable',
    },
    {
        value: 'premisesRunningCostsDisallowable',
        label: 'Disallowable: Premises Running Costs',
        hmrcField:
            'periodDisallowableExpenses.premisesRunningCostsDisallowable',
    },
    {
        value: 'maintenanceCostsDisallowable',
        label: 'Disallowable: Repairs and Maintenance',
        hmrcField: 'periodDisallowableExpenses.maintenanceCostsDisallowable',
    },
    {
        value: 'adminCostsDisallowable',
        label: 'Disallowable: Admin Costs',
        hmrcField: 'periodDisallowableExpenses.adminCostsDisallowable',
    },
    {
        value: 'businessEntertainmentCostsDisallowable',
        label: 'Disallowable: Entertainment',
        hmrcField:
            'periodDisallowableExpenses.businessEntertainmentCostsDisallowable',
    },
    {
        value: 'advertisingCostsDisallowable',
        label: 'Disallowable: Advertising',
        hmrcField: 'periodDisallowableExpenses.advertisingCostsDisallowable',
    },
    {
        value: 'interestOnBankOtherLoansDisallowable',
        label: 'Disallowable: Loan Interest',
        hmrcField:
            'periodDisallowableExpenses.interestOnBankOtherLoansDisallowable',
    },
    {
        value: 'financeChargesDisallowable',
        label: 'Disallowable: Finance Charges',
        hmrcField: 'periodDisallowableExpenses.financeChargesDisallowable',
    },
    {
        value: 'irrecoverableDebtsDisallowable',
        label: 'Disallowable: Bad Debts',
        hmrcField: 'periodDisallowableExpenses.irrecoverableDebtsDisallowable',
    },
    {
        value: 'professionalFeesDisallowable',
        label: 'Disallowable: Professional Fees',
        hmrcField: 'periodDisallowableExpenses.professionalFeesDisallowable',
    },
    {
        value: 'depreciationDisallowable',
        label: 'Disallowable: Depreciation',
        hmrcField: 'periodDisallowableExpenses.depreciationDisallowable',
    },
    {
        value: 'otherExpensesDisallowable',
        label: 'Disallowable: Other Expenses',
        hmrcField: 'periodDisallowableExpenses.otherExpensesDisallowable',
    },
];

export const TRANSACTION_CATEGORIES_FHL = [
    // ✅ UK FHL INCOME
    {
        label: 'Period Amount',
        value: 'period_amount',
        hmrcField: 'ukFhlProperty.income.periodAmount',
    },
    {
        label: 'Tax Deducted',
        value: 'tax_deducted',
        hmrcField: 'ukFhlProperty.income.taxDeducted',
    },
    {
        label: 'Rent a Room - Rents Received',
        value: 'rent_a_room_rents_received',
        hmrcField: 'ukFhlProperty.income.rentARoom.rentsReceived',
    },

    // ✅ UK FHL EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'premises_running_costs',
        hmrcField: 'ukFhlProperty.expenses.premisesRunningCosts',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'repairs_and_maintenance',
        hmrcField: 'ukFhlProperty.expenses.repairsAndMaintenance',
    },
    {
        label: 'Financial Costs',
        value: 'financial_costs',
        hmrcField: 'ukFhlProperty.expenses.financialCosts',
    },
    {
        label: 'Professional Fees',
        value: 'professional_fees',
        hmrcField: 'ukFhlProperty.expenses.professionalFees',
    },
    {
        label: 'Cost of Services',
        value: 'cost_of_services',
        hmrcField: 'ukFhlProperty.expenses.costOfServices',
    },
    {
        label: 'Other',
        value: 'other',
        hmrcField: 'ukFhlProperty.expenses.other',
    },
    {
        label: 'Travel Costs',
        value: 'travel_costs',
        hmrcField: 'ukFhlProperty.expenses.travelCosts',
    },
    {
        label: 'Rent a Room - Amount Claimed',
        value: 'rent_a_room_amount_claimed',
        hmrcField: 'ukFhlProperty.expenses.rentARoom.amountClaimed',
    },

    // ✅ UK Non-FHL INCOME
    {
        label: 'Premiums of Lease Grant',
        value: 'premiums_of_lease_grant',
        hmrcField: 'ukNonFhlProperty.income.premiumsOfLeaseGrant',
    },
    {
        label: 'Reverse Premiums',
        value: 'reverse_premiums',
        hmrcField: 'ukNonFhlProperty.income.reversePremiums',
    },
    {
        label: 'Period Amount',
        value: 'non_fhl_period_amount',
        hmrcField: 'ukNonFhlProperty.income.periodAmount',
    },
    {
        label: 'Tax Deducted',
        value: 'non_fhl_tax_deducted',
        hmrcField: 'ukNonFhlProperty.income.taxDeducted',
    },
    {
        label: 'Other Income',
        value: 'other_income',
        hmrcField: 'ukNonFhlProperty.income.otherIncome',
    },
    {
        label: 'Rent a Room - Rents Received',
        value: 'non_fhl_rent_a_room_rents_received',
        hmrcField: 'ukNonFhlProperty.income.rentARoom.rentsReceived',
    },

    // ✅ UK Non-FHL EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'non_fhl_premises_running_costs',
        hmrcField: 'ukNonFhlProperty.expenses.premisesRunningCosts',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'non_fhl_repairs_and_maintenance',
        hmrcField: 'ukNonFhlProperty.expenses.repairsAndMaintenance',
    },
    {
        label: 'Financial Costs',
        value: 'non_fhl_financial_costs',
        hmrcField: 'ukNonFhlProperty.expenses.financialCosts',
    },
    {
        label: 'Professional Fees',
        value: 'non_fhl_professional_fees',
        hmrcField: 'ukNonFhlProperty.expenses.professionalFees',
    },
    {
        label: 'Cost of Services',
        value: 'non_fhl_cost_of_services',
        hmrcField: 'ukNonFhlProperty.expenses.costOfServices',
    },
    {
        label: 'Other',
        value: 'non_fhl_other',
        hmrcField: 'ukNonFhlProperty.expenses.other',
    },
    {
        label: 'Residential Financial Cost',
        value: 'residential_financial_cost',
        hmrcField: 'ukNonFhlProperty.expenses.residentialFinancialCost',
    },
    {
        label: 'Travel Costs',
        value: 'non_fhl_travel_costs',
        hmrcField: 'ukNonFhlProperty.expenses.travelCosts',
    },
    {
        label: 'Residential Financial Costs Carried Forward',
        value: 'residential_financial_costs_carried_forward',
        hmrcField:
            'ukNonFhlProperty.expenses.residentialFinancialCostsCarriedForward',
    },
    {
        label: 'Rent a Room - Amount Claimed',
        value: 'non_fhl_rent_a_room_amount_claimed',
        hmrcField: 'ukNonFhlProperty.expenses.rentARoom.amountClaimed',
    },
];

export const TRANSACTION_CATEGORIES_FOREIGN_FHL = [
    // ✅ Foreign FHL EEA - INCOME
    {
        label: 'Rent Amount',
        value: 'foreign_fhl_rent_amount',
        hmrcField: 'foreignFhlEea.income.rentAmount',
    },

    // ✅ Foreign FHL EEA - EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'foreign_fhl_premises_running_costs',
        hmrcField: 'foreignFhlEea.expenses.premisesRunningCosts',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'foreign_fhl_repairs_and_maintenance',
        hmrcField: 'foreignFhlEea.expenses.repairsAndMaintenance',
    },
    {
        label: 'Financial Costs',
        value: 'foreign_fhl_financial_costs',
        hmrcField: 'foreignFhlEea.expenses.financialCosts',
    },
    {
        label: 'Professional Fees',
        value: 'foreign_fhl_professional_fees',
        hmrcField: 'foreignFhlEea.expenses.professionalFees',
    },
    {
        label: 'Cost of Services',
        value: 'foreign_fhl_cost_of_services',
        hmrcField: 'foreignFhlEea.expenses.costOfServices',
    },
    {
        label: 'Travel Costs',
        value: 'foreign_fhl_travel_costs',
        hmrcField: 'foreignFhlEea.expenses.travelCosts',
    },
    {
        label: 'Other',
        value: 'foreign_fhl_other',
        hmrcField: 'foreignFhlEea.expenses.other',
    },

    // ✅ Foreign Non-FHL - INCOME
    {
        label: 'Rent Amount',
        value: 'foreign_non_fhl_rent_amount',
        hmrcField: 'foreignNonFhlProperty[].income.rentIncome.rentAmount',
    },
    {
        label: 'Foreign Tax Credit Relief',
        value: 'foreign_tax_credit_relief',
        hmrcField: 'foreignNonFhlProperty[].income.foreignTaxCreditRelief',
    },
    {
        label: 'Premiums of Lease Grant',
        value: 'foreign_premiums_of_lease_grant',
        hmrcField: 'foreignNonFhlProperty[].income.premiumsOfLeaseGrant',
    },
    {
        label: 'Other Property Income',
        value: 'foreign_other_property_income',
        hmrcField: 'foreignNonFhlProperty[].income.otherPropertyIncome',
    },
    {
        label: 'Foreign Tax Paid Or Deducted',
        value: 'foreign_tax_paid_or_deducted',
        hmrcField: 'foreignNonFhlProperty[].income.foreignTaxPaidOrDeducted',
    },
    {
        label: 'Special Withholding Tax Or UK Tax Paid',
        value: 'foreign_special_withholding_tax_or_uk_tax_paid',
        hmrcField:
            'foreignNonFhlProperty[].income.specialWithholdingTaxOrUkTaxPaid',
    },

    // ✅ Foreign Non-FHL - EXPENSES
    {
        label: 'Premises Running Costs',
        value: 'foreign_non_fhl_premises_running_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.premisesRunningCosts',
    },
    {
        label: 'Repairs and Maintenance',
        value: 'foreign_non_fhl_repairs_and_maintenance',
        hmrcField: 'foreignNonFhlProperty[].expenses.repairsAndMaintenance',
    },
    {
        label: 'Financial Costs',
        value: 'foreign_non_fhl_financial_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.financialCosts',
    },
    {
        label: 'Professional Fees',
        value: 'foreign_non_fhl_professional_fees',
        hmrcField: 'foreignNonFhlProperty[].expenses.professionalFees',
    },
    {
        label: 'Cost of Services',
        value: 'foreign_non_fhl_cost_of_services',
        hmrcField: 'foreignNonFhlProperty[].expenses.costOfServices',
    },
    {
        label: 'Travel Costs',
        value: 'foreign_non_fhl_travel_costs',
        hmrcField: 'foreignNonFhlProperty[].expenses.travelCosts',
    },
    {
        label: 'Residential Financial Cost',
        value: 'foreign_residential_financial_cost',
        hmrcField: 'foreignNonFhlProperty[].expenses.residentialFinancialCost',
    },
    {
        label: 'Brought Forward Residential Financial Cost',
        value: 'foreign_brought_forward_residential_financial_cost',
        hmrcField:
            'foreignNonFhlProperty[].expenses.broughtFwdResidentialFinancialCost',
    },
    {
        label: 'Other',
        value: 'foreign_non_fhl_other',
        hmrcField: 'foreignNonFhlProperty[].expenses.other',
    },
];

export const MAPPING_HMRC_TO_TRANSACTION_CATEGORIES = {
    'uk-property': TRANSACTION_CATEGORIES_FHL,
    'foreign-property': TRANSACTION_CATEGORIES_FOREIGN_FHL,
    'self-employment': TRANSACTION_SELF_EMPLOYMENT_CATEGORIES,
};
