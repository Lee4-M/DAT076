import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BudgetRowComponent } from './BudgetRowComponent';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BudgetRowComponent', () => {
    const mockLoadBudgets = jest.fn();
    const mockLoadExpenses = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnSave = jest.fn();

    const budget = {
        id: 1,
        userId: 1,
        category: 'Food',
        amount: 100,
    };

    const expenses = [
        { id: 1, budgetRowId: 1, cost: 30, description: "desc-1" },
        { id: 2, budgetRowId: 1, cost: 80, description: "desc-2" },
    ];

    let isEditing: boolean;

    const renderComponent = () => {
        render(
            <BudgetRowComponent
                budget={budget}
                loadBudgets={mockLoadBudgets}
                expenses={expenses}
                loadExpenses={mockLoadExpenses}
                isEditing={isEditing}
                handleChangeBudgets={mockOnEdit}
                handleSaveBudgetRows={mockOnSave}
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

    test('renders BudgetRowComponent', () => {
        const budgetRow = screen.getByTestId('budget-row');
        expect(budgetRow).toBeInTheDocument();
    });

    test('renders budget category', () => {
        const category = screen.getByText('Food');
        expect(category).toBeInTheDocument();
    });

    test('renders budget amount', () => {
        const amount = screen.getByText('100 :-');
        expect(amount).toBeInTheDocument();
    });

    test('renders total expenses', () => {
        const totalExpenses = screen.getByTestId('total-expenses');
        expect(totalExpenses).toBeInTheDocument();
    });

    test('renders variance', () => {
        const variance = screen.getByTestId('variance');
        expect(variance).toBeInTheDocument();
    });

    test('renders correct total expenses', () => {
        const totalExpenses = screen.getByTestId('total-expenses');
        expect(totalExpenses).toHaveTextContent('110 :-');
    });

    test('renders correct variance', () => {
        const variance = screen.getByTestId('variance');
        expect(variance).toHaveTextContent('-10 :-');
    });

    test('variance is red when expenses exceed budget', () => {
        const variance = screen.getByTestId('variance');
        expect(variance).toHaveStyle('color: rgb(184, 0, 0)');
    });

    test('can toggle editing state', () => {
        setIsEditing(true);
        renderComponent();

        expect(screen.getByDisplayValue('Food')).toBeEnabled();
        expect(screen.getByDisplayValue('100')).toBeEnabled();
    });

    test('calls onEdit when budget category input is changed', () => {
        setIsEditing(true);
        renderComponent();

        const categoryInput = screen.getByDisplayValue('Food');
        fireEvent.change(categoryInput, { target: { value: 'Groceries' } });

        expect(mockOnEdit).toHaveBeenCalledWith(1, { category: 'Groceries' });
    });

    test('calls onEdit when budget amount input is changed', () => {
        setIsEditing(true);
        renderComponent();

        const amountInput = screen.getByDisplayValue('100');
        fireEvent.change(amountInput, { target: { value: '150' } });

        expect(mockOnEdit).toHaveBeenCalledWith(1, { amount: 150 });
    });

    test('calls onSave when Enter key is pressed in amount input', () => {
        setIsEditing(true);
        renderComponent();

        const amountInput = screen.getByDisplayValue('100');
        fireEvent.change(amountInput, { target: { value: '150' } });
        fireEvent.keyDown(amountInput, { key: 'Enter', code: 'Enter' });

        expect(mockOnSave).toHaveBeenCalled();
    });

    test('toggles expense accordion when budget row is clicked', () => {
        const budgetRow = screen.getByTestId('budget-row');
        fireEvent.click(budgetRow);

        const expenseAccordion = screen.getByTestId('expense-accordion');
        expect(expenseAccordion).toBeInTheDocument();

        fireEvent.click(budgetRow);
        expect(expenseAccordion).not.toBeInTheDocument();
    });

    test('requests server when delete button is clicked', async () => {
        const budgetRow = screen.getByTestId('budget-row');
        fireEvent.click(budgetRow);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/budget/${budget.id}`);
    });
});
