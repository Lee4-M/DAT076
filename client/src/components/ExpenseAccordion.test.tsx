import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ExpenseAccordion from './ExpenseAccordion';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExpenseAccordion Component', () => {
    const mockLoadBudgets = jest.fn();
    const mockLoadExpenses = jest.fn();
    const mockHandleClose = jest.fn();

    const expenses = [
        { id: 1, budgetRowId: 1, cost: 30, description: "desc-1" },
        { id: 2, budgetRowId: 1, cost: 80, description: "desc-2" },
    ];

    const renderComponent = () => {
        render(
            <ExpenseAccordion
                expenses={expenses}
                handleClose={mockHandleClose}
                loadExpenses={mockLoadExpenses}
                loadBudgets={mockLoadBudgets}
                deleteBudget={jest.fn()}
                budgetId={1}
            />
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: [] });
        renderComponent();
    });

    test('renders ExpenseAccordion component', () => {
        const accordion = screen.getByTestId('expense-accordion');
        expect(accordion).toBeInTheDocument();
    });

    test('displays correct number of expense rows', () => {
        const rows = screen.getAllByRole('row');
        expect(rows.length - 1).toBe(expenses.length); // -3 for the header
    });

    test('renders expense descriptions', () => {
        expenses.forEach(expense => {
            const description = screen.getByText(expense.description);
            expect(description).toBeInTheDocument();
        });
    });

    test('renders expense costs', () => {
        expenses.forEach(expense => {
            const cost = screen.getByText(`${expense.cost}`);
            expect(cost).toBeInTheDocument();
        });
    });

    test('When Edit Expense button is clicked, expense costs are editable', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);

        expenses.forEach(expense => {
            expect(screen.getByDisplayValue(`${expense.cost}`)).toBeEnabled();
        });
    });

    test('When Edit Expense button is clicked, expense descriptions are editable', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);

        expenses.forEach(expense => {
            expect(screen.getByDisplayValue(expense.description)).toBeEnabled();
        });
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

        expect(mockedAxios.delete).toHaveBeenCalledWith("http://localhost:8080/expense/1");
    });

    test('When Edit Expense button is clicked and new input is provided, updateExpense is called', async () => {
        const editButton = screen.getByText('Edit expenses');
        fireEvent.click(editButton);
        const costInput = screen.getByDisplayValue('30');
        fireEvent.change(costInput, { target: { value: '50' } });
        const descInput = screen.getByDisplayValue('desc-1');
        fireEvent.change(descInput, { target: { value: 'new desc' } });
        const doneButton = screen.getByText('Done');
        fireEvent.click(doneButton);

        expect(mockedAxios.put).toHaveBeenCalledWith("http://localhost:8080/expense/1", {
            cost: 50,
            description: 'new desc',
            budgetRowId: 1,
        });
    });

    test('calls handleClose when close button is clicked', () => {
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(mockHandleClose).toHaveBeenCalled();
    });
});