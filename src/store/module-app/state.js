import Cookies from 'js-cookie';

export default function () {
  return {
    crumbs: [],
    token: Cookies.get('token'),
    user: JSON.parse(localStorage.getItem('user')),
    canI: [],
  };
}
