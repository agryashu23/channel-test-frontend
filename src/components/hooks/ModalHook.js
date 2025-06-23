// src/hooks/useModal.js
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '../../redux/slices/modalSlice';

const useModal = () => {
  const dispatch = useDispatch();
  // const modals = useSelector((state) => state.modals);

  const handleOpenModal = (modalName, link = '') => {
    dispatch(openModal({ modalName, link }));
  };

  const handleCloseModal = (modalName) => {
    dispatch(closeModal(modalName));
  };

  return {  handleOpenModal, handleCloseModal };
};

export default useModal;
