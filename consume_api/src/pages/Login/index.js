import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';

import Loading from '../../components/Loading';

export default function Login(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/');

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  function handleChange(event) {
    const { id, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleSubmit(event) {
    const { email, password } = user;
    let formErrors = false;

    event.preventDefault();

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido', {
        pauseOnFocusLoss: false,
      });
    }
    if (password.length < 6 || password.length > 50) {
      // eslint-disable-next-line no-unused-vars
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres', {
        pauseOnFocusLoss: false,
      });
    }

    if (formErrors) return;

    dispatch(actions.loginRequest({ email, password, prevPath }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Seu e-mail"
        />
        <input
          type="password"
          id="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Sua senha"
        />
        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
