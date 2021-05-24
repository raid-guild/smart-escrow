import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';

import { Home } from './pages/Home';
import { RegisterEscrow } from './pages/RegisterEscrow';
import { EscrowInfo } from './pages/EscrowInfo';

import { theme, globalStyles } from './theme/theme';
import { Layout } from './shared/Layout';

import { ErrorBoundary } from './components/ErrorBoundary';

import AppContextProvider from './context/AppContext';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Global styles={globalStyles} />
      <ErrorBoundary>
        <AppContextProvider>
          <Router>
            <Layout>
              {windowWidth < 750 ? (
                <p style={{ fontFamily: theme.fonts.mono, padding: '2rem' }}>
                  Use a larger screen for better UX by the time we add support
                  to smaller screens.
                </p>
              ) : (
                <Switch>
                  <Route path='/' exact component={Home} />
                  <Route
                    path='/register-escrow'
                    exact
                    component={RegisterEscrow}
                  />
                  <Route path='/escrow/:id' exact component={EscrowInfo} />
                  <Redirect to='/' />
                </Switch>
              )}
            </Layout>
          </Router>
        </AppContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
