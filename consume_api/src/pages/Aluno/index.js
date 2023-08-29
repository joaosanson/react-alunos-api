import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Aluno({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');
  const [user, setUser] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    idade: '',
    peso: '',
    altura: '',
  });
  const [foto, setFoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, 'Fotos[0].url', '');
        setFoto(Foto);

        setUser((prev) => ({
          ...prev,
          nome: data.nome,
          sobrenome: data.sobrenome,
          email: data.email,
          idade: data.idade,
          peso: data.peso,
          altura: data.altura,
        }));

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const status = get(error, 'response.status', 0);
        const errors = get(error, 'response.data.erros', []);

        if (status === 400) {
          errors.map((err) => toast.error(err));
          history.push('/');
        }
      }
    }

    getData();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
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

    if (!isInt(String(idade))) {
      toast.error('Idade precisa ser um número inteiro.');
      formErrors = true;
    }

    if (!isFloat(String(peso))) {
      toast.error('Peso precisa ser um número inteiro ou de ponto flutuante.');
      formErrors = true;
    }

    if (!isFloat(String(altura))) {
      toast.error(
        'Altura precisa ser um número inteiro ou de ponto flutuante.',
      );
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        // Editando
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) editado(a) com sucesso.');
      } else {
        // Criando
        const { data } = await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) criado(a) com sucesso.');
        history.push(`/aluno/${data.id}/edit`);
      }
    } catch (error) {
      const status = get(error, 'response.status', 0);
      const data = get(error, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((err) => toast.error(err));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) {
        dispatch(actions.loginFailure());
      }

      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Editar aluno' : 'Novo Aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? (
            <img src={foto} alt={user.nome} />
          ) : (
            <FaUserCircle size={180} />
          )}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

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
