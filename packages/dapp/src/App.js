import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import { Home } from './pages/Home';
import { RaidInfo } from './pages/RaidInfo';
import { RegisterEscrow } from './pages/RegisterEscrow';
import { EscrowInfo } from './pages/EscrowInfo';

import { ErrorBoundary } from './components/ErrorBoundary';

import { Web3ContextProvider } from './context/Web3Context';

const App = () => {
  return (
    <ErrorBoundary>
      <Web3ContextProvider>
        <Router>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/raid-info' exact component={RaidInfo} />
            <Route path='/register-escrow' exact component={RegisterEscrow} />
            <Route path='/escrow/:id' exact component={EscrowInfo} />
            <Redirect to='/' />
          </Switch>
        </Router>
      </Web3ContextProvider>
    </ErrorBoundary>
  );
};

export default App;
