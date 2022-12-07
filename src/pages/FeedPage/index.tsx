import useModal from '../../hooks/useModal';
import Modal from '../../common/ui/Modal';

export function FeedPage() {
  const { isOpen, toggle } = useModal();
  const handleClick = () => {
    toggle();
  };
  return (
    <>
      <h1 onClick={handleClick}>Feed Page</h1>;<Modal isOpen={isOpen} toggle={toggle}></Modal>
    </>
  );
}
