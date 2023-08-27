import * as types from '../types';

export function clickButtonRequest() {
  return {
    type: types.BOTAO_CLICADO_REQUEST,
  };
}

export function clickButtonSuccess() {
  return {
    type: types.BOTAO_CLICADO_SUCCESS,
  };
}

export function clickButtonFailure() {
  return {
    type: types.BOTAO_CLICADO_FAILURE,
  };
}
