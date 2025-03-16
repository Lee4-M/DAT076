import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BudgetTable } from './BudgetTable';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../api/api', () => ({
    deleteBudget: jest.fn(),
}));

describe('BudgetTable', () => {
    const mockLoadBudgets = jest.fn();
    const mockLoadExpenses = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnSave = jest.fn();

    const budgets = [
        { id: 1, userId: 1, category: 'Food', amount: 100 },
        { id: 2, userId: 1, category: 'Transport', amount: 150 },
    ];

    const expenses = {
        1: [
            { id: 1, budgetRowId: 1, cost: 30, description: "desc-1" },
            { id: 2, budgetRowId: 1, cost: 80, description: "desc-2" }
        ],
        2: [
            { id: 3, budgetRowId: 2, cost: 50, description: "desc-3" }
        ]
    };

    let isEditing: boolean;

    const renderComponent = () => {
        render(
            <BudgetTable
                budgets={budgets}
                loadBudgets={mockLoadBudgets}
                expenses={expenses}
                loadExpenses={mockLoadExpenses}
                isEditing={isEditing}
                onEdit={mockOnEdit}
                onSave={mockOnSave}
            />
        );
    };

    const setIsEditing = (value: boolean) => {
        isEditing = value;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: [] });
        isEditing = false;
        renderComponent();
    });

    test('renders BudgetTable with budgets', () => {
        const table = screen.getByTestId('budget-table');
        expect(table).toBeInTheDocument();
    });

    test('renders correct total budgets', () => {
        let totalBudgets = 0;
        for (const budget of Object.values(budgets)) {
            totalBudgets += budget.amount;
        }
        
        const totalRowElements = screen.getByTestId('total-row').children;;
        const totalBudgetsOnScreen = totalRowElements[1].textContent;   
        expect(totalBudgets + " :-").toEqual(totalBudgetsOnScreen)
    });

    test('renders correct total expenses', () => {
        let totalExpenses = 0;
        for (const expenseList of Object.values(expenses)) {
            for (const expense of expenseList) {
                totalExpenses += expense.cost;
            }
        }
        
        const totalRowElements = screen.getByTestId('total-row').children;;
        const totalExpensesOnScreen = totalRowElements[2].textContent;   
        expect(totalExpenses + " :-").toEqual(totalExpensesOnScreen)
    });

    test('renders correct variance', () => {
        let totalBudgets = 0;
        for (const budget of Object.values(budgets)) {
            totalBudgets += budget.amount;
        }

        let totalExpenses = 0;
        for (const expenseList of Object.values(expenses)) {
            for (const expense of expenseList) {
                totalExpenses += expense.cost;
            }
        }

        const totalRowElements = screen.getByTestId('total-row').children;;
        const resultOnScreen = totalRowElements[3].textContent;   
        expect((totalBudgets - totalExpenses) + " :-").toEqual(resultOnScreen)
    });

    test('renders additional button to create budget when no budgets are created', () => {
        render(
            <BudgetTable
                budgets={[]}
                loadBudgets={mockLoadBudgets}
                expenses={expenses}
                loadExpenses={mockLoadExpenses}
                isEditing={isEditing}
                onEdit={mockOnEdit}
                onSave={mockOnSave}
            />
        );
        const noBudgetsMessage = screen.getByText('Create Your First Budget!');
        expect(noBudgetsMessage).toBeInTheDocument();
    });

    test('renders BudgetRowComponent for each budget', () => {
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(budgets.length + 1);
    });

    test('toggles sorting order when clicking on category column header', () => {
        const categoryHeader = screen.getByText('Category');
        fireEvent.click(categoryHeader);

        const rows = screen.getAllByRole('row');
        const categories = rows.slice(1).map(row => row.children[0].textContent);
        expect(categories).toEqual(['Transport', 'Food']);
        
        fireEvent.click(categoryHeader);
        
        const sortedRows = screen.getAllByRole('row');
        const sortedCategories = sortedRows.slice(1).map(row => row.children[0].textContent);
        console.log(sortedCategories);
        expect(sortedCategories).toEqual(['Food', 'Transport']);
    });

    test('toggles sorting order when clicking on budget column header', () => {
        const budgetHeader = screen.getByText('Budget');
        fireEvent.click(budgetHeader);

        const rows = screen.getAllByRole('row');
        const budgets = rows.slice(1).map(row => row.children[1].textContent);
        expect(budgets).toEqual(['100 :-', '150 :-']);
        
        fireEvent.click(budgetHeader);
        
        const sortedRows = screen.getAllByRole('row');
        const sortedBudgets = sortedRows.slice(1).map(row => row.children[1].textContent);
        expect(sortedBudgets).toEqual(['150 :-', '100 :-']);
    });

    test('toggles sorting order when clicking on expense column header', () => {
        const expenseHeader = screen.getByText('Expense');
        fireEvent.click(expenseHeader);

        const rows = screen.getAllByRole('row');
        const expenses = rows.slice(1).map(row => row.children[2].textContent);
        expect(expenses).toEqual(['50 :-', '110 :-']);
        
        fireEvent.click(expenseHeader);
        
        const sortedRows = screen.getAllByRole('row');
        const sortedExpenses = sortedRows.slice(1).map(row => row.children[2].textContent);
        expect(sortedExpenses).toEqual(['110 :-', '50 :-']);
    });

    test('toggles sorting order when clicking on result column header', () => {
        const resultHeader = screen.getByText('Result');
        fireEvent.click(resultHeader);

        const rows = screen.getAllByRole('row');
        const results = rows.slice(1).map(row => row.children[3].textContent);
        expect(results).toEqual(['-10 :-', '100 :-']);
        
        fireEvent.click(resultHeader);
        
        const sortedRows = screen.getAllByRole('row');
        const sortedResults = sortedRows.slice(1).map(row => row.children[3].textContent);
        expect(sortedResults).toEqual(['100 :-', '-10 :-']);
    });

    test('calls onEdit when budget category is changed in BudgetRowComponent', () => {
        setIsEditing(true);
        renderComponent();

        const categoryInput = screen.getByDisplayValue('Food');
        fireEvent.change(categoryInput, { target: { value: 'Groceries' } });

        expect(mockOnEdit).toHaveBeenCalledWith(1, 'Groceries', 100);
    });

    test('calls onSave when Enter key is pressed in BudgetRowComponent', () => {
        setIsEditing(true);
        renderComponent();

        const categoryInput = screen.getByDisplayValue('Food');
        fireEvent.change(categoryInput, { target: { value: 'Groceries' } });
        fireEvent.keyDown(categoryInput, { key: 'Enter', code: 'Enter' });

        expect(mockOnSave).toHaveBeenCalled();
    });
});
