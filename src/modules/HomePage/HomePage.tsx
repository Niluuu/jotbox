import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { API } from 'aws-amplify';
import { listNodes } from '../../graphql/queries';
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
  color: string;
}

interface HomeProps {
  /**
   * Is archived page or not
   */
  archive: boolean;
}

const HomePage: FC<HomeProps> = ({ archive }) => {
  const userEmail = localStorage.getItem('userEmail');
  const { label } = useParams();
  const collabarator = { eq: userEmail };
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const titleRef = useRef<HTMLDivElement>();
  const archived = archive ? { eq: true } : { eq: false };
  const [filter, setFilter] = useState({ collabarator, archived });
  const [selectedGaps, setSelectedGaps] = useState([]);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
      updateModalIsOpen: state.nodeIdReducer.updateModalIsOpen,
    };
  });

  const { grid, text, updateModalIsOpen } = mapStateToProps;
  const dispatch = useDispatch();

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
    setSelectedGaps(label !== undefined ? [] : [label]);
    dispatch(setText(initialStateStr));
  }, [dispatch, label]);

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
      setNodes(items);
      dispatch(setNodesToProps(items));
    } catch (err) {
      throw new Error('Get Nodes Error');
    }
  }, [filter, dispatch]);

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
          title,
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

  const onSetNodes = useCallback(async () => {
    try {
      const node = {
        title: titleRef.current.innerText,
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
        title: titleRef.current.innerText,
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

  return (
    <Layout>
      <div className={classNames(styles.home_page, grid && styles.column)}>
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
        />
        <AddLinkModal />
        <CartModal />
      </div>
    </Layout>
  );
};

export default HomePage;
