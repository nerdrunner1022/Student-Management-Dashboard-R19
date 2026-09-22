import { Slide, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export function ToastCustomIcon({ type }) {
  switch (type) {
    case 'success':
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700">
          <FontAwesomeIcon icon={faCheck} className="text-xs" />
        </div>
      );
    case 'error':
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-xs" />
        </div>
      );
    case 'warning':
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs" />
        </div>
      );
    case 'info':
    default:
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[#17324d]">
          <FontAwesomeIcon icon={faCircleInfo} className="text-xs" />
        </div>
      );
  }
}

ToastCustomIcon.propTypes = {
  type: PropTypes.string,
};

export function ToastCustomCloseButton({ closeToast }) {
  return (
    <button
      type="button"
      onClick={closeToast}
      className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#17324d]"
      aria-label="Close notification"
      title="Close"
    >
      <FontAwesomeIcon icon={faXmark} className="text-xs" />
    </button>
  );
}

ToastCustomCloseButton.propTypes = {
  closeToast: PropTypes.func,
};

export default function CustomToastContainer(props) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      newestOnTop
      closeOnClick
      draggable={false}
      transition={Slide}
      icon={ToastCustomIcon}
      closeButton={ToastCustomCloseButton}
      {...props}
    />
  );
}
