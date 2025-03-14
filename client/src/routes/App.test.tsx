import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './App';

import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

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

beforeEach(async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});

describe('App Component', () => {
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

  test('renders the edit budget button', () => {
    const editExpenseButton = screen.getByRole('button', { name: "Edit budget" });
    expect(editExpenseButton).toBeInTheDocument();
  });

  // Budget related tests
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

  // Sign out button tests
  test('renders the sign out button', () => {
    const signOutButton = screen.getByRole('button', { name: "Sign out" });
    expect(signOutButton).toBeInTheDocument();
  });
});


