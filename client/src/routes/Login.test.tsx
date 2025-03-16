import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import axios from 'axios'
import LoginScreen from "./LoginScreen"
import { MemoryRouter } from 'react-router';
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Login screen', () => {
  test('when Log In button is clicked, sends the username and password to the server', async () => {
    render(
      <MemoryRouter >
        <LoginScreen />
      </MemoryRouter>
    );

    const userNameField = screen.findByPlaceholderText("Username");
    const passwordField = screen.findByPlaceholderText("Password");
    const loginButton = screen.getByRole('button', {name: "Log In"});

    await act(async () => {
      fireEvent.change(await userNameField, {target: {value: "UserName"}});
      fireEvent.change(await passwordField, {target: {value: "Password12345"}});
      fireEvent.click(await loginButton);
    });

    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/user/login",
      {username : "UserName", password: "Password12345"}
    );
  })
});
