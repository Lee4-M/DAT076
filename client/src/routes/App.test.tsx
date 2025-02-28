import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './App';

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>


// Implement this for future test cases
mockedAxios.get.mockResolvedValue({
  data: [
    {
      category: 'Test Category',
      cost: 100,
      expenses: [],
      result: 0
    }
  ]
});

beforeEach(() => {
  render(<App />);
});

describe('App Component', () => {
  // Expense related tests
  test('renders the add expense button', () => {
    const addExpenseButton = screen.getByRole('button', { name: "Add expense" });
    expect(addExpenseButton).toBeInTheDocument();
  });

  test('opens expense modal when add expense button is clicked', () => {
    const addExpenseButton = screen.getByRole('button', { name: "Add expense" });
    fireEvent.click(addExpenseButton);
    const expenseModal = screen.getByTestId('expense-modal');
    expect(expenseModal).toBeInTheDocument();
  });

  test('renders the edit expense button', () => {
    const editExpenseButton = screen.getByRole('button', { name: "Edit expense" });
    expect(editExpenseButton).toBeInTheDocument();
  });

  // Budget related tests
  test('renders the add budget button', () => {
    const addBudgetButton = screen.getByRole('button', { name: "Add budget" });
    expect(addBudgetButton).toBeInTheDocument();
  });

  test('opens budget modal when add budget button is clicked', () => {
    const addBudgetButton = screen.getByRole('button', { name: "Add budget" });
    fireEvent.click(addBudgetButton);
    const budgetModal = screen.getByTestId('budget-modal');
    expect(budgetModal).toBeInTheDocument();
  });

  // Pie chart tests
  test('renders the pie chart', () => {
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
  });

  // Sign out button tests
  test('renders the sign out button', () => {
    const signOutButton = screen.getByRole('button', { name: "Sign out" });
    expect(signOutButton).toBeInTheDocument();
  });
});


