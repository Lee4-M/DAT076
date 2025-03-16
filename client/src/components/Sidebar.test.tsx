import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Sidebar } from '../components/Sidebar';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Sidebar Component', () => {
  let isEditing: boolean;
  let mockOnSave: jest.Mock;
  let rerender: (ui: React.ReactElement) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });

    // This is required as saving budgets is not the sidebar's responsibility.
    mockOnSave = jest.fn(() => { isEditing = !isEditing; });

    const renderResult = render(
      <MemoryRouter>
        <Sidebar
          loadBudgets={jest.fn()} 
          expenses={{}} 
          budgets={[]} 
          isEditing={false} 
          handleSaveBudgetRows={mockOnSave}  
        />
      </MemoryRouter>
    );

    rerender = renderResult.rerender;
  });

  test('renders Sidebar component', () => {
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  // Expense related tests
  test('renders the add expense button', () => {
    const addExpenseButton = screen.getByRole('button', { name: "Add expense" });
    expect(addExpenseButton).toBeInTheDocument();
  });

  test('opens expense modal when add expense button is clicked', async () => {
    const addExpenseButton = screen.getByRole('button', { name: "Add expense" });

    await act(async () => {
      fireEvent.click(addExpenseButton);
    });
    
    const expenseModal = screen.getByTestId('expense-modal');
    expect(expenseModal).toBeInTheDocument();
  });

  //Budget related tests
  test('renders the add budget button', () => {
    const addBudgetButton = screen.getByRole('button', { name: "Add budget" });
    expect(addBudgetButton).toBeInTheDocument();
  });

  test('opens budget modal when add budget button is clicked', async () => {
    const addBudgetButton = screen.getByRole('button', { name: "Add budget" });

    await act(async () => {
      fireEvent.click(addBudgetButton);
    });
    
    const budgetModal = screen.getByTestId('budget-modal');
    expect(budgetModal).toBeInTheDocument();
  });

  test('renders the edit budget button', () => {
    const editExpenseButton = screen.getByRole('button', { name: "Edit budget" });
    expect(editExpenseButton).toBeInTheDocument();
  });

  test('When edit button is clicked, it is changed to save changes button', async () => {
    const editButton = screen.getByRole('button', { name: "Edit budget" });

    await act(async () => {
      fireEvent.click(editButton);
    });

    rerender(
      <MemoryRouter>
        <Sidebar
          loadBudgets={jest.fn()} 
          expenses={{}} 
          budgets={[]} 
          isEditing={isEditing}
          handleSaveBudgetRows={mockOnSave}  
        />
      </MemoryRouter>
    );

    const saveButton = screen.getByRole('button', { name: "Save changes" });
    expect(saveButton).toBeInTheDocument();
  });

  // Sign out button tests
  test('renders the sign out button', () => {
    const signOutButton = screen.getByRole('button', { name: "Sign out" });
    expect(signOutButton).toBeInTheDocument();
  });
});