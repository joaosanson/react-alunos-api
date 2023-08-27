import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';

export default function Register() {
  const [user, setUser] = useState({
    nome: '',
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

  async function handleSubmit(event) {
    // eslint-disable-next-line no-unused-vars
    const { nome, email, password } = user;
    event.preventDefault();
    let formErrors = false;
    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres', {
        pauseOnFocusLoss: false,
      });
    }
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

    if (!formErrors) {
      try {
        await axios.post('/users/', {
          nome,
          password,
          email,
        });

        toast.success('Cadastro realizado com sucesso.');
        history.push('/login');
      } catch (error) {
        const errors = get(error, 'response.data.errors', []);
        errors.map((error) => toast.error(error, { pauseOnFocusLoss: false }));
      }
    }
  }

  return (
    <Container>
      <h1>Crie sua conta</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            id="nome"
            value={user.nome}
            onChange={handleChange}
            placeholder="Seu nome"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Seu email"
          />
        </label>
        <label htmlFor="password">
          Senha:
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Sua senha"
          />
        </label>

        <button type="submit">Criar Minha Conta</button>
      </Form>
    </Container>
  );
}
