import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import axios from 'axios';
import BudgetItemModal from './BudgetModal';
import { addBudget } from '../api/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../api/api", () => ({
    addBudget: jest.fn(() => Promise.resolve({ id: 1, category: "Groceries", amount: 200 }))
}));

describe('BudgetModal Component', () => {
    const mockHandleClose = jest.fn();
    const mockOnSave = jest.fn();

    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });

    beforeEach(() => {
        render(
            <BudgetItemModal 
                show={true}
                handleClose={mockHandleClose}
                onSave={mockOnSave}
            />
        );
    });

    test('renders BudgetItemModal component', () => {
        const modal = screen.getByTestId('budget-modal');
        expect(modal).toBeInTheDocument();
    });

    test('renders category input field', () => {
        const categoryInput = screen.getByPlaceholderText('Enter category name');
        expect(categoryInput).toBeInTheDocument();
    });

    test('renders budget amount input field', () => {
        const amountInput = screen.getByPlaceholderText('Enter amount');
        expect(amountInput).toBeInTheDocument();
    });

    test('renders save budget button', () => {
        const saveButton = screen.getByText('Save Budget');
        expect(saveButton).toBeInTheDocument();
    });

    test('renders close modal panel button', () => {
        const closeButton = screen.getByText('Close');
        expect(closeButton).toBeInTheDocument();
    });

    test('calls handleClose when Close button is clicked', () => {
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        expect(mockHandleClose).toHaveBeenCalled();
    });

    test('Empty category leads to alert that warns user', () => {
        window.alert = jest.fn();
        const saveButton = screen.getByText('Save Budget');
        fireEvent.click(saveButton);
        expect(window.alert).toHaveBeenCalledWith('Please fill in a category name.');
    });

    test('Empty budget amount creates budget with default amount = 0', async () => {
        const categoryInput = screen.getByPlaceholderText('Enter category name');
        const amountInput = screen.getByPlaceholderText('Enter amount');
        const saveButton = screen.getByText('Save Budget');
    
        fireEvent.change(categoryInput, { target: { value: 'Groceries' } });
        fireEvent.change(amountInput, { target: { value: '' } });
    
        expect(amountInput).toHaveValue(null);
    
        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(addBudget).toHaveBeenCalledWith("Groceries", 0);
    });
    

    test('shows alert if character limit is exceeded', () => {
        window.alert = jest.fn();
        const categoryInput = screen.getByPlaceholderText('Enter category name');
        const amountInput = screen.getByPlaceholderText('Enter amount');
        const saveButton = screen.getByText('Save Budget');

        fireEvent.change(categoryInput, { target: { value: 'thisbudgetislongerthantwentycharacters' } });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(saveButton);

        expect(window.alert).toHaveBeenCalledWith('Character limit of 20 exceeded.');
    });

    test('Allows user to enter a valid category and amount', async () => {
        const categoryInput = screen.getByPlaceholderText('Enter category name');
        const amountInput = screen.getByPlaceholderText('Enter amount');

        fireEvent.change(categoryInput, { target: { value: 'Groceries' } });
        fireEvent.change(amountInput, { target: { value: '2000' } });

        expect(categoryInput).toHaveValue("Groceries");
        expect(amountInput).toHaveValue(2000);
    });

    test("calls onSave and handleClose when clicking Save Budget", async () => {
        const categoryInput = screen.getByPlaceholderText("Enter category name");
        const amountInput = screen.getByPlaceholderText("Enter amount");
        const saveButton = screen.getByRole("button", { name: "Save Budget" });
    
        fireEvent.change(categoryInput, { target: { value: "Groceries" } });
        fireEvent.change(amountInput, { target: { value: "200" } });
    
        await act(async () => {
          fireEvent.click(saveButton);
        });
    
        expect(mockOnSave).toHaveBeenCalled();
        expect(mockHandleClose).toHaveBeenCalled();
    });
});