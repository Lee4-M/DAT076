import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import axios from 'axios';
import ExpenseModal from './ExpenseModal';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({ data: [{ id: 1, category: "Groceries", amount: 100, userId: 1 }] });

describe('ExpenseModal Component', () => {
    const mockHandleClose = jest.fn();
    const mockOnSave = jest.fn();

    beforeEach(async () => {
        jest.clearAllMocks();
        render(
            <ExpenseModal
                show={true}
                handleClose={mockHandleClose}
                onSave={mockOnSave}
            />
        );
        await screen.findByText("Groceries");
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

    test('renders expense description input field', () => {
        const descriptionInput = screen.getByPlaceholderText('Enter description');
        expect(descriptionInput).toBeInTheDocument();
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

    test('Empty cost leads to alert that warns user', async () => {
        window.alert = jest.fn();

        const categoryInput = screen.getByTestId("category-select");
        const costInput = screen.getByPlaceholderText("Enter amount");
        const saveButton = screen.getByRole("button", { name: "Save Expense" });

        await act(async () => {
            fireEvent.change(categoryInput, { target: { value: "Groceries" } });
        });

        expect(costInput).toHaveValue(null);

        await act(async () => {
            fireEvent.click(saveButton);
        });
        expect(window.alert).toHaveBeenCalledWith('Please fill in a cost.');
    });

    test("requests server when clicking Save Expense", async () => {
        const categoryInput = screen.getByTestId("category-select");
        const costInput = screen.getByPlaceholderText("Enter amount");
        const descriptionInput = screen.getByPlaceholderText("Enter description");
        const saveButton = screen.getByRole("button", { name: "Save Expense" });

        mockedAxios.post.mockResolvedValue({
            data: { id: 1, category: "Groceries", cost: 200, description: "Dinner" },
        });

        await act(async () => {
            fireEvent.change(categoryInput, { target: { value: "Groceries" } });
            fireEvent.change(costInput, { target: { value: "200" } });
            fireEvent.change(descriptionInput, { target: { value: "Dinner" } });
        });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/expense", {
            category: "Groceries",
            cost: 200,
            description: "Dinner",
        });
    });

    test('Empty description creates expense with default description = ""', async () => {
        const categoryInput = screen.getByTestId("category-select");
        const costInput = screen.getByPlaceholderText("Enter amount");
        const descriptionInput = screen.getByPlaceholderText("Enter description");
        const saveButton = screen.getByRole("button", { name: "Save Expense" });

        mockedAxios.post.mockResolvedValue({
            data: { id: 1, category: "Groceries", cost: 200, description: "Dinner" },
        });

        await act(async () => {
            fireEvent.change(categoryInput, { target: { value: "Groceries" } });
            fireEvent.change(costInput, { target: { value: "200" } });
        });

        expect(descriptionInput).toHaveValue("");

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/expense", {
            category: "Groceries",
            cost: 200,
            description: "",
        });
    });

    test('shows alert if expense character limit is exceeded', async () => {
        window.alert = jest.fn();
        await screen.findByText("Groceries");

        const categoryInput = screen.getByTestId("category-select");
        const costInput = screen.getByPlaceholderText("Enter amount");
        const saveButton = screen.getByRole("button", { name: "Save Expense" });

        await act(async () => {
            fireEvent.change(categoryInput, { target: { value: "Groceries" } });
        });
        fireEvent.change(costInput, { target: { value: "5478954896745589764894578945986470" } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(window.alert).toHaveBeenCalledWith('Character limit (20) for cost exceeded.');
    });

    test("calls onSave and handleClose when clicking Save Expense", async () => {
        await screen.findByText("Groceries");

        const categoryInput = screen.getByTestId("category-select");
        const costInput = screen.getByPlaceholderText("Enter amount");
        const descriptionInput = screen.getByPlaceholderText("Enter description");
        const saveButton = screen.getByRole("button", { name: "Save Expense" });

        await act(async () => {
            fireEvent.change(categoryInput, { target: { value: "Groceries" } });
        });
        fireEvent.change(costInput, { target: { value: "200" } });
        fireEvent.change(descriptionInput, { target: { value: "Dinner" } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(mockOnSave).toHaveBeenCalled();
        expect(mockHandleClose).toHaveBeenCalled();
    });
});
