import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { DataStore } from '@aws-amplify/datastore';
import { API } from 'aws-amplify';
import { Node } from '../../models';
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

const HomePage: FC = () => {
  const userEmail = localStorage.getItem('userEmail');
  const { label } = useParams();
  const collabarator = { eq: userEmail };
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const titleRef = useRef<HTMLDivElement>();
  const [filter, setFilter] = useState({ collabarator });
  const [selectedGaps, setSelectedGaps] = useState([]);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
    };
  });

  const { grid, text } = mapStateToProps;
  const dispatch = useDispatch();

  const toggleGaps = useCallback(
    (gap) => {
      console.log(`gap`, gap);
      setSelectedGaps((pre) =>
        !pre.includes(gap) ? [...selectedGaps, gap] : selectedGaps.filter((elm) => elm !== gap),
      );
    },
    [selectedGaps],
  );
  console.log(`selectedGaps`, selectedGaps);

  const cleanUp = useCallback(() => {
    titleRef.current.innerHTML = '';
    setDefaultPin(false);
    dispatch(setText(initialStateStr));
  }, [dispatch]);

  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, []);

  const onDefaultColor = useCallback((optionalColor) => {
    setDefaultColor(optionalColor);
  }, []);

  async function getAllNodes() {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      // eslint-disable-next-line no-console
      setNodes(items);
      console.log(`items`, items);
    } catch (err) {
      throw new Error('Get Nodes Error');
    }
  }

  const onColorChange = useCallback(async (id, color, _version) => {
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
    } catch (err) {
      throw new Error('Color update error');
    }
  }, []);

  const onRemoveCart = useCallback(async (id, _version) => {
    try {
      await API.graphql({ query: deleteNode, variables: { input: { id, _version } } });
    } catch (err) {
      throw new Error('Remove node error');
    }
  }, []);

  const onChangePin = useCallback(async (id, pined, _version) => {
    try {
      const updatedNode = {
        id,
        pined,
        _version,
      };

      await API.graphql({
        query: updateNode,
        variables: { input: updatedNode },
      });
    } catch (err) {
      throw new Error('Update node error');
    }
  }, []);

  const onSetNodes = useCallback(async () => {
    try {
      const node = {
        title: titleRef.current.innerText,
        description: text,
        gaps: [],
        pined: defaultPin,
        archived: false,
        trashed: false,
        collabarator: userEmail,
      };

      await API.graphql({ query: createNode, variables: { input: node } });
      cleanUp();
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [cleanUp, defaultPin, text, userEmail]);

  const onSetArchive = useCallback(async () => {
    try {
      setDefaultPin(false);
      setDefaultColor('default');

      await DataStore.save(
        new Node({
          pined: defaultPin,
          archived: true,
        }),
      );
    } catch (err) {
      throw new Error('Set archive error');
    }
  }, []);

  useEffect(() => {
    getAllNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRemoveCart, onChangePin, onColorChange, filter]);

  useEffect(() => {
    const gaps = { contains: label };
    const newFiler = label !== undefined ? { collabarator, gaps } : { collabarator };
    setFilter(newFiler);
  }, [label]);

  return (
    <Layout>
      <div className={classNames(styles.home_page, grid && styles.column)}>
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
        <CartLayout
          onChangePin={onChangePin}
          onChangeArchived={(e) => e}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={nodes}
          onColorChange={onColorChange}
        />
        <AddLinkModal />
        <CartModal />
      </div>
    </Layout>
  );
};

export default HomePage;
