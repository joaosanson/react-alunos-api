import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
export default function Aluno({ match }) {
  const id = get(match, 'params.id', 0);
  const [user, setUser] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    idade: '',
    peso: '',
    altura: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { nome, sobrenome, email, idade, peso, altura } = user;

    let formErrors = false;

    if (nome.length < 3 || sobrenome.length > 255) {
      toast.error('Nome precisa ter entre 3 e 255 caracteres.');
      formErrors = true;
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      toast.error('Sobrenome precisa ter entre 3 e 255 caracteres.');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Email precisa ter entre 3 e 255 caracteres.');
      formErrors = true;
    }

    if (!isInt(idade)) {
      toast.error('Idade precisa ser um número inteiro.');
      formErrors = true;
    }

    if (!isInt(peso) || isFloat(peso)) {
      toast.error('Peso precisa ser um número inteiro ou de ponto flutuante.');
      formErrors = true;
    }

    if (!isInt(altura) || isFloat(altura)) {
      toast.error(
        'Altura precisa ser um número inteiro ou de ponto flutuante.',
      );
      formErrors = true;
    }

    if (formErrors) return;
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar aluno' : 'Novo Aluno'}</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={user.nome}
          onChange={handleChange}
          placeholder="Nome"
        />
        <input
          type="text"
          name="sobrenome"
          value={user.sobrenome}
          onChange={handleChange}
          placeholder="Sobrenome"
        />
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="number"
          name="idade"
          value={user.idade}
          onChange={handleChange}
          placeholder="Idade"
        />
        <input
          type="text"
          name="peso"
          value={user.peso}
          onChange={handleChange}
          placeholder="Peso"
        />
        <input
          type="text"
          name="altura"
          value={user.altura}
          onChange={handleChange}
          placeholder="Altura"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
