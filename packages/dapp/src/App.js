import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { Home } from './pages/Home';
import { RaidInfo } from './pages/RaidInfo';
import { RegisterEscrow } from './pages/RegisterEscrow';
import { EscrowInfo } from './pages/EscrowInfo';

import { theme } from './theme';
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
      <ErrorBoundary>
        <AppContextProvider>
          <Router>
            <Layout>
              {windowWidth < 750 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{ fontFamily: theme.fonts.mono, padding: '2rem' }}
                >
                  Use a larger screen for better UX by the time we add support
                  to smaller screens.
                </motion.p>
              ) : (
                <Switch>
                  <Route path='/' exact component={Home} />
                  <Route path='/raid-info' exact component={RaidInfo} />
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
