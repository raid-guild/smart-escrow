import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { Home } from './pages/Home';
import { RaidInfo } from './pages/RaidInfo';
import { RegisterEscrow } from './pages/RegisterEscrow';
import { EscrowInfo } from './pages/EscrowInfo';

import { theme } from './theme';
import { Layout } from './shared/Layout';

import { ErrorBoundary } from './components/ErrorBoundary';

import AppContextProvider from './context/AppContext';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <AppContextProvider>
          <Router>
            <Layout>
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
            </Layout>
          </Router>
        </AppContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
