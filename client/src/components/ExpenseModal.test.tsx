import { render, fireEvent, screen } from '@testing-library/react';
import ExpenseModal from './ExpenseModal';


describe('ExpenseModal Component', () => {
    test('changing inputs work', () => {
        const handleClose = jest.fn();
        const onSave = jest.fn();

        render(<ExpenseModal show={true} handleClose={handleClose} onSave={onSave} />);

        fireEvent.change(screen.getByPlaceholderText('Enter amount'), {
            target: { value: 25 }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter description'), {
            target: { value: 'Lunch at a restaurant' }
        });

        expect(screen.getByPlaceholderText('Enter amount')).toHaveValue(25);
        expect(screen.getByPlaceholderText('Enter description')).toHaveValue('Lunch at a restaurant');
    });

    test('error message is displayed when invalid input is given', () => {
        const handleClose = jest.fn();
        const onSave = jest.fn();

        const alertMock = jest.spyOn(window, 'alert').mockImplementation();

        render(<ExpenseModal show={true} handleClose={handleClose} onSave={onSave} />);

        fireEvent.change(screen.getByPlaceholderText('Enter amount'), {
            target: { value: 'abc' }
        });

        fireEvent.change(screen.getByPlaceholderText('Enter description'), {
            target: { value: '' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Save Expense' }));

        expect(alertMock).toHaveBeenCalledWith('Please fill in all fields correctly.');
    });

});