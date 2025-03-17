import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import axios from 'axios';
import { BudgetTable } from './BudgetTable';
import { deleteExpense, updateExpenses } from '../api/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../api/api', () => ({
    deleteExpense: jest.fn(),
    updateExpenses: jest.fn(),
}));

describe('ExpenseAccordion Tests', () => {
    const mockLoadExpenses = jest.fn();
    const mockLoadBudgets = jest.fn();

    const budgets = [
        { id: 1, userId: 1, category: 'Food', amount: 100 }
    ];

    const expenses = [
        { id: 1, budgetRowId: 1, cost: 30, description: "desc-1" },
        { id: 2, budgetRowId: 1, cost: 80, description: "desc-2" }
    ];

    const renderComponent = () => {
        render(
            <BudgetTable
                budgets={budgets}
                expenses={{ 1: expenses }}
                isEditing={false}
                loadBudgets={mockLoadBudgets}
                loadExpenses={mockLoadExpenses}
                handleChangeBudgets={jest.fn()}
                handleSaveBudgetRows={jest.fn()}
            />
        );

        const toggleButton = screen.getByAltText('Toggle Arrow');
        fireEvent.click(toggleButton);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: [] });
        renderComponent();
    });

    test('renders ExpenseAccordion with expenses', () => {
        const expenseAccordion = screen.getByTestId('expense-accordion');
        expect(expenseAccordion).toBeInTheDocument();
    });

    test('displays correct number of expense rows', () => {
        const rows = screen.getAllByRole('row');
        expect(rows.length - budgets.length - 3).toBe(expenses.length); // -3 for the 2 header + total row
    });

    test('displays the right expense costs', () => {
        const cost1 = screen.getByText('30');
        const cost2 = screen.getByText('80');

        expect(cost1).toBeInTheDocument();
        expect(cost2).toBeInTheDocument();
    });

    test('displays the right expense descriptions', () => {
        const desc1 = screen.getByText('desc-1');
        const desc2 = screen.getByText('desc-2');

        expect(desc1).toBeInTheDocument();
        expect(desc2).toBeInTheDocument();
    });

    test('When Edit Expense button is clicked, expense costs are editable', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);
        expect(screen.getByDisplayValue('30')).toBeEnabled();
        expect(screen.getByDisplayValue('80')).toBeEnabled();
    });

    test('When Edit Expense button is clicked, expense descriptions are editable', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);
        expect(screen.getByDisplayValue('desc-1')).toBeEnabled();
        expect(screen.getByDisplayValue('desc-2')).toBeEnabled();
    });

    test('When Edit Expense button is clicked and new input is provided, updateExpenses is called', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);

        const costInput = screen.getByDisplayValue('30');
        fireEvent.change(costInput, { target: { value: '50' } });
        const descInput = screen.getByDisplayValue('desc-1');
        fireEvent.change(descInput, { target: { value: 'new desc' } });
        const doneButton = screen.getByText('Done');
        fireEvent.click(doneButton);

        expect(updateExpenses).toHaveBeenCalledTimes(1);
    });

    test('When Edit Expense button is clicked, Done button is displayed', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);
        expect(screen.getByText('Done')).toBeInTheDocument();
    });

    test('When delete button is clicked, expense is deleted', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);
        
        const deleteButton = screen.getAllByAltText('Delete');
        fireEvent.click(deleteButton[0]);

        expect(deleteExpense).toHaveBeenCalledTimes(1);
    });

});