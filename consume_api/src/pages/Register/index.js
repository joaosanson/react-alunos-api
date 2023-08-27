import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';

import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Register() {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.user.id);
  const nomeStored = useSelector((state) => state.auth.user.nome);
  const emailStored = useSelector((state) => state.auth.user.email);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [user, setUser] = useState({
    nome: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!id) return;
    setUser((prev) => ({
      ...prev,
      nome: nomeStored,
      email: emailStored,
    }));
  }, [emailStored, id, nomeStored]);

  function handleChange(event) {
    const { id, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSubmit(event) {
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
    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres', {
        pauseOnFocusLoss: false,
      });
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ nome, email, password, id }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>{id ? 'Editar dados' : 'Crie sua conta'}</h1>

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

        <button type="submit">
          {id ? 'Enviar dados' : 'Criar Minha Conta'}
        </button>
      </Form>
    </Container>
  );
}
