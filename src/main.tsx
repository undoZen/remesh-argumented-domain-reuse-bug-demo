import React, { Suspense, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  useNavigate,
  useRoutes
} from 'react-router-dom';
import { Remesh } from 'remesh';
import { RemeshLogger } from 'remesh-logger';
import { RemeshRoot } from 'remesh-react';

import routes from '~react-pages';

const Nav = () => {
  const navigate = useNavigate()
  const goto = (path: string) => (e: SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate(path)
  }
  return (
    <div>
      <a href="/remesh-single-domain" onClick={goto('/single')}>single domain example</a> |{' '}
      <a href="/remesh-multi-domains" onClick={goto('/multi-1')}>multiple domains (not working)</a>
    </div>
  )
}

const App = () => {
  return (
    <>
      <Nav />
      <Suspense fallback={<></>}>
        {useRoutes(routes)}
      </Suspense>
    </>
  )
}
const store = Remesh.store({
    inspectors: [
        RemeshLogger()
    ],
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RemeshRoot store={store}>
      <Router>
        <App />
      </Router>
    </RemeshRoot>
  </React.StrictMode>
)
