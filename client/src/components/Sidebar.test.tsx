import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Sidebar } from '../components/Sidebar';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { Budget, updateBudgetRows } from '../api/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Sidebar Component', () => {
  let isEditing: boolean;
  let mockOnSave: jest.Mock;
  let rerender: (ui: React.ReactElement) => void;

  const budgets: Budget[] = [
    { id: 1, category: 'Food', amount: 100, userId: 1 },
    { id: 2, category: 'Transport', amount: 150, userId: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });

    isEditing = false;
    
    mockOnSave = jest.fn(async () => {
      isEditing = !isEditing;
      await updateBudgetRows(budgets);
    });

    const renderResult = render(
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

  test('calls updateBudgetRows and requests server when clicking Save changes', async () => {
    rerender(
      <MemoryRouter>
        <Sidebar
          loadBudgets={jest.fn()} 
          expenses={{}} 
          budgets={budgets} 
          isEditing={true} 
          handleSaveBudgetRows={mockOnSave}  
        />
      </MemoryRouter>
    );

    const saveButton = screen.getByRole('button', { name: 'Save changes' });

    mockedAxios.put.mockResolvedValue({
      data: budgets,
    });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockedAxios.put).toHaveBeenCalledWith("http://localhost:8080/budgets", {
      ids: budgets.map(budget => budget.id),
      categories: budgets.map(budget => budget.category),
      amounts: budgets.map(budget => budget.amount),
    });
  });

  // PieChart testing
  test('renders the PieChart component', () => {
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
  });

  test('PieChart handles empty budgets and expenses gracefully', () => {
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
    expect(pieChart).toHaveTextContent('No data to display');
  });

  test('PieChart handles non-empty budgets and expenses', async () => {
    const budgets : Budget[] = [{ id: 1, category: 'Food', amount: 200, userId: 1 }];
    const expenses = { 1: [{ id: 1, budgetRowId: 1, description: 'Groceries', cost: 50 }] };

    rerender(
      <MemoryRouter>
        <Sidebar
          loadBudgets={jest.fn()} 
          expenses={expenses} 
          budgets={budgets} 
          isEditing={false} 
          handleSaveBudgetRows={mockOnSave}  
        />
      </MemoryRouter>
    );

    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
    expect(pieChart).toHaveTextContent('Food');
  });

  // Sign out button tests
    test('renders the sign out button', () => {
      const signOutButton = screen.getByRole('button', { name: "Sign out" });
      expect(signOutButton).toBeInTheDocument();
    });
  
    test('when sign out button is clicked, user is logged out', async () => {
      const signOutButton = screen.getByRole('button', { name: "Sign out" });
  
      await act(async () => {
        fireEvent.click(signOutButton);
      });
  
      expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/user/logout");
    });
});
