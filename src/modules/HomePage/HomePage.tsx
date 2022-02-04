import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { API, graphqlOperation } from 'aws-amplify';
import { getNode, listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../atoms/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';
import CartModal from '../../atoms/modals/CartModal';
import { setText } from '../../reducers/editor';
import { initialStateStr } from '../../utils/editor/initialState';
import { setNodesToProps } from '../../reducers/nodes';

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
}

interface HomeProps {
  /**
   * Is archived page or not
   */
  archive?: boolean;
}

const HomePage: FC<HomeProps> = ({ archive }) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
      updateModalIsOpen: state.nodeIdReducer.updateModalIsOpen,
      filterByTitleLetter: state.filterByTitleReducer.filterByTitleLetter,
    };
  });

  const { grid, text, updateModalIsOpen, filterByTitleLetter } = mapStateToProps;
  const dispatch = useDispatch();

  const userEmail = localStorage.getItem('userEmail');
  const { label } = useParams();
  const collabarator = { eq: userEmail };
  const archived = archive ? { eq: true } : { eq: false };

  const titleRef = useRef<HTMLDivElement>();
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const [selectedGaps, setSelectedGaps] = useState([]);
  const [filter, setFilter] = useState({ collabarator, archived });

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
    setSelectedGaps([]);
    dispatch(setText(initialStateStr));
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
  }, [filterByTitleLetter, onFilterByTitle]);

  const onColorChange = useCallback(
    async (id, color, _version) => {
      try {
        const updatedNode = {
          id,
          color,
          _version,
        };

        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });

        getAllNodes();
      } catch (err) {
        throw new Error('Color update error');
      }
    },
    [getAllNodes],
  );

  const onRemoveCart = useCallback(
    async (id, _version) => {
      try {
        await API.graphql({
          query: deleteNode,
          variables: { input: { id, _version } },
        });

        getAllNodes();
      } catch (err) {
        throw new Error('Remove node error');
      }
    },
    [getAllNodes],
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

        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });

        getAllNodes();
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [getAllNodes],
  );

  const onChangeArchived = useCallback(
    async (id, archiveAttr, _version, title, description) => {
      try {
        const updatedNode = {
          id,
          archived: archiveAttr,
          _version,
          title: title.toLowerCase(),
          description,
        };

        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });

        getAllNodes();
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [getAllNodes],
  );

  const toggleGapsCart = useCallback(
    async (id, _version, gap) => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartGaps = cart.gaps;

        const updatedGaps = cartGaps.includes(gap)
          ? cartGaps.filter((el) => el !== gap)
          : [...cartGaps, gap];

        const updatedNode = { id, _version, gaps: updatedGaps };

        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        getAllNodes();
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [getAllNodes],
  );

  const onSetNodes = useCallback(async () => {
    try {
      const node = {
        title: titleRef.current.innerText.toLowerCase(),
        description: text,
        gaps: selectedGaps,
        pined: defaultPin,
        color: defaultColor,
        archived: false,
        collabarator: userEmail,
      };

      await API.graphql({ query: createNode, variables: { input: node } });
      getAllNodes();
      cleanUp();
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [cleanUp, defaultPin, text, userEmail, selectedGaps, defaultColor, getAllNodes]);

  const onSetArchive = useCallback(async () => {
    try {
      const node = {
        title: titleRef.current.innerText.toLowerCase(),
        description: text,
        gaps: selectedGaps,
        pined: defaultPin,
        color: defaultColor,
        archived: true,
        collabarator: userEmail,
      };

      await API.graphql({ query: createNode, variables: { input: node } });
      getAllNodes();
      cleanUp();
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [cleanUp, defaultPin, text, userEmail, selectedGaps, defaultColor, getAllNodes]);

  useEffect(() => {
    getAllNodes();
  }, [getAllNodes]);

  useEffect(() => {
    getAllNodes();

    if (updateModalIsOpen) {
      return () => {
        setNodes([]);
      };
    }
  }, [updateModalIsOpen, getAllNodes]);

  useEffect(() => {
    const gaps = { contains: label };

    const newFiler =
      label !== undefined ? { collabarator, archived, gaps } : { collabarator, archived };
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
          !isSidebarOpen && styles.open,
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
