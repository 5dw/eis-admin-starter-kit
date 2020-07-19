import Cookies from 'js-cookie';

export function SET_CRUMBS(state, cs) {
  state.crumbs = cs;
}

export function SET_TOKEN(state, token) {
  state.token = token;
  Cookies.set('token', token);
}

export function SET_USER(state, u) {
  state.user = u;
  localStorage.setItem('user', JSON.stringify(u));
}

export function ADD_CANI(state, c) {
  if (state.canI && state.canI.findIndex(ci => ci.url === c.url) < 0) {
    state.canI.push({ url: c.url, can: c.can });
  }
}

export function CLEAR_CANI(state) {
  state.canI = [];
}
