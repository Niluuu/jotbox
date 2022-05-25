/* eslint-disable max-lines */
import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { API } from 'aws-amplify';
import { getNode, listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../atoms/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';
import CartModal from '../../atoms/modals/CartModal';
import { toggleOnCreateFunctionCall } from '../../reducers/editor';
import { setNodesToProps } from '../../reducers/nodes';
import { setInputCollabaratorUsers } from '../../reducers/collabarator';
import NotFound from '../../component/NotFound/NotFound';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  labels: string[];
  _version: number;
  _deleted: boolean;
  color: string;
  collabarators: string[];
  collabarator: string;
}

interface HomeProps {
  /**
   * Is archived page or not
   */
  archive?: boolean;
}

const HomePage: FC<HomeProps> = () => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
      updateModalIsOpen: state.nodeIdReducer.updateModalIsOpen,
      filterByTitleLetter: state.filterByTitleReducer.filterByTitleLetter,
      updateNodes: state.nodesReducer.updateNodes,
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      refreshPage: state.refreshPageReducer.refreshPage,
      updatedText: state.editorReducer.updatedText,
    };
  });

  const {
    grid,
    text,
    filterByTitleLetter,
    updateNodes,
    inputCollabaratorUsers,
    refreshPage,
    updatedText,
  } = mapStateToProps;
  const dispatch = useDispatch();

  const userEmail = localStorage.getItem('userEmail');
  const collabarators = { contains: userEmail };

  const titleRef = useRef<HTMLDivElement>();
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const [selectedLabels, setselectedLabels] = useState([]);
  const [filter] = useState({ collabarators });

  const onAddDefaultImage = useCallback(async (image: any): Promise<void> => {
    try {
      console.log(image);
    } catch (err) {
      throw new Error('Update node error');
    }
  }, []);

  const togglelabels = useCallback(
    (label) => {
      setselectedLabels((pre) =>
        !pre.includes(label)
          ? [...selectedLabels, label]
          : selectedLabels.filter((elm) => elm !== label),
      );
    },
    [selectedLabels],
  );

  const cleanUp = useCallback(() => {
    titleRef.current.innerHTML = '';
    setDefaultPin(false);
    setDefaultColor('default');
    dispatch(setInputCollabaratorUsers([]));
    setselectedLabels([]);
    dispatch(toggleOnCreateFunctionCall(true));

    setTimeout(() => {
      dispatch(toggleOnCreateFunctionCall(false));
    }, 500);
  }, [dispatch]);

  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, []);

  const onDefaultColor = useCallback((optionalColor) => {
    setDefaultColor(optionalColor);
  }, []);

  const getAllNodes = useCallback(async () => {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      // eslint-disable-next-line no-underscore-dangle
      const filteredItems = items.filter((elm: CartProps) => elm._deleted === null);

      setNodes(filteredItems);
      dispatch(setNodesToProps(filteredItems));
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

      setNodes(newNodes);
    } catch (err) {
      throw new Error('Error filter by Letter');
    }
  }, [getAllNodes, filterByTitleLetter]);

  useEffect(() => {
    onFilterByTitle();
  }, [updateNodes, filterByTitleLetter, onFilterByTitle]);

  const onColorChange = useCallback(
    async (id: string, color: string, _version: number): Promise<CartProps> => {
      try {
        const updatedNode = {
          id,
          color,
          _version,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        setNodes(nodes.map((newCart) => (newCart.id === id ? item : newCart)));
        return item;
      } catch (err) {
        throw new Error('Color update error');
      }
    },
    [nodes],
  );

  const onRemoveCart = useCallback(
    async (id: string, _version: number): Promise<CartProps> => {
      try {
        const data = await API.graphql({
          query: deleteNode,
          variables: { input: { id, _version } },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.deleteNode;

        // eslint-disable-next-line no-underscore-dangle
        if (item._deleted) {
          setNodes(nodes.filter((newCart) => newCart.id !== id));
        }
        return item;
      } catch (err) {
        throw new Error('Remove node error');
      }
    },
    [nodes],
  );

  const onChangePin = useCallback(
    async (id: string, pined: boolean, _version: number): Promise<CartProps> => {
      try {
        const updatedNode = {
          id,
          pined,
          archived: false,
          _version,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        setNodes(nodes.map((newCart) => (newCart.id === id ? item : newCart)));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const onChangeCollabarators = useCallback(
    async (id: string, _version: number, cartCollabarators: string[]): Promise<CartProps> => {
      try {
        const updatedNode = {
          id,
          _version,
          collabarators: cartCollabarators,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        setNodes(nodes.map((newCart) => (newCart.id === id ? item : newCart)));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const onChangeArchived = useCallback(
    async (
      id: string,
      archiveAttr: boolean,
      _version: number,
      title: string,
      description: string,
    ): Promise<CartProps> => {
      try {
        const updatedNode = {
          id,
          archived: archiveAttr,
          _version,
          title,
          description,
          pined: false,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        setNodes(nodes.map((newCart) => (newCart.id === id ? item : newCart)));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const toggleCartLabels = useCallback(
    async (id: string, _version: number, label: string): Promise<CartProps> => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartlabels = cart.labels;

        const updatedlabels = cartlabels.includes(label)
          ? cartlabels.filter((cartlabel: string) => cartlabel !== label)
          : [...cartlabels, label];

        const updatedNode = { id, _version, labels: updatedlabels };

        const newData = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = newData.data.updateNode;

        setNodes(nodes.map((newCart) => (newCart.id === id ? item : newCart)));
        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [nodes],
  );

  const onSetNodes = useCallback(async () => {
    try {
      const newCollabarators = [userEmail, ...inputCollabaratorUsers];
      const node = {
        title: titleRef.current.innerText,
        description: text,
        labels: selectedLabels,
        pined: defaultPin,
        color: defaultColor,
        archived: false,
        collabarator: userEmail,
        collabarators: newCollabarators,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const parsedText = JSON.parse(text);

      if (parsedText.blocks[0].text) {
        const data = await API.graphql({ query: createNode, variables: { input: node } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.createNode;

        setNodes([item, ...nodes]);
        cleanUp();
      }
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [
    inputCollabaratorUsers,
    userEmail,
    text,
    selectedLabels,
    defaultPin,
    defaultColor,
    nodes,
    cleanUp,
  ]);

  const onSetArchive = useCallback(async () => {
    try {
      const newCollabarators = [userEmail, ...inputCollabaratorUsers];
      const node = {
        title: titleRef.current.innerText,
        description: text,
        labels: selectedLabels,
        pined: defaultPin,
        color: defaultColor,
        archived: true,
        collabarator: userEmail,
        collabarators: newCollabarators,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const parsedText = JSON.parse(text);

      if (parsedText.blocks[0].text) {
        const data = await API.graphql({ query: createNode, variables: { input: node } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.createNode;

        setNodes([item, ...nodes]);
        cleanUp();
      }
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [
    userEmail,
    inputCollabaratorUsers,
    text,
    selectedLabels,
    defaultPin,
    defaultColor,
    nodes,
    cleanUp,
  ]);

  const onChangeNodeContent = useCallback(
    async (id: string, title: string, _version: number): Promise<void> => {
      try {
        const updatedNode = {
          id,
          _version,
          title,
          description: updatedText,
        };

        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });

        const newNodes = nodes.map((newCart) =>
          newCart.id === id ? { ...newCart, ...updatedNode } : newCart,
        );
        setNodes([]);
        setNodes(newNodes);
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes, updatedText],
  );

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

  const onSelectedLabels = useCallback(
    (elm) => {
      if (!selectedLabels.includes(elm)) setselectedLabels([elm, ...selectedLabels]);
    },
    [selectedLabels],
  );

  const HomePageSub = useCallback(
    (archivePage: boolean) => {
      const notes = archivePage
        ? nodes.filter((cart) => cart.archived)
        : nodes.filter((cart) => !cart.archived);
      return (
        <div className={classNames(styles.home_page, grid && styles.column)}>
          {!archivePage && (
            <div className={styles.home_page__main_input}>
              <MainInput
                focused={focused}
                setFocused={setFocused}
                onSetArchive={onSetArchive}
                onSetNodes={onSetNodes}
                defaultPin={defaultPin}
                onDefaultPin={onDefaultPin}
                titleRef={titleRef}
                defaultColor={defaultColor}
                onDefaultColor={onDefaultColor}
                selectedLabels={selectedLabels}
                togglelabels={togglelabels}
                onSelectedLabels={onSelectedLabels}
                onAddDefaultImage={onAddDefaultImage}
              />
            </div>
          )}
          <CartLayout
            archivePage={archivePage}
            gridType={grid}
            carts={notes}
            onChangePin={onChangePin}
            onChangeArchived={onChangeArchived}
            onRemoveCart={onRemoveCart}
            onColorChange={onColorChange}
            toggleCartLabels={toggleCartLabels}
          />
          <CartModal
            onChangeNodeContent={onChangeNodeContent}
            onChangeCollabarators={onChangeCollabarators}
            onChangePin={onChangePin}
            onRemoveCart={onRemoveCart}
            onChangeArchived={onChangeArchived}
            toggleCartLabels={toggleCartLabels}
            onColorChange={onColorChange}
          />
        </div>
      );
    },
    [
      onAddDefaultImage,
      onChangeNodeContent,
      nodes,
      grid,
      focused,
      onSetArchive,
      onSetNodes,
      defaultPin,
      onDefaultPin,
      defaultColor,
      onDefaultColor,
      selectedLabels,
      togglelabels,
      onSelectedLabels,
      onChangePin,
      onChangeArchived,
      onRemoveCart,
      onColorChange,
      toggleCartLabels,
      onChangeCollabarators,
    ],
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
