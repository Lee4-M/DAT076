import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import axios from 'axios'
import LoginScreen from "./LoginScreen"
import { MemoryRouter } from 'react-router';
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Login screen', () => {

     beforeEach(() => {
          jest.clearAllMocks();
          mockedAxios.get.mockResolvedValue({ data: [] });
          render(
               <MemoryRouter >
                    <LoginScreen />
               </MemoryRouter>
          );
     });

     test('renders the login username input field', () => {
          const userNameField = screen.getByPlaceholderText("Username");
          expect(userNameField).toBeInTheDocument();
     });

     test('renders the login password input field', () => {
          const passwordField = screen.getByPlaceholderText("Password");
          expect(passwordField).toBeInTheDocument();
     });

     test('renders the login button', () => {
          const loginButton = screen.getByRole('button', { name: "Log In" });
          expect(loginButton).toBeInTheDocument();
     });

     test('renders the Budgie logo', () => {
          const budgieLogo = screen.getByAltText("Budgie Logo");
          expect(budgieLogo).toBeInTheDocument();
     });

     test('renders the description of the application', () => {
          const description = screen.getByText("Budget your money with Budgie. Keep track of your expenses and income.");
          expect(description).toBeInTheDocument();
     });

     test('when Log In button is clicked, sends the username and password to the server', async () => {

          const userNameField = screen.findByPlaceholderText("Username");
          const passwordField = screen.findByPlaceholderText("Password");
          const loginButton = screen.getByRole('button', { name: "Log In" });

          await act(async () => {
               fireEvent.change(await userNameField, { target: { value: "UserName" } });
               fireEvent.change(await passwordField, { target: { value: "Password12345" } });
               fireEvent.click(await loginButton);
          });

          expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/user/login",
               { username: "UserName", password: "Password12345" }
          );
     })

     test('when Log In button is clicked with empty username or password, error is displayed', async () => {

          const userNameField = screen.findByPlaceholderText("Username");
          const passwordField = screen.findByPlaceholderText("Password");
          const loginButton = screen.getByRole('button', { name: "Log In" });

          await act(async () => {
               fireEvent.change(await userNameField, { target: { value: "" } });
               fireEvent.change(await passwordField, { target: { value: "Password12345" } });
               fireEvent.click(await loginButton);
          });

          const errorMessage = screen.getByText("Please enter username and password");
          expect(errorMessage).toBeInTheDocument();

          await act(async () => {
               fireEvent.change(await userNameField, { target: { value: "UserName" } });
               fireEvent.change(await passwordField, { target: { value: "" } });
               fireEvent.click(await loginButton);
          });

          expect(errorMessage).toBeInTheDocument();
     })
});
