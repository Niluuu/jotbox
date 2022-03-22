/* eslint-disable max-lines */
import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { API } from 'aws-amplify';
import { EditorState, ContentState } from 'draft-js';
import { getNode, listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../atoms/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';
import CartModal from '../../atoms/modals/CartModal';
import { toggleOnCreateFunctionCall } from '../../reducers/editor';
import { setNodesToProps } from '../../reducers/nodes';
import { setInputCollabaratorUsers } from '../../reducers/collabarator';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: string[];
  _version: number;
  _deleted: boolean;
  color: string;
  collabarators: string[];
}

interface HomeProps {
  /**
   * Is archived page or not
   */
  archive: boolean;
}

const HomePage: FC<HomeProps> = ({ archive }) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
      updateModalIsOpen: state.nodeIdReducer.updateModalIsOpen,
      filterByTitleLetter: state.filterByTitleReducer.filterByTitleLetter,
      updateNodes: state.nodesReducer.updateNodes,
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      refreshPage: state.refreshPageReducer.refreshPage,
    };
  });

  const {
    grid,
    text,
    updateModalIsOpen,
    filterByTitleLetter,
    updateNodes,
    inputCollabaratorUsers,
    refreshPage,
  } = mapStateToProps;
  const dispatch = useDispatch();

  const { label } = useParams();
  const userEmail = localStorage.getItem('userEmail');
  const collabarators = { contains: userEmail };
  const archived = archive ? { eq: true } : { eq: false };

  const titleRef = useRef<HTMLDivElement>();
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const [selectedGaps, setSelectedGaps] = useState([]);
  const [filter, setFilter] = useState({ collabarators, archived });

  const toggleGaps = useCallback(
    (gap) => {
      setSelectedGaps((pre) =>
        !pre.includes(gap) ? [...selectedGaps, gap] : selectedGaps.filter((elm) => elm !== gap),
      );
    },
    [selectedGaps],
  );

  const cleanUp = useCallback(() => {
    titleRef.current.innerHTML = '';
    setDefaultPin(false);
    setDefaultColor('default');
    dispatch(setInputCollabaratorUsers([]));
    setSelectedGaps([]);
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
      const filteredItems = items.filter((elm) => elm._deleted === null);

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
      const newNodes = data.filter((elm) =>
        elm.title.toLowerCase().includes(filterByTitleLetter.toLowerCase()),
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
    async (id, color, _version) => {
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

        setNodes(nodes.map((elm) => (elm.id === id ? item : elm)));
        return item;
      } catch (err) {
        throw new Error('Color update error');
      }
    },
    [nodes],
  );

  const onRemoveCart = useCallback(
    async (id, _version) => {
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
          setNodes(nodes.filter((elm) => elm.id !== id));
        }
        return item;
      } catch (err) {
        throw new Error('Remove node error');
      }
    },
    [nodes],
  );

  const onChangePin = useCallback(
    async (id, pined, _version) => {
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

        setNodes(nodes.map((elm) => (elm.id === id ? item : elm)));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const onChangeCollabarators = useCallback(
    async (id, _version, cartCollabarators) => {
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

        setNodes(nodes.map((elm) => (elm.id === id ? item : elm)));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const onChangeArchived = useCallback(
    async (id, archiveAttr, _version, title, description) => {
      try {
        const updatedNode = {
          id,
          archived: archiveAttr,
          _version,
          title,
          description,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        if (item.archived === archiveAttr) {
          setNodes(nodes.filter((elm) => elm.id !== id));
        }
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [nodes],
  );

  const toggleGapsCart = useCallback(
    async (id, _version, gaps) => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartGaps = cart.gaps;

        const updatedGaps = cartGaps.includes(gaps)
          ? cartGaps.filter((el) => el !== gaps)
          : [...cartGaps, gaps];

        const updatedNode = { id, _version, gaps: updatedGaps };

        const newData = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = newData.data.updateNode;

        setNodes(nodes.map((elm) => (elm.id === id ? item : elm)));
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
        gaps: selectedGaps,
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
    selectedGaps,
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
        gaps: selectedGaps,
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
        await API.graphql({ query: createNode, variables: { input: node } });
        cleanUp();
      }
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [userEmail, inputCollabaratorUsers, text, selectedGaps, defaultPin, defaultColor, cleanUp]);

  useEffect(() => {
    getAllNodes();
  }, [getAllNodes]);

  useEffect(() => {
    getAllNodes();
  }, [refreshPage, getAllNodes]);

  useEffect(() => {
    const gaps = { contains: label };

    const newFiler =
      label !== undefined ? { collabarators, archived, gaps } : { collabarators, archived };
    setFilter(newFiler);
    setSelectedGaps(label !== undefined ? [label] : []);
  }, [label]);

  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = () => setisSidebarOpen((pre) => !pre);

  return (
    <Layout toggleSider={toggleSider} isSidebarOpen={isSidebarOpen}>
      <div
        className={classNames(
          styles.home_page,
          grid && styles.column,
          isSidebarOpen && styles.open,
        )}
      >
        {!archive && (
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
              selectedGaps={selectedGaps}
              toggleGaps={toggleGaps}
            />
          </div>
        )}
        <CartLayout
          gridType={grid}
          carts={nodes}
          onChangePin={onChangePin}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          onColorChange={onColorChange}
          toggleGapsCart={toggleGapsCart}
        />
        <AddLinkModal />
        <CartModal
          onChangeCollabarators={onChangeCollabarators}
          onChangePin={onChangePin}
          onRemoveCart={onRemoveCart}
          onChangeArchived={onChangeArchived}
          toggleGapsCart={toggleGapsCart}
          onColorChange={onColorChange}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
