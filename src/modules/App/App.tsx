import { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataStore } from 'aws-amplify';

import HomePage from '../HomePage/HomePage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import ConfirmPage from '../SignUpPage/Confirm';
import { Gaps } from '../../models';
import {getNodes} from '../../api/nodes';
import gapFilter from '../../utils/hooks/gapFilter';

const App: FC = () => {
  const [gapsRoute, setGaps] = useState([]) 

  async function fetchGaps() {
    try {
      // const gapsResponse = await DataStore.query(Gaps)
      // setGaps(gapsResponse)
      const gapsResponse = await getNodes()
      setGaps(gapFilter(gapsResponse))
    } catch (err) {
      console.log('err', err);
    }
  }
  
  useEffect(() => {
    fetchGaps()
  }, [])
  
  return (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      { gapsRoute.map((gap) => (
        <ProtectedRoute path={`/gap/${gap}`} component={() => 
          <HomePage gapsFilterKey={gap} />} /> 
      ))}
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={<div>UNDEFINED PAGE</div>}/>
    </Switch>
  );
};
 
export default App;
