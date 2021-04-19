import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

import { Container } from '../shared/Container';

import { AppContext } from '../context/AppContext';

import { HomeButtonManager } from '../utils/ButtonManager';

import '../sass/styles.scss';

export const Home = () => {
  const context = useContext(AppContext);
  const [ID, setID] = useState('');
  const [validId, setValidId] = useState(false);

  const history = useHistory();

  const validateID = async () => {
    if (ID === '') return alert('ID cannot be empty!');
    context.updateLoadingState();
    let result = await context.setAirtableState(ID);
    setValidId(result.validRaidId);
    context.updateLoadingState();
    if (!result.validRaidId) alert('ID not found!');
  };

  const registerClickHandler = async () => {
    await validateID();
    if (validId) history.push('/register-escrow');
  };

  const escrowClickHandler = async () => {
    await validateID();
    if (validId) history.push('/escrow');
  };

  let button_component = HomeButtonManager(
    context,
    validId,
    escrowClickHandler,
    registerClickHandler,
    validateID
  );

  return (
    <Container>
      <div className='home'>
        <motion.div
          className='home-sub-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.h3> An Internal Service for RaidGuild Invoicing.</motion.h3>
          <motion.input
            type='text'
            placeholder='Enter Raid ID'
            onChange={(event) => setID(event.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          ></motion.input>

          {button_component}
        </motion.div>
      </div>
    </Container>
  );
};
