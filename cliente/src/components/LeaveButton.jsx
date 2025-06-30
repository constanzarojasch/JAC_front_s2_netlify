// components/LeaveButton.jsx
export default function LeaveButton({ onLeave, disabled, children }) {
  return (
    <button
      type="button"
      className="btn leave-button"
      onClick={onLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
