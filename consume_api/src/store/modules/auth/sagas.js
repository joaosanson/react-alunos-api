import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('Login efetuado com sucesso.', { pauseOnFocusLoss: false });

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    history.push(payload.prevPath);
  } catch (error) {
    toast.error('Usuário ou senhas inválidos.', { pauseOnFocusLoss: false });

    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token');
  if (!token) return;
  axios.defaults.Authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload;

  try {
    if (id) {
      yield call(axios.put, '/users', {
        email,
        nome,
        password: password || undefined,
      });
      toast.success('Conta alterada com sucesso.', { pauseOnFocusLoss: false });
      yield put(actions.registerUpdatedSuccess({ nome, email, password }));
    } else {
      yield call(axios.post, '/users', {
        email,
        nome,
        password,
      });
      toast.success('Conta criada com sucesso.', { pauseOnFocusLoss: false });
      yield put(actions.registerCreatedSuccess({ nome, email, password }));
      history.push('/login');
    }
  } catch (error) {
    const errors = get(error, 'response.data.errors', []);
    const status = get(error, 'response.status', 0);

    if (status === 401) {
      toast.error('Voce precisa fazer login novamente.', {
        pauseOnFocusLoss: false,
      });
      yield put(actions.loginFailure());
      return history.push('login');
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error('Erro desconhecido', { pauseOnFocusLoss: false });
    }

    yield put(actions.registerFailure());
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
