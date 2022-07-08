import { FC, useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { API } from 'aws-amplify';
import { listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../atoms/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import CartModal from '../../atoms/modals/CartModal';
import { getNodesToProps } from '../../reducers/nodes';
import NotFound from '../../component/not-found/NotFound';
import { CartProps } from '../../utils/types';

interface HomeProps {
  archive?: boolean; // Is archived page or not
}

const HomePage: FC<HomeProps> = () => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
      grid: state.layoutGrid.grid,
      updateModalIsOpen: state.nodeIdReducer.updateModalIsOpen,
      filterByTitleLetter: state.filterByTitleReducer.filterByTitleLetter,
      updateNodes: state.nodesReducer.updateNodes,
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      refreshPage: state.refreshPageReducer.refreshPage,
      updatedText: state.editorReducer.updatedText,
    };
  });

  const { nodes, grid, filterByTitleLetter, updateNodes, refreshPage } = mapStateToProps;
  const dispatch = useDispatch();

  const userEmail = localStorage.getItem('userEmail');
  const collabarators = { contains: userEmail };

  const [filter] = useState({ collabarators });

  const getAllNodes = useCallback(async () => {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      // eslint-disable-next-line no-underscore-dangle
      const filteredItems = items.filter((elm: CartProps) => elm._deleted === null);

      dispatch(getNodesToProps(filteredItems));

      return filteredItems;
    } catch (err) {
      throw new Error('Get Nodes Error');
    }
  }, [filter, dispatch]);

  const onFilterByTitle = useCallback(async () => {
    try {
      const data = await getAllNodes();
      const newNodes = data.filter((newCart: CartProps) =>
        newCart.title.toLowerCase().includes(filterByTitleLetter.toLowerCase()),
      );

      dispatch(getNodesToProps(newNodes));
    } catch (err) {
      throw new Error('Error filter by Letter');
    }
  }, [getAllNodes, dispatch, filterByTitleLetter]);

  useEffect(() => {
    onFilterByTitle();
  }, [updateNodes, filterByTitleLetter, onFilterByTitle]);

  useEffect(() => {
    getAllNodes();
  }, [getAllNodes]);

  useEffect(() => {
    getAllNodes();
  }, [refreshPage, getAllNodes]);

  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = useCallback(() => setisSidebarOpen((pre) => !pre), []);

  const [isPage, setIsPage] = useState(false);
  const toggleIsPage = useCallback(() => setIsPage(true), []);

  const HomePageSub = useCallback(
    (archivePage: boolean) => {
      const notes = archivePage
        ? nodes.filter((cart) => cart.archived)
        : nodes.filter((cart) => !cart.archived);
      return (
        <div className={classNames(styles.home_page, grid && styles.column)}>
          {!archivePage && (
            <div className={styles.home_page__main_input}>
              <MainInput />
            </div>
          )}
          <CartLayout archivePage={archivePage} gridType={grid} carts={notes} />
          <CartModal />
        </div>
      );
    },
    [nodes, grid],
  );

  return (
    <div className="layout">
      {!isPage && <Layout toggleSider={toggleSider} isSidebarOpen={isSidebarOpen} />}
      <Switch>
        <Route exact path="/" render={() => HomePageSub(false)} />
        <Route exact path="/labels/:label" render={() => HomePageSub(false)} />
        <Route exact path="/archived" render={() => HomePageSub(true)} />
        <Route path="*" component={() => <NotFound toggleIsPage={toggleIsPage} />} />
      </Switch>
    </div>
  );
};

export default HomePage;
