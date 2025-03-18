import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import axios from 'axios'
import RegisterScreen from "./RegisterScreen"
import { MemoryRouter } from 'react-router';
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Register screen', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: [] });
        render(
            <MemoryRouter >
                <RegisterScreen />
            </MemoryRouter>
        );
    });

    test('renders the register username input field', () => {
        const userNameField = screen.getByPlaceholderText("Username");
        expect(userNameField).toBeInTheDocument();
    });

    test('renders the register password input field', () => {
        const passwordField = screen.getByPlaceholderText("Password");
        expect(passwordField).toBeInTheDocument();
    });

    test('renders the register button', () => {
        const registerButton = screen.getByRole('button', { name: "Register" });
        expect(registerButton).toBeInTheDocument();
    });

    test('renders the login link', () => {
        const loginLink = screen.getByRole('link', { name: "Login" });
        expect(loginLink).toBeInTheDocument();
    });

    test('renders the Budgie logo', () => {
        const budgieLogo = screen.getByAltText("Budgie Logo");
        expect(budgieLogo).toBeInTheDocument();
    });

    test('renders the description of the application', () => {
        const description = screen.getByText("Register for Budgie to start budgeting your money. Keep track of your expenses and income.");
        expect(description).toBeInTheDocument();
    });

    test('when Register button is clicked, sends the username and password to the server', async () => {

        const userNameField = screen.findByPlaceholderText("Username");
        const passwordField = screen.findByPlaceholderText("Password");
        const registerButton = screen.getByRole('button', { name: "Register" });

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "UserName" } });
            fireEvent.change(await passwordField, { target: { value: "Password12345" } });
            fireEvent.click(await registerButton);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/user",
            { username: "UserName", password: "Password12345" }
        );
    })

    test('when Register button is clicked with empty username or password, error is displayed', async () => {

        const userNameField = screen.findByPlaceholderText("Username");
        const passwordField = screen.findByPlaceholderText("Password");
        const registerButton = screen.getByRole('button', { name: "Register" });

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "" } });
            fireEvent.change(await passwordField, { target: { value: "Password12345" } });
            fireEvent.click(await registerButton);
        });

        const errorMessage = screen.getByText("Please fill all fields");
        expect(errorMessage).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "Username" } });
            fireEvent.change(await passwordField, { target: { value: "" } });
            fireEvent.click(await registerButton);
        });

        expect(errorMessage).toBeInTheDocument();
    })

    test('when Register button is clicked with username or password with inappropriate length, error is displayed', async () => {

        const userNameField = screen.findByPlaceholderText("Username");
        const passwordField = screen.findByPlaceholderText("Password");
        const registerButton = screen.getByRole('button', { name: "Register" });

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "A" } });
            fireEvent.change(await passwordField, { target: { value: "Password12345" } });
            fireEvent.click(await registerButton);
        });

        const errorMessage = screen.getByText("Username must be between 3 and 128 characters and password must be between 12 and 128 characters");
        expect(errorMessage).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "Username" } });
            fireEvent.change(await passwordField, { target: { value: "A" } });
            fireEvent.click(await registerButton);
        });

        expect(errorMessage).toBeInTheDocument();
    })

    test('when Register button is clicked with invalid username, error is displayed', async () => {

        const userNameField = screen.findByPlaceholderText("Username");
        const passwordField = screen.findByPlaceholderText("Password");
        const registerButton = screen.getByRole('button', { name: "Register" });

        await act(async () => {
            fireEvent.change(await userNameField, { target: { value: "User@Name" } });
            fireEvent.change(await passwordField, { target: { value: "Password12345" } });
            fireEvent.click(await registerButton);
        });

        const errorMessage = screen.getByText("Username must be alphanumeric");
        expect(errorMessage).toBeInTheDocument();
    })
});
