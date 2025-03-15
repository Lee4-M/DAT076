// import { render, fireEvent, act } from '@testing-library/react';
import { render, fireEvent} from '@testing-library/react';
import { screen } from '@testing-library/dom';
import axios from 'axios';
import ExpenseModal from './ExpenseModal';
// import { addExpense } from '../api/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.mock("../api/api", () => ({
//     addExpense: jest.fn(() => Promise.resolve({ id: 1, category: "Groceries", cost: 150 }))
// }));

describe('ExpenseModal Component', () => {
    const mockHandleClose = jest.fn();
    const mockOnSave = jest.fn();

    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });

    beforeEach(() => {
        render(
            <ExpenseModal 
                show={true}
                handleClose={mockHandleClose}
                onSave={mockOnSave}
            />
        );
    });

    test('renders ExpenseModal component', () => {
        const modal = screen.getByTestId('expense-modal');
        expect(modal).toBeInTheDocument();
    });

    test('renders category input field', () => {
        const categoryInput = screen.getByTestId('category-select');
        expect(categoryInput).toBeInTheDocument();
    });

    test('renders expense cost input field', () => {
        const costInput = screen.getByPlaceholderText('Enter amount');
        expect(costInput).toBeInTheDocument();
    });

    test('renders save expense button', () => {
        const saveButton = screen.getByText('Save Expense');
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
        const saveButton = screen.getByText('Save Expense');
        fireEvent.click(saveButton);
        expect(window.alert).toHaveBeenCalledWith('Please select a category.');
    });

    // test('Empty cost leads to alert that warns user', () => {
    //     window.alert = jest.fn();
    //     const categoryInput = screen.getByTestId('category-select');
    //     const saveButton = screen.getByText('Save Expense');

    //     fireEvent.change(categoryInput, { target: { value: 'abc' } });
    //     fireEvent.click(saveButton);
    //     expect(window.alert).toHaveBeenCalledWith('Please fill in a cost.');
    // });
    

    // test('shows alert if character limit is exceeded', () => {
    //     window.alert = jest.fn();
    //     const categoryInput = screen.getByTestId('category-select');
    //     const costInput = screen.getByPlaceholderText('Enter amount');
    //     const saveButton = screen.getByText('Save Expense');

    //     fireEvent.change(categoryInput, { target: { value: 'thisexpenseislongerthantwentycharacters' } });
    //     fireEvent.change(costInput, { target: { value: '100' } });
    //     fireEvent.click(saveButton);

    //     expect(window.alert).toHaveBeenCalledWith('Character limit of 20 exceeded.');
    // });

    // test('Allows user to enter a valid category and amount', async () => {
    //     const categoryInput = screen.getByPlaceholderText('Enter category name');
    //     const amountInput = screen.getByPlaceholderText('Enter amount');

    //     fireEvent.change(categoryInput, { target: { value: 'Groceries' } });
    //     fireEvent.change(amountInput, { target: { value: '2000' } });

    //     expect(categoryInput).toHaveValue("Groceries");
    //     expect(amountInput).toHaveValue(2000);
    // });

    // test("calls onSave and handleClose when clicking Save Budget", async () => {
    //     const categoryInput = screen.getByPlaceholderText("Enter category name");
    //     const amountInput = screen.getByPlaceholderText("Enter amount");
    //     const saveButton = screen.getByRole("button", { name: "Save Budget" });
    
    //     fireEvent.change(categoryInput, { target: { value: "Groceries" } });
    //     fireEvent.change(amountInput, { target: { value: "200" } });
    
    //     await act(async () => {
    //       fireEvent.click(saveButton);
    //     });
    
    //     expect(mockOnSave).toHaveBeenCalled();
    //     expect(mockHandleClose).toHaveBeenCalled();
    // });
});