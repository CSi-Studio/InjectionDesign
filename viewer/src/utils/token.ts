export default {
  get() {
    return window.localStorage.getItem('TOKEN');
  },
  save(token: string) {
    window.localStorage.setItem('TOKEN', token);
  },
};
 