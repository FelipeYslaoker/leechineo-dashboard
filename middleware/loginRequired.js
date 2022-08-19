export default async function ({ store, redirect, route, app }) {
  if (!store.state.auth.loggedIn && route.fullPath !== '/login') {
    return redirect('/login')
  } else {
    if (store.state.auth.user) {
      if (!store.state.auth.user.admin) {
        await app.$auth.logout()
        return redirect('/login')
      }
    }
  }
}
