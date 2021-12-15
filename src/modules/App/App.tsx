import { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import ConfirmPage from '../SignUpPage/Confirm';
import { getNodes } from '../../api/nodes';
import gapFilter from '../../utils/hooks/gapFilter';
import ArchievePage from '../ArchievePage/ArchievePage';
import TrashPage from '../TrashPage/TrashPage';

const App: FC = () => {
  const [gapsRoute, setGaps] = useState([]);

  async function fetchGaps() {
    try {
      // const gapsResponse = await DataStore.query(Gaps)
      // setGaps(gapsResponse)
      const gapsResponse = await getNodes();
      setGaps(gapFilter(gapsResponse));
    } catch (err) {
      console.log('err', err);
    }
  }

  useEffect(() => {
    fetchGaps();
  }, []);

  return (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      {gapsRoute.map((gap) => (
        <ProtectedRoute path={`/gap/${gap}`} component={() => <HomePage gapsFilterKey={gap} />} />
      ))}
      <ProtectedRoute exact path="/archive" component={ArchievePage} />
      <ProtectedRoute exact path="/trash" component={TrashPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={<div>UNDEFINED PAGE</div>} />
    </Switch>
  );
};

export default App;
