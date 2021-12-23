import { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import HomePage from '../HomePage/HomePage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import ConfirmPage from '../SignUpPage/Confirm';
import ArchievePage from '../ArchievePage/ArchievePage';
import TrashPage from '../TrashPage/TrashPage';
import { listGapss } from '../../graphql/queries';

const App: FC = () => {
  const [gapsRoute, setGapsRoute] = useState([]);

  async function getGaps() {
    try {
      const gaps = await API.graphql(graphqlOperation(listGapss));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      // setGapsRoute(gaps.data.listGapss.items);
    } catch (err) {
      console.log(`err`, err);
    }
  }

  useEffect(() => {
    getGaps();
  }, []);

  return (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      {gapsRoute.map((gap) => (
          <ProtectedRoute path={`/gap/:${gap}`} component={HomePage} />
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
