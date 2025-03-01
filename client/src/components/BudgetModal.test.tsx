import { render, fireEvent, screen } from '@testing-library/react';
import BudgetItemModal from './BudgetModal';

describe('BudgetItemModal Component', () => {
    test('changing inputs in text fields will give that value', () => {
        const handleClose = jest.fn();
        const onSave = jest.fn();

        render(<BudgetItemModal show={true} handleClose={handleClose} onSave={onSave} />);

        fireEvent.change(screen.getByPlaceholderText('Enter category name'), {
            target: { value: 'Restaurant' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter amount'), {
            target: { value: 25 }
        });
        expect(screen.getByPlaceholderText('Enter category name')).toHaveValue('Restaurant');
        expect(screen.getByPlaceholderText('Enter amount')).toHaveValue(25);
    });

    test('error message is displayed when invalid input is given', () => {
        const handleClose = jest.fn();
        const onSave = jest.fn();

        const alertMock = jest.spyOn(window, 'alert').mockImplementation();

        render(<BudgetItemModal show={true} handleClose={handleClose} onSave={onSave} />);

        fireEvent.change(screen.getByPlaceholderText('Enter category name'), {
            target: { value: '' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Save Budget' }));

        expect(alertMock).toHaveBeenCalledWith('Please fill in a category name.');
    });

});